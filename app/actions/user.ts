"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ServerActionResponse } from "@/src/types/index";

export interface ReengagementData {
    shouldShow: boolean;
    productName: string | null;
    productImage: string | null;
}

/**
 * @Architect — getReengagementStatus
 * 
 * Logic:
 * - User must have at least 1 cancelled order
 * - User must have 0 completed orders
 * - Returns the product name from their last cancelled order
 * 
 * Privacy: Only returns product name + image, no order IDs or prices.
 */
export async function getReengagementStatus(): Promise<ReengagementData> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { shouldShow: false, productName: null, productImage: null };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return { shouldShow: false, productName: null, productImage: null };
        }

        // Check for completed orders — if any exist, user doesn't need re-engagement
        const completedCount = await prisma.order.count({
            where: {
                userId: user.id,
                status: { in: ["completed", "delivered", "shipped"] },
            },
        });

        if (completedCount > 0) {
            return { shouldShow: false, productName: null, productImage: null };
        }

        // Find the most recent cancelled order with product details
        const lastCancelled = await prisma.order.findFirst({
            where: {
                userId: user.id,
                status: "cancelled",
            },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    take: 1,
                    include: {
                        product: {
                            select: { name: true, image: true },
                        },
                    },
                },
            },
        });

        if (!lastCancelled || lastCancelled.items.length === 0) {
            return { shouldShow: false, productName: null, productImage: null };
        }

        const firstItem = lastCancelled.items[0];

        return {
            shouldShow: true,
            productName: firstItem.product.name,
            productImage: firstItem.product.image,
        };
    } catch (error) {
        console.error("Re-engagement status error:", error);
        return { shouldShow: false, productName: null, productImage: null };
    }
}

/**
 * @Architect — processLoyaltyProgression
 *
 * Server Action: checks VIP qualification for current user.
 * Uses live DB queries (not cached counters) to exclude cancelled/refunded orders.
 *
 * Called from Dashboard or post-checkout to get real-time loyalty status.
 */
export async function processLoyaltyProgression(): Promise<ServerActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: 'Not authenticated', timestamp: Date.now() };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return { success: false, error: 'User not found', timestamp: Date.now() };
        }

        const { checkLoyaltyUpgrade } = await import('@/lib/loyalty');
        const loyaltyStatus = await checkLoyaltyUpgrade(user.id);

        return {
            success: true,
            data: loyaltyStatus,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error("Loyalty progression error:", error);
        return { success: false, error: 'Internal error', timestamp: Date.now() };
    }
}
