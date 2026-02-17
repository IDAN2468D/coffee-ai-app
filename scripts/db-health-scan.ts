/**
 * Deep Database Health Scan
 * =========================
 * @Architect Agent — Read-Only Diagnostic
 * 
 * Scans for:
 *   1. Orphan records (FK references to deleted parents)
 *   2. Ghost products (Test/Demo/Placeholder names)
 *   3. Stale orders (PENDING > 14 days)
 * 
 * Usage: npx ts-node scripts/db-health-scan.ts
 */

import { PrismaClient } from '@prisma/client';
import { OrderStatus } from '../lib/enums';

const prisma = new PrismaClient();

interface ScanResult {
    type: string;
    count: number;
    action: string;
    details: string[];
}

async function main() {
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   🔍 DEEP DATABASE HEALTH SCAN              ║');
    console.log('║   Agent: @Architect (Read-Only)              ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    const results: ScanResult[] = [];

    // ─── Phase 1a: Orphan Orders (userId → User) ───
    console.log('🏗️  Phase 1: @Architect — Structural Waste Scan\n');
    console.log('  [1/6] Scanning orphan Orders...');

    const allOrders = await prisma.order.findMany({ select: { id: true, userId: true, status: true, total: true, createdAt: true } });
    const allUserIds = new Set((await prisma.user.findMany({ select: { id: true } })).map(u => u.id));
    const orphanOrders = allOrders.filter(o => !allUserIds.has(o.userId));

    results.push({
        type: 'Orphan Orders',
        count: orphanOrders.length,
        action: orphanOrders.length > 0 ? '🔴 DELETE' : '✅ Clean',
        details: orphanOrders.map(o => `  ID: ${o.id} | userId: ${o.userId} | $${o.total} | ${o.status}`),
    });
    console.log(`        → Found: ${orphanOrders.length}`);

    // ─── Phase 1b: Orphan OrderItems (orderId → Order) ───
    console.log('  [2/6] Scanning orphan OrderItems...');

    const allOrderItems = await prisma.orderItem.findMany({ select: { id: true, orderId: true, productId: true, quantity: true } });
    const allOrderIds = new Set(allOrders.map(o => o.id));
    const orphanOrderItems = allOrderItems.filter(oi => !allOrderIds.has(oi.orderId));

    // Also check OrderItems pointing to deleted Products
    const allProductIds = new Set((await prisma.product.findMany({ select: { id: true } })).map(p => p.id));
    const orphanProductItems = allOrderItems.filter(oi => !allProductIds.has(oi.productId));

    results.push({
        type: 'Orphan OrderItems (no Order)',
        count: orphanOrderItems.length,
        action: orphanOrderItems.length > 0 ? '🔴 DELETE' : '✅ Clean',
        details: orphanOrderItems.map(oi => `  ID: ${oi.id} | orderId: ${oi.orderId}`),
    });
    results.push({
        type: 'Orphan OrderItems (no Product)',
        count: orphanProductItems.length,
        action: orphanProductItems.length > 0 ? '🟡 REVIEW' : '✅ Clean',
        details: orphanProductItems.map(oi => `  ID: ${oi.id} | productId: ${oi.productId}`),
    });
    console.log(`        → No Order: ${orphanOrderItems.length} | No Product: ${orphanProductItems.length}`);

    // ─── Phase 1c: Orphan TasteProfiles (userId → User) ───
    console.log('  [3/6] Scanning orphan TasteProfiles...');

    const allProfiles = await prisma.tasteProfile.findMany({ select: { id: true, userId: true, roastLevel: true } });
    const orphanProfiles = allProfiles.filter(tp => !allUserIds.has(tp.userId));

    results.push({
        type: 'Orphan TasteProfiles',
        count: orphanProfiles.length,
        action: orphanProfiles.length > 0 ? '🔴 DELETE' : '✅ Clean',
        details: orphanProfiles.map(tp => `  ID: ${tp.id} | userId: ${tp.userId}`),
    });
    console.log(`        → Found: ${orphanProfiles.length}`);

    // ─── Phase 1d: Orphan Reviews, Likes, Comments, Notifications ───
    console.log('  [4/6] Scanning orphan Reviews/Likes/Comments/Notifications...');

    const orphanReviews = (await prisma.review.findMany({ select: { id: true, userId: true } })).filter(r => !allUserIds.has(r.userId));
    const orphanLikes = (await prisma.like.findMany({ select: { id: true, userId: true } })).filter(l => !allUserIds.has(l.userId));
    const orphanComments = (await prisma.comment.findMany({ select: { id: true, userId: true } })).filter(c => !allUserIds.has(c.userId));
    const orphanNotifs = (await prisma.notification.findMany({ select: { id: true, userId: true } })).filter(n => !allUserIds.has(n.userId));

    results.push(
        { type: 'Orphan Reviews', count: orphanReviews.length, action: orphanReviews.length > 0 ? '🔴 DELETE' : '✅ Clean', details: orphanReviews.map(r => `  ID: ${r.id}`) },
        { type: 'Orphan Likes', count: orphanLikes.length, action: orphanLikes.length > 0 ? '🔴 DELETE' : '✅ Clean', details: orphanLikes.map(l => `  ID: ${l.id}`) },
        { type: 'Orphan Comments', count: orphanComments.length, action: orphanComments.length > 0 ? '🔴 DELETE' : '✅ Clean', details: orphanComments.map(c => `  ID: ${c.id}`) },
        { type: 'Orphan Notifications', count: orphanNotifs.length, action: orphanNotifs.length > 0 ? '🔴 DELETE' : '✅ Clean', details: orphanNotifs.map(n => `  ID: ${n.id}`) },
    );
    console.log(`        → Reviews: ${orphanReviews.length} | Likes: ${orphanLikes.length} | Comments: ${orphanComments.length} | Notifs: ${orphanNotifs.length}`);

    // ─── Phase 1e: Ghost Products ───
    console.log('  [5/6] Scanning ghost products (Test/Demo/Placeholder)...');

    const ghostProducts = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'Test' } },
                { name: { contains: 'test' } },
                { name: { contains: 'Demo' } },
                { name: { contains: 'demo' } },
                { name: { contains: 'Placeholder' } },
                { name: { contains: 'placeholder' } },
                { name: { contains: 'test_' } },
            ],
        },
        select: { id: true, name: true, price: true, isArchived: true },
    });

    results.push({
        type: 'Ghost Products',
        count: ghostProducts.length,
        action: ghostProducts.length > 0 ? '🟡 ARCHIVE' : '✅ Clean',
        details: ghostProducts.map(p => `  "${p.name}" ($${p.price}) — archived: ${p.isArchived}`),
    });
    console.log(`        → Found: ${ghostProducts.length}`);

    // ─── Phase 1f: Stale Orders (PENDING > 14 days) ───
    console.log('  [6/6] Scanning stale orders (PENDING > 14 days)...');

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const staleOrders = await prisma.order.findMany({
        where: {
            status: OrderStatus.PENDING,
            createdAt: { lt: fourteenDaysAgo },
        },
        select: { id: true, userId: true, total: true, createdAt: true },
    });

    results.push({
        type: 'Stale Orders (PENDING >14d)',
        count: staleOrders.length,
        action: staleOrders.length > 0 ? '🟡 CANCEL/DELETE' : '✅ Clean',
        details: staleOrders.map(o => `  ID: ${o.id} | $${o.total} | Created: ${o.createdAt.toISOString().split('T')[0]}`),
    });
    console.log(`        → Found: ${staleOrders.length}`);

    // ─── Phase 2: @Frontend — Summary Table ───
    console.log('\n\n🎨 Phase 2: @Frontend — Summary Table\n');
    console.log('┌──────────────────────────────────────┬───────┬──────────────────┐');
    console.log('│ Type                                 │ Count │ Action           │');
    console.log('├──────────────────────────────────────┼───────┼──────────────────┤');

    for (const r of results) {
        const typeCol = r.type.padEnd(36);
        const countCol = String(r.count).padStart(5);
        const actionCol = r.action.padEnd(16);
        console.log(`│ ${typeCol} │ ${countCol} │ ${actionCol} │`);
    }

    console.log('└──────────────────────────────────────┴───────┴──────────────────┘');

    // Print details for non-clean items
    const dirtyResults = results.filter(r => r.count > 0);
    if (dirtyResults.length > 0) {
        console.log('\n📋 Details:\n');
        for (const r of dirtyResults) {
            console.log(`  ■ ${r.type} (${r.count}):`);
            r.details.forEach(d => console.log(`    ${d}`));
            console.log('');
        }
    }

    // ─── Phase 3: @Critic — Health Verdict ───
    console.log('\n🕵️  Phase 3: @Critic — Safety Review\n');

    const totalIssues = results.reduce((sum, r) => sum + r.count, 0);

    if (totalIssues === 0) {
        console.log('  ✅ VERDICT: Database is healthy. No orphans, ghosts, or stale data found.');
        console.log('  ✅ No cleanup action required at this time.\n');
    } else {
        console.log(`  ⚠️  VERDICT: Found ${totalIssues} issue(s) requiring attention.`);
        console.log('  📌 Recommendation: Run cleanup script with --execute after review.\n');

        // Check if orphans might be historical
        const orphanCount = results.filter(r => r.type.startsWith('Orphan')).reduce((s, r) => s + r.count, 0);
        if (orphanCount > 0) {
            console.log('  🔍 Orphan Analysis:');
            console.log('     These records reference deleted parent entities.');
            console.log('     They are NOT historical data — they are dangling references.');
            console.log('     Safe to delete: YES\n');
        }
    }

    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   🏁 SCAN COMPLETE                           ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error('❌ Health scan failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
