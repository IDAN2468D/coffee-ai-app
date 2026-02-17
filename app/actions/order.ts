"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/mailer";
import { checkLoyaltyUpgrade } from "@/lib/loyalty";
import { TIER_BENEFITS, UserTier } from "@/lib/tiers";
import { ServerActionResponse, ReOrderResponse } from "@/src/types/index";
import { getReengagementStatus } from "./user";
import { OrderStatus } from "@/lib/enums";

// --- Validation Schemas ---

const OrderItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    size: z.string().optional(),
    image: z.string().optional(),
    // Allow extra fields for backward compatibility if needed, but strip them for processing if strict
});

const CreateOrderSchema = z.object({
    items: z.array(OrderItemSchema),
    total: z.number(),
    shippingDetails: z.any().optional(),
    couponCode: z.string().optional().nullable(),
});

type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// --- Server Actions ---

/**
 * @Architect — createOrder
 * 
 * Migrated from app/api/orders/route.ts
 * specialized handling for "custom" items (creating products on the fly).
 * VIP benefit calculation & Coupon validation.
 * Transactional updates for User (points, spent) and Order creation.
 */
export async function createOrder(data: CreateOrderInput): Promise<ServerActionResponse> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return { success: false, error: "You must be signed in to place an order" };
        }

        const parseResult = CreateOrderSchema.safeParse(data);
        if (!parseResult.success) {
            return { success: false, error: "Invalid order data: " + parseResult.error.message };
        }

        const { items, total, shippingDetails, couponCode } = parseResult.data;

        if (!items || items.length === 0) {
            return { success: false, error: "Cart is empty" };
        }

        // --- Logic from route.ts starts here ---

        // Pre-process items to ensure valid Product IDs
        const finalItems: (typeof items[number] & { id: string })[] = [];

        for (const item of items) {
            // Check if ID is a valid MongoDB ObjectID (24 hex characters)
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.id);

            if (isValidObjectId) {
                // It's a real product
                finalItems.push(item);
            } else {
                // It's a custom item (e.g. "custom-mug-..." or "blend-...")
                let fallbackName = "מוצר מותאם אישית";
                let fallbackCategory = "Equipment";

                if (item.id.includes('mug') || item.name.includes('ספל')) {
                    fallbackName = "ספל בעיצוב אישי";
                    fallbackCategory = "Equipment";
                } else if (item.id.includes('blend') || item.name.includes('בלנד')) {
                    fallbackName = "בלנד אישי";
                    fallbackCategory = "Beans";
                }

                // Try to find an existing generic product for this type
                let realProduct = await prisma.product.findFirst({
                    where: { name: fallbackName }
                });

                // If not found, create it on the fly
                if (!realProduct) {
                    console.log(`[ORDER] Creating generic product for: ${fallbackName}`);
                    realProduct = await prisma.product.create({
                        data: {
                            name: fallbackName,
                            description: "מוצר מותאם אישית שנוצר על ידי הלקוח",
                            price: item.price,
                            image: item.image || "",
                            category: {
                                connectOrCreate: {
                                    where: { id: "65a000000000000000000000" }, // Dummy ID / specific ID logic
                                    create: { name: fallbackCategory }
                                }
                            }
                        }
                    });
                }

                // Push the item with the REAL database ID
                finalItems.push({
                    ...item,
                    id: realProduct.id
                });
            }
        }

        // === VIP BENEFITS ===
        const userRecord = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, tier: true },
        });

        if (!userRecord) return { success: false, error: "User not found" };

        const userTier: UserTier = (userRecord.tier as UserTier) || 'SILVER';
        const benefits = TIER_BENEFITS[userTier];

        const vipDiscountRate = benefits.vipDiscount;
        const shippingFee = benefits.freeShipping ? 0 : benefits.shippingFee;

        const vipDiscount = Math.round(total * vipDiscountRate * 100) / 100;

        // Validate and apply coupon
        let appliedCoupon: string | null = null;
        let discountAmount = 0;

        if (couponCode) {
            const couponKey = couponCode.toUpperCase().trim();
            // Re-implementing VALID_COUPONS logic locally since it was inline in route.ts
            // In a real app, this should be in a separate config or DB
            if (couponKey === 'COFFEE10') {
                const status = await getReengagementStatus();
                if (status.shouldShow) {
                    discountAmount = Math.round(total * 0.10 * 100) / 100;
                    appliedCoupon = couponKey;
                }
            }
        }

        // Final total calculation
        const subtotalAfterDiscounts = Math.round((total - discountAmount - vipDiscount) * 100) / 100;
        const finalTotal = Math.round((subtotalAfterDiscounts + shippingFee) * 100) / 100;

        // Create Order and Update User in Transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: userRecord.id,
                    total: finalTotal,
                    discount: discountAmount,
                    vipDiscount: vipDiscount,
                    shippingFee: shippingFee,
                    appliedCoupon: appliedCoupon,
                    status: OrderStatus.PENDING,
                    shippingAddress: shippingDetails || {},
                    items: {
                        create: finalItems.map((item) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            size: item.size || 'M',
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            // Update User Stats
            const pointsEarned = Math.round(finalTotal * 10);
            await tx.user.update({
                where: { id: userRecord.id },
                data: {
                    points: { increment: pointsEarned },
                    totalSpent: { increment: finalTotal },
                    orderCount: { increment: 1 },
                },
            });

            return newOrder;
        });

        // Check for VIP upgrade
        const loyaltyResult = await checkLoyaltyUpgrade(userRecord.id);

        // Send Email
        if (session.user.name) {
            // Non-blocking email send
            sendOrderConfirmationEmail(session.user.email, session.user.name, order).catch(console.error);
        }

        const pointsEarned = Math.round(finalTotal * 10);

        return {
            success: true,
            data: {
                orderId: order.id,
                pointsEarned,
                appliedCoupon,
                discount: discountAmount,
                vipDiscount,
                shippingFee,
                userTier,
                loyaltyUpgrade: loyaltyResult.justUpgraded ? loyaltyResult.tier : null,
            },
            timestamp: Date.now()
        };

    } catch (error) {
        console.error("createOrder error:", error);
        return { success: false, error: "Failed to create order", timestamp: Date.now() };
    }
}

