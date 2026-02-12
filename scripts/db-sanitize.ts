/**
 * Database Sanitization Script
 * ============================
 * @Architect Agent — Authorized Write/Delete Operation
 * 
 * Actions:
 *   1. Hard DELETE 2 orphan orders (userId no longer exists)
 *   2. UPDATE 18 stale PENDING orders → status: "cancelled"
 *   3. Verify all changes
 * 
 * Usage:
 *   DRY RUN:  npx ts-node scripts/db-sanitize.ts
 *   EXECUTE:  npx ts-node scripts/db-sanitize.ts --execute
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const isExecute = process.argv.includes('--execute');

    console.log('╔══════════════════════════════════════════════╗');
    console.log(isExecute
        ? '║   🔴 DATABASE SANITIZATION — EXECUTE MODE    ║'
        : '║   🟡 DATABASE SANITIZATION — DRY RUN         ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    // ─────────────────────────────────────────────
    // Phase 1a: Identify orphan orders
    // ─────────────────────────────────────────────
    console.log('🏗️  @Architect — Phase 1: Identify Targets\n');

    const allUserIds = new Set(
        (await prisma.user.findMany({ select: { id: true } })).map(u => u.id)
    );

    const allOrders = await prisma.order.findMany({
        select: { id: true, userId: true, status: true, total: true, createdAt: true },
    });

    const orphanOrders = allOrders.filter(o => !allUserIds.has(o.userId));
    const orphanOrderIds = orphanOrders.map(o => o.id);

    console.log(`  📌 Orphan Orders (deleted parent user): ${orphanOrders.length}`);
    orphanOrders.forEach(o => {
        console.log(`     🔴 ${o.id} | userId: ${o.userId} | $${o.total} | ${o.createdAt.toISOString().split('T')[0]}`);
    });

    // Count OrderItems belonging to orphan orders
    const orphanOrderItems = orphanOrderIds.length > 0
        ? await prisma.orderItem.findMany({ where: { orderId: { in: orphanOrderIds } }, select: { id: true, orderId: true } })
        : [];
    console.log(`     └─ OrderItems to cascade-delete: ${orphanOrderItems.length}`);

    // ─────────────────────────────────────────────
    // Phase 1b: Identify stale PENDING orders (>14 days, exclude orphans)
    // ─────────────────────────────────────────────
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const staleOrders = await prisma.order.findMany({
        where: {
            status: 'pending',
            createdAt: { lt: fourteenDaysAgo },
            id: { notIn: orphanOrderIds }, // exclude orphans (they'll be deleted)
        },
        select: { id: true, userId: true, total: true, createdAt: true },
    });
    const staleOrderIds = staleOrders.map(o => o.id);

    console.log(`\n  📌 Stale PENDING Orders (>14 days, non-orphan): ${staleOrders.length}`);
    staleOrders.forEach(o => {
        console.log(`     🟡 ${o.id} | $${o.total} | ${o.createdAt.toISOString().split('T')[0]}`);
    });

    // ─────────────────────────────────────────────
    // Summary before execution
    // ─────────────────────────────────────────────
    console.log('\n  ─── Summary ───');
    console.log(`  DELETE: ${orphanOrders.length} orphan orders + ${orphanOrderItems.length} order items`);
    console.log(`  UPDATE: ${staleOrders.length} stale orders → status: "cancelled"`);
    console.log(`  Total affected: ${orphanOrders.length + orphanOrderItems.length + staleOrders.length} records\n`);

    if (!isExecute) {
        console.log('⚠️  DRY RUN complete. No changes made.');
        console.log('   Run with --execute to apply changes.\n');
        await prisma.$disconnect();
        return;
    }

    // ─────────────────────────────────────────────
    // EXECUTE: Phase 1a — Delete orphan OrderItems then Orders
    // ─────────────────────────────────────────────
    console.log('🗑️  Executing mutations...\n');

    if (orphanOrderIds.length > 0) {
        const delItems = await prisma.orderItem.deleteMany({
            where: { orderId: { in: orphanOrderIds } },
        });
        console.log(`  ✓ Deleted ${delItems.count} orphan order items`);

        const delOrders = await prisma.order.deleteMany({
            where: { id: { in: orphanOrderIds } },
        });
        console.log(`  ✓ Deleted ${delOrders.count} orphan orders`);
    }

    // ─────────────────────────────────────────────
    // EXECUTE: Phase 1b — Cancel stale orders
    // ─────────────────────────────────────────────
    if (staleOrderIds.length > 0) {
        const updated = await prisma.order.updateMany({
            where: { id: { in: staleOrderIds } },
            data: { status: 'cancelled' },
        });
        console.log(`  ✓ Cancelled ${updated.count} stale orders`);
    }

    // ─────────────────────────────────────────────
    // VERIFY: @Architect post-mutation read
    // ─────────────────────────────────────────────
    console.log('\n🕵️  @Critic — Post-Execution Verification\n');

    // Check orphans
    const remainingOrphans = (await prisma.order.findMany({
        select: { id: true, userId: true },
    })).filter(o => !allUserIds.has(o.userId));

    console.log(`  Orphan orders remaining:    ${remainingOrphans.length} ${remainingOrphans.length === 0 ? '✅' : '❌'}`);

    // Check stale pending
    const remainingStale = await prisma.order.count({
        where: { status: 'pending', createdAt: { lt: fourteenDaysAgo } },
    });
    console.log(`  Stale PENDING remaining:    ${remainingStale} ${remainingStale === 0 ? '✅' : '❌'}`);

    // Check cancelled count
    const cancelledCount = await prisma.order.count({
        where: { status: 'cancelled' },
    });
    console.log(`  Total cancelled orders:     ${cancelledCount}`);

    // Check no recent orders affected
    const recentOrders = await prisma.order.findMany({
        where: { createdAt: { gte: fourteenDaysAgo } },
        select: { id: true, status: true, createdAt: true },
    });
    const recentCancelled = recentOrders.filter(o => o.status === 'cancelled');
    console.log(`  Recent orders (<14d):       ${recentOrders.length} total, ${recentCancelled.length} cancelled`);

    if (recentCancelled.length === 0) {
        console.log('\n  ✅ SAFETY CHECK PASSED: No recent orders were affected by bulk update.');
    } else {
        console.log('\n  ⚠️  WARNING: Some recent orders are cancelled — verify manually.');
    }

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║   🏁 SANITIZATION COMPLETE                   ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error('❌ Sanitization failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
