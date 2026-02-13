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

import { UserTier } from './tiers';

export type LoyaltyTier = UserTier;

export interface LoyaltyStatus {
    tier: LoyaltyTier;
    orderCount: number;       // successful orders only (excludes cancelled)
    totalSpent: number;
    ordersToVip: number;      // remaining orders needed (0 if already VIP)
    spendToVip: number;       // remaining spend needed (0 if already VIP)
    justUpgraded: boolean;    // true if this check triggered an upgrade
}

const GOLD_ORDER_THRESHOLD = 5;
const PLATINUM_ORDER_THRESHOLD = 10;

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
            tier: 'SILVER',
            orderCount: 0,
            totalSpent: 0,
            ordersToNextTier: GOLD_ORDER_THRESHOLD,
            nextTier: 'GOLD',
            justUpgraded: false,
        };
    }

    const currentTier = (user as any).tier || 'SILVER';

    // PLATINUM is the highest tier
    if (currentTier === 'PLATINUM') {
        return {
            tier: 'PLATINUM',
            orderCount: successfulOrders,
            totalSpent: successfulSpend,
            ordersToNextTier: 0,
            nextTier: null,
            justUpgraded: false,
        };
    }

    let nextTier: UserTier | null = null;
    let threshold = 0;

    if (currentTier === 'SILVER') {
        nextTier = 'GOLD';
        threshold = GOLD_ORDER_THRESHOLD;
    } else if (currentTier === 'GOLD') {
        nextTier = 'PLATINUM';
        threshold = PLATINUM_ORDER_THRESHOLD;
    }

    const shouldUpgrade = successfulOrders >= threshold;

    if (shouldUpgrade && nextTier) {
        // Atomic upgrade: update user tier + create notification
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { tier: nextTier },
            }),
            prisma.notification.create({
                data: {
                    userId,
                    type: 'promo',
                    message: `🏆 מזל טוב! עלית לדרגת ${nextTier}! נהנה מהטבות בלעדיות.`,
                },
            }),
        ]);

        return {
            tier: nextTier,
            orderCount: successfulOrders,
            totalSpent: successfulSpend,
            ordersToNextTier: 0, // Need to re-evaluate for the NEXT tier if applicable
            nextTier: nextTier === 'GOLD' ? 'PLATINUM' : null,
            justUpgraded: true,
        };
    }

    return {
        tier: currentTier,
        orderCount: successfulOrders,
        totalSpent: successfulSpend,
        ordersToNextTier: Math.max(0, threshold - successfulOrders),
        nextTier,
        justUpgraded: false,
    };
}

/**
 * Get loyalty status without triggering upgrade (read-only).
 */
export async function getLoyaltyStatus(userId: string): Promise<any> {
    const [user, successfulOrders, successfulSpend] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { tier: true },
        }),
        countSuccessfulOrders(userId),
        sumSuccessfulSpend(userId),
    ]);

    if (!user) {
        return {
            tier: 'SILVER',
            orderCount: 0,
            totalSpent: 0,
            ordersToNextTier: GOLD_ORDER_THRESHOLD,
            nextTier: 'GOLD',
            justUpgraded: false,
        };
    }

    const currentTier = (user as any).tier || 'SILVER';

    if (currentTier === 'PLATINUM') {
        return {
            tier: 'PLATINUM',
            orderCount: successfulOrders,
            totalSpent: successfulSpend,
            ordersToNextTier: 0,
            nextTier: null,
            justUpgraded: false,
        };
    }

    let nextTier: UserTier | null = 'GOLD';
    let threshold = GOLD_ORDER_THRESHOLD;

    if (currentTier === 'GOLD') {
        nextTier = 'PLATINUM';
        threshold = PLATINUM_ORDER_THRESHOLD;
    }

    return {
        tier: currentTier,
        orderCount: successfulOrders,
        totalSpent: successfulSpend,
        ordersToNextTier: Math.max(0, threshold - successfulOrders),
        nextTier,
        justUpgraded: false,
    };
}

export { GOLD_ORDER_THRESHOLD, PLATINUM_ORDER_THRESHOLD };