/**
 * @Frontend — getLastSuccessfulOrder
 * Helper for Quick Re-Order.
 */
export async function getLastSuccessfulOrder(userId: string): Promise<ServerActionResponse> {
    try {
        const lastOrder = await prisma.order.findFirst({
            where: {
                userId: userId,
                status: { in: [OrderStatus.DELIVERED, OrderStatus.OUT_FOR_DELIVERY] },
            },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!lastOrder) return { success: false, error: "No recent orders found", timestamp: Date.now() };

        return { success: true, data: lastOrder, timestamp: Date.now() };
    } catch (error) {
        console.error("getLastSuccessfulOrder error:", error);
        return { success: false, error: "Failed to fetch request", timestamp: Date.now() };
    }
}

/**
 * @Frontend — executeQuickReOrder
 * Duplicates the items into a new pending order.
 * Validates stock and User Tier (VIP check logic can be added here if needed).
 */
export async function executeQuickReOrder(orderId: string): Promise<ReOrderResponse> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return { success: false, error: "Unauthorized", timestamp: Date.now() };
        }

        // Validate Input
        const result = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Order ID").safeParse(orderId);
        if (!result.success) {
            return { success: false, error: "Invalid Order ID format", timestamp: Date.now() };
        }

        const originalOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!originalOrder) {
            return { success: false, error: "Order not found", timestamp: Date.now() };
        }

        // Verify ownership
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.id !== originalOrder.userId) {
            return { success: false, error: "Unauthorized", timestamp: Date.now() };
        }

        // Check stock (Simulated for now as we don't have explicit inventory tracking in schema yet)
        // In a real scenario, we would check product.stock > 0

        // Construct payload for createOrder
        // We calculate total based on CURRENT prices
        let total = 0;
        const validItems = [];

        for (const item of originalOrder.items) {
            // Check if product still exists/is active
            if (!item.product) continue;

            const price = item.product.price;
            total += price * item.quantity;
            validItems.push({
                id: item.productId,
                name: item.product.name,
                price: price,
                quantity: item.quantity,
                size: item.size || undefined,
                image: item.product.image || undefined
            });
        }

        if (validItems.length === 0) {
            return { success: false, error: "No available products from original order", timestamp: Date.now() };
        }

        const payload: CreateOrderInput = {
            items: validItems,
            total,
            shippingDetails: originalOrder.shippingAddress, // Reuse address
            couponCode: null
        };

        const createResult = await createOrder(payload);

        if (!createResult.success) {
            return { success: false, error: createResult.error, timestamp: Date.now() };
        }

        return {
            success: true,
            data: (createResult.data as any)?.orderId, // Extract orderId from generic data
            timestamp: Date.now()
        };

    } catch (error) {
        console.error("executeQuickReOrder error:", error);
        return { success: false, error: "Failed to reorder", timestamp: Date.now() };
    }
}
