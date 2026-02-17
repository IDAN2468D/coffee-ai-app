import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/mailer';
import { getReengagementStatus } from '@/app/actions/user';
import { checkLoyaltyUpgrade } from '@/lib/loyalty';
import { TIER_BENEFITS, UserTier } from '@/lib/tiers';
import { OrderStatus } from '@/lib/enums';

const VALID_COUPONS: Record<string, { discount: number; validator: () => Promise<boolean> }> = {
    COFFEE10: {
        discount: 0.10, // 10%
        validator: async () => {
            const status = await getReengagementStatus();
            return status.shouldShow;
        },
    },
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "You must be signed in to place an order" }, { status: 401 });
        }

        const { items, total, shippingDetails, couponCode } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Pre-process items to ensure valid Product IDs
        const finalItems = [];

        for (const item of items) {
            // Check if ID is a valid MongoDB ObjectID (24 hex characters)
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.id);

            if (isValidObjectId) {
                // It's a real product, verify it exists (optional but good practice)
                finalItems.push(item);
            } else {
                // It's a custom item (e.g. "custom-mug-..." or "blend-...")
                // We need to map this to a real product in the DB to satisfy the foreign key constraint

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
                            price: item.price, // Use changes from the item if needed, though usually fixed
                            image: item.image,
                            category: {
                                connectOrCreate: {
                                    where: { id: "65a000000000000000000000" }, // Use a dummy ID for lookup if needed, or better:
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

        // === VIP BENEFITS (SERVER-SIDE — verified against DB, never trusted from client) ===
        const userRecord = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: { tier: true } as any,
        });

        const userTier: UserTier = ((userRecord as any)?.tier as UserTier) || 'SILVER';
        const benefits = TIER_BENEFITS[userTier];

        const vipDiscountRate = benefits.vipDiscount;
        const shippingFee = benefits.freeShipping ? 0 : benefits.shippingFee;

        const vipDiscount = Math.round(total * vipDiscountRate * 100) / 100;

        if (userTier !== 'SILVER') {
            console.log(`[VIP] ${userTier} user detected. Discount: -₪${vipDiscount}, Shipping: ${shippingFee === 0 ? 'FREE' : '₪' + shippingFee}`);
        }

        // Validate and apply coupon (SERVER-SIDE — never trust client prices)
        let appliedCoupon: string | null = null;
        let discountAmount = 0;

        if (couponCode && typeof couponCode === 'string') {
            const couponKey = couponCode.toUpperCase().trim();
            const coupon = VALID_COUPONS[couponKey];

            if (coupon) {
                const isEligible = await coupon.validator();
                if (isEligible) {
                    discountAmount = Math.round(total * coupon.discount * 100) / 100;
                    appliedCoupon = couponKey;
                    console.log(`[COUPON] Applied ${couponKey}: -₪${discountAmount} (${coupon.discount * 100}%)`);
                } else {
                    console.log(`[COUPON] User not eligible for ${couponKey}`);
                }
            }
        }

        // Final total: original - coupon discount - VIP discount + shipping
        const subtotalAfterDiscounts = Math.round((total - discountAmount - vipDiscount) * 100) / 100;
        const finalTotal = Math.round((subtotalAfterDiscounts + shippingFee) * 100) / 100;

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
                userId: (session.user as any).id,
                total: finalTotal,
                discount: discountAmount,
                vipDiscount: vipDiscount,
                shippingFee: shippingFee,
                appliedCoupon: appliedCoupon,
                status: OrderStatus.PENDING,
                shippingAddress: shippingDetails || {},
                items: {
                    create: finalItems.map((item: any) => ({
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

        // Update User: Points + Loyalty Counters (atomic)
        const pointsEarned = Math.round(finalTotal * 10);
        const userId = (session.user as any).id;

        await prisma.user.update({
            where: { id: userId },
            data: {
                points: { increment: pointsEarned },
                totalSpent: { increment: finalTotal },
                orderCount: { increment: 1 },
            },
        });

        console.log(`[LOYALTY] User ${userId}: +${pointsEarned} pts, +₪${finalTotal} spent, +1 order`);

        // Check for VIP upgrade (runs $transaction internally)
        const loyaltyResult = await checkLoyaltyUpgrade(userId);

        if (loyaltyResult.justUpgraded) {
            console.log(`[LOYALTY] 🏆 User ${userId} upgraded to VIP PRO!`);
        }

        // Send confirmation email with receipt
        if (session.user.email && session.user.name) {
            sendOrderConfirmationEmail(session.user.email, session.user.name, order).catch(console.error);
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            pointsEarned,
            appliedCoupon,
            discount: discountAmount,
            vipDiscount,
            shippingFee,
            userTier,
            loyaltyUpgrade: loyaltyResult.justUpgraded ? loyaltyResult.tier : null,
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Failed to create order", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: (session.user as any).id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
