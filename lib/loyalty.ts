/**
 * @Architect — Loyalty Progression Engine
 *
 * Tiers:
 *  - STANDARD: 0-2 successful orders AND <₪500 total spend
 *  - PRO:      3+ successful orders OR ≥₪500 total spend (LIFETIME — no downgrade)
 *
 * IMPORTANT: Only non-cancelled orders count toward VIP qualification.
 * Called after every successful order to check for auto-upgrade.
 */

import { prisma } from '@/lib/prisma';

export type LoyaltyTier = 'STANDARD' | 'PRO';

export interface LoyaltyStatus {
    tier: LoyaltyTier;
    orderCount: number;       // successful orders only (excludes cancelled)
    totalSpent: number;
    ordersToVip: number;      // remaining orders needed (0 if already VIP)
    spendToVip: number;       // remaining spend needed (0 if already VIP)
    justUpgraded: boolean;    // true if this check triggered an upgrade
}

const VIP_ORDER_THRESHOLD = 3;
const VIP_SPEND_THRESHOLD = 500;

/** Excluded statuses — cancelled orders do NOT count toward VIP */
const EXCLUDED_STATUSES = ['cancelled', 'refunded'];

/**
 * Count only successful (non-cancelled, non-refunded) orders for a user.
 * This is the single source of truth for order-based VIP qualification.
 */
async function countSuccessfulOrders(userId: string): Promise<number> {
    return prisma.order.count({
        where: {
            userId,
            status: { notIn: EXCLUDED_STATUSES },
        },
    });
}

/**
 * Sum total spent from successful orders only.
 * More accurate than the cached totalSpent counter.
 */
async function sumSuccessfulSpend(userId: string): Promise<number> {
    const result = await prisma.order.aggregate({
        where: {
            userId,
            status: { notIn: EXCLUDED_STATUSES },
        },
        _sum: { total: true },
    });
    return result._sum.total || 0;
}

/**
 * Check and execute loyalty upgrade after an order.
 * Uses Prisma $transaction for atomic plan + notification update.
 *
 * CRITICAL: Uses live DB queries (not cached counters) to exclude cancelled orders.
 */
export async function checkLoyaltyUpgrade(userId: string): Promise<LoyaltyStatus> {
    const [user, successfulOrders, successfulSpend] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscription: { select: { plan: true, id: true } },
            },
        }),
        countSuccessfulOrders(userId),
        sumSuccessfulSpend(userId),
    ]);

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

    const { subscription } = user;
    const currentPlan = subscription?.plan || 'FREE';

    // Already PRO — lifetime, no recalculation needed
    if (currentPlan === 'PRO') {
        return {
            tier: 'PRO',
            orderCount: successfulOrders,
            totalSpent: successfulSpend,
            ordersToVip: 0,
            spendToVip: 0,
            justUpgraded: false,
        };
    }

    // Check thresholds against LIVE counts (cancelled excluded)
    const qualifiesByOrders = successfulOrders >= VIP_ORDER_THRESHOLD;
    const qualifiesBySpend = successfulSpend >= VIP_SPEND_THRESHOLD;
    const shouldUpgrade = qualifiesByOrders || qualifiesBySpend;

    if (shouldUpgrade) {
        // Atomic upgrade: update plan + create notification
        await prisma.$transaction([
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
            orderCount: successfulOrders,
            totalSpent: successfulSpend,
            ordersToVip: 0,
            spendToVip: 0,
            justUpgraded: true,
        };
    }

    return {
        tier: 'STANDARD',
        orderCount: successfulOrders,
        totalSpent: successfulSpend,
        ordersToVip: Math.max(0, VIP_ORDER_THRESHOLD - successfulOrders),
        spendToVip: Math.max(0, VIP_SPEND_THRESHOLD - successfulSpend),
        justUpgraded: false,
    };
}

/**
 * Get loyalty status without triggering upgrade (read-only).
 * Used by frontend to render progress bar.
 *
 * Uses live DB counts to ensure cancelled orders are excluded.
 */
export async function getLoyaltyStatus(userId: string): Promise<LoyaltyStatus> {
    const [user, successfulOrders, successfulSpend] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscription: { select: { plan: true } },
            },
        }),
        countSuccessfulOrders(userId),
        sumSuccessfulSpend(userId),
    ]);

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
            orderCount: successfulOrders,
            totalSpent: successfulSpend,
            ordersToVip: 0,
            spendToVip: 0,
            justUpgraded: false,
        };
    }

    return {
        tier: 'STANDARD',
        orderCount: successfulOrders,
        totalSpent: successfulSpend,
        ordersToVip: Math.max(0, VIP_ORDER_THRESHOLD - successfulOrders),
        spendToVip: Math.max(0, VIP_SPEND_THRESHOLD - successfulSpend),
        justUpgraded: false,
    };
}

export { VIP_ORDER_THRESHOLD, VIP_SPEND_THRESHOLD };
