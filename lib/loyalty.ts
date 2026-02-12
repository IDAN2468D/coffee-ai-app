/**
 * @Architect — Loyalty Progression Engine
 *
 * Tiers:
 *  - STANDARD: 0-2 orders AND <₪500 total spend
 *  - PRO:      3+ orders OR ≥₪500 total spend (LIFETIME — no downgrade)
 *
 * Called after every successful order to check for auto-upgrade.
 */

import { prisma } from '@/lib/prisma';

export type LoyaltyTier = 'STANDARD' | 'PRO';

export interface LoyaltyStatus {
    tier: LoyaltyTier;
    orderCount: number;
    totalSpent: number;
    ordersToVip: number;      // remaining orders needed (0 if already VIP)
    spendToVip: number;       // remaining spend needed (0 if already VIP)
    justUpgraded: boolean;    // true if this check triggered an upgrade
}

const VIP_ORDER_THRESHOLD = 3;
const VIP_SPEND_THRESHOLD = 500;

/**
 * Check and execute loyalty upgrade after an order.
 * Uses Prisma $transaction for atomic plan + notification update.
 */
export async function checkLoyaltyUpgrade(userId: string): Promise<LoyaltyStatus> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            totalSpent: true,
            orderCount: true,
            subscription: { select: { plan: true, id: true } },
        },
    });

    if (!user) {
        return {
            tier: 'STANDARD',
            orderCount: 0,
            totalSpent: 0,
            ordersToVip: VIP_ORDER_THRESHOLD,
            spendToVip: VIP_SPEND_THRESHOLD,
            justUpgraded: false,
        };
    }

    const { orderCount, totalSpent, subscription } = user;
    const currentPlan = subscription?.plan || 'FREE';

    // Already PRO — lifetime, no recalculation needed
    if (currentPlan === 'PRO') {
        return {
            tier: 'PRO',
            orderCount,
            totalSpent,
            ordersToVip: 0,
            spendToVip: 0,
            justUpgraded: false,
        };
    }

    // Check thresholds
    const qualifiesByOrders = orderCount >= VIP_ORDER_THRESHOLD;
    const qualifiesBySpend = totalSpent >= VIP_SPEND_THRESHOLD;
    const shouldUpgrade = qualifiesByOrders || qualifiesBySpend;

    if (shouldUpgrade) {
        // Atomic upgrade: update plan + create notification
        await prisma.$transaction([
            // Upsert subscription to PRO
            subscription
                ? prisma.subscription.update({
                    where: { id: subscription.id },
                    data: { plan: 'PRO', status: 'active' },
                })
                : prisma.subscription.create({
                    data: {
                        userId,
                        plan: 'PRO',
                        status: 'active',
                    },
                }),
            // Create celebration notification
            prisma.notification.create({
                data: {
                    userId,
                    type: 'promo',
                    message: '🏆 מזל טוב! עלית לדרגת VIP PRO! נהנה מהטבות בלעדיות.',
                },
            }),
        ]);

        return {
            tier: 'PRO',
            orderCount,
            totalSpent,
            ordersToVip: 0,
            spendToVip: 0,
            justUpgraded: true,
        };
    }

    return {
        tier: 'STANDARD',
        orderCount,
        totalSpent,
        ordersToVip: Math.max(0, VIP_ORDER_THRESHOLD - orderCount),
        spendToVip: Math.max(0, VIP_SPEND_THRESHOLD - totalSpent),
        justUpgraded: false,
    };
}

/**
 * Get loyalty status without triggering upgrade (read-only).
 * Used by frontend to render progress bar.
 */
export async function getLoyaltyStatus(userId: string): Promise<LoyaltyStatus> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            totalSpent: true,
            orderCount: true,
            subscription: { select: { plan: true } },
        },
    });

    if (!user) {
        return {
            tier: 'STANDARD',
            orderCount: 0,
            totalSpent: 0,
            ordersToVip: VIP_ORDER_THRESHOLD,
            spendToVip: VIP_SPEND_THRESHOLD,
            justUpgraded: false,
        };
    }

    const currentPlan = user.subscription?.plan || 'FREE';

    if (currentPlan === 'PRO') {
        return {
            tier: 'PRO',
            orderCount: user.orderCount,
            totalSpent: user.totalSpent,
            ordersToVip: 0,
            spendToVip: 0,
            justUpgraded: false,
        };
    }

    return {
        tier: 'STANDARD',
        orderCount: user.orderCount,
        totalSpent: user.totalSpent,
        ordersToVip: Math.max(0, VIP_ORDER_THRESHOLD - user.orderCount),
        spendToVip: Math.max(0, VIP_SPEND_THRESHOLD - user.totalSpent),
        justUpgraded: false,
    };
}

export { VIP_ORDER_THRESHOLD, VIP_SPEND_THRESHOLD };
