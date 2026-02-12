/**
 * @Analyst — Coupon Conversion Report
 *
 * Reports COFFEE10 campaign conversion metrics:
 * - How many orders used COFFEE10
 * - Revenue generated via the campaign
 * - Cross-reference with users who had cancelled orders
 *
 * Usage: npx ts-node scripts/coupon-report.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('━'.repeat(60));
    console.log('☕ COFFEE10 Campaign Conversion Report');
    console.log('━'.repeat(60));
    console.log('');

    // 1. Total orders with COFFEE10
    const couponOrders = await prisma.order.findMany({
        where: { appliedCoupon: 'COFFEE10' },
        include: {
            user: { select: { email: true, name: true } },
            items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
    });

    console.log(`📊 Orders with COFFEE10: ${couponOrders.length}`);
    console.log('');

    if (couponOrders.length === 0) {
        console.log('ℹ️  No orders have used COFFEE10 yet.');
        console.log('');
        console.log('━'.repeat(60));
        await prisma.$disconnect();
        return;
    }

    // 2. Revenue metrics
    const totalRevenue = couponOrders.reduce((sum, o) => sum + o.total, 0);
    const totalDiscount = couponOrders.reduce((sum, o) => sum + o.discount, 0);
    const avgOrderValue = totalRevenue / couponOrders.length;

    console.log('💰 Revenue Metrics:');
    console.log(`   Total Revenue:    ₪${totalRevenue.toFixed(2)}`);
    console.log(`   Total Discounts:  ₪${totalDiscount.toFixed(2)}`);
    console.log(`   Avg Order Value:  ₪${avgOrderValue.toFixed(2)}`);
    console.log('');

    // 3. By status breakdown
    const statusCounts: Record<string, number> = {};
    for (const order of couponOrders) {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    }

    console.log('📦 Status Breakdown:');
    for (const [status, count] of Object.entries(statusCounts)) {
        const bar = '█'.repeat(count);
        console.log(`   ${status.padEnd(12)} ${bar} ${count}`);
    }
    console.log('');

    // 4. Cross-reference: users who converted from cancelled
    console.log('🔄 Conversion Analysis (cancelled → COFFEE10 order):');
    let conversions = 0;
    for (const order of couponOrders) {
        const hadCancelledBefore = await prisma.order.count({
            where: {
                userId: order.userId,
                status: 'cancelled',
                createdAt: { lt: order.createdAt },
            },
        });

        if (hadCancelledBefore > 0) {
            conversions++;
            const products = order.items.map(i => i.product.name).join(', ');
            console.log(`   ✅ ${order.user.email} — ${products} (₪${order.total})`);
        }
    }
    console.log(`   Total Conversions: ${conversions}/${couponOrders.length}`);
    console.log('');

    // 5. January specifics
    const janStart = new Date('2026-01-01T00:00:00Z');
    const janEnd = new Date('2026-02-01T00:00:00Z');

    const janCancelled = await prisma.order.count({
        where: {
            status: 'cancelled',
            createdAt: { gte: janStart, lt: janEnd },
        },
    });

    const janConverted = couponOrders.filter(o => {
        return o.createdAt >= janStart;
    }).length;

    console.log('📅 January Metrics:');
    console.log(`   Cancelled in Jan:     ${janCancelled}`);
    console.log(`   Converted via COFFEE10: ${janConverted}`);
    console.log(`   Conversion Rate:     ${janCancelled > 0 ? ((janConverted / janCancelled) * 100).toFixed(1) : 0}%`);
    console.log('');
    console.log('━'.repeat(60));

    await prisma.$disconnect();
}

main().catch((err) => {
    console.error('Report error:', err);
    prisma.$disconnect();
    process.exit(1);
});
