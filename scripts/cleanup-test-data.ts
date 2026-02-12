/**
 * Test Data Cleanup Script
 * ========================
 * Architect Agent — Authorized Write/Delete Operation
 * 
 * Targets: Users with @test.com email domains
 * Protocol: Dry-run first, then delete with cascade safety
 * 
 * Usage:
 *   DRY RUN:  npx ts-node scripts/cleanup-test-data.ts
 *   EXECUTE:  npx ts-node scripts/cleanup-test-data.ts --execute
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_EMAIL_PATTERNS = ['@test.com', '@example.com', '@testing.com'];

function isTestEmail(email: string | null): boolean {
    if (!email) return false;
    return TEST_EMAIL_PATTERNS.some(pattern => email.endsWith(pattern));
}

async function main() {
    const isExecute = process.argv.includes('--execute');

    console.log('======================================');
    console.log(isExecute ? '🔴 EXECUTE MODE — DELETING DATA' : '🟡 DRY RUN MODE — READ ONLY');
    console.log('======================================\n');

    // Step 1: Identify test users
    const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
    });

    const testUsers = allUsers.filter(u => isTestEmail(u.email));

    if (testUsers.length === 0) {
        console.log('✅ No test users found. Database is clean.');
        await prisma.$disconnect();
        return;
    }

    console.log(`📋 Found ${testUsers.length} test user(s):\n`);
    testUsers.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name || '(no name)'} — ${u.email} [${u.id}]`);
    });

    const testUserIds = testUsers.map(u => u.id);

    // Step 2: Count related records (Critic Dry Run)
    console.log('\n--- Related Records ---\n');

    const counts = {
        likes: await prisma.like.count({ where: { userId: { in: testUserIds } } }),
        comments: await prisma.comment.count({ where: { userId: { in: testUserIds } } }),
        reviews: await prisma.review.count({ where: { userId: { in: testUserIds } } }),
        notifications: await prisma.notification.count({ where: { userId: { in: testUserIds } } }),
        orderItems: 0, // counted via orders
        orders: await prisma.order.count({ where: { userId: { in: testUserIds } } }),
        coffeeImages: await prisma.coffeeImage.count({ where: { userId: { in: testUserIds } } }),
        blends: await prisma.blend.count({ where: { userId: { in: testUserIds } } }),
        tasteProfiles: await prisma.tasteProfile.count({ where: { userId: { in: testUserIds } } }),
        subscriptions: await prisma.subscription.count({ where: { userId: { in: testUserIds } } }),
        accounts: await prisma.account.count({ where: { userId: { in: testUserIds } } }),
        sessions: await prisma.session.count({ where: { userId: { in: testUserIds } } }),
    };

    // Count order items via orders
    const testOrders = await prisma.order.findMany({
        where: { userId: { in: testUserIds } },
        select: { id: true },
    });
    const testOrderIds = testOrders.map(o => o.id);
    counts.orderItems = testOrderIds.length > 0
        ? await prisma.orderItem.count({ where: { orderId: { in: testOrderIds } } })
        : 0;

    // Count likes/comments on test users' images (cascade)
    const testImages = await prisma.coffeeImage.findMany({
        where: { userId: { in: testUserIds } },
        select: { id: true },
    });
    const testImageIds = testImages.map(img => img.id);
    const imageLikes = testImageIds.length > 0
        ? await prisma.like.count({ where: { coffeeImageId: { in: testImageIds } } })
        : 0;
    const imageComments = testImageIds.length > 0
        ? await prisma.comment.count({ where: { coffeeImageId: { in: testImageIds } } })
        : 0;

    console.log(`  Likes (by user):        ${counts.likes}`);
    console.log(`  Comments (by user):     ${counts.comments}`);
    console.log(`  Reviews:                ${counts.reviews}`);
    console.log(`  Notifications:          ${counts.notifications}`);
    console.log(`  Orders:                 ${counts.orders}`);
    console.log(`  Order Items:            ${counts.orderItems}`);
    console.log(`  Coffee Images:          ${counts.coffeeImages}`);
    console.log(`    └─ Likes on images:   ${imageLikes}`);
    console.log(`    └─ Comments on imgs:  ${imageComments}`);
    console.log(`  Blends:                 ${counts.blends}`);
    console.log(`  Taste Profiles:         ${counts.tasteProfiles}`);
    console.log(`  Subscriptions:          ${counts.subscriptions}`);
    console.log(`  Accounts (OAuth):       ${counts.accounts}`);
    console.log(`  Sessions:               ${counts.sessions}`);
    console.log(`  Users:                  ${testUsers.length}`);

    const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0)
        + testUsers.length + imageLikes + imageComments;

    console.log(`\n  📊 Total records to delete: ${totalRecords}`);

    if (!isExecute) {
        console.log('\n⚠️  This was a DRY RUN. No data was deleted.');
        console.log('    To execute, run: npx ts-node scripts/cleanup-test-data.ts --execute\n');
        await prisma.$disconnect();
        return;
    }

    // Step 3: Execute deletion (Architect — cascade-safe order)
    console.log('\n🗑️  Deleting in cascade-safe order...\n');

    // 3a. Likes & Comments on test users' images (deepest children)
    if (testImageIds.length > 0) {
        const delImgLikes = await prisma.like.deleteMany({ where: { coffeeImageId: { in: testImageIds } } });
        console.log(`  ✓ Deleted ${delImgLikes.count} likes on test images`);
        const delImgComments = await prisma.comment.deleteMany({ where: { coffeeImageId: { in: testImageIds } } });
        console.log(`  ✓ Deleted ${delImgComments.count} comments on test images`);
    }

    // 3b. Likes & Comments by test users (on other users' images)
    const delUserLikes = await prisma.like.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delUserLikes.count} likes by test users`);
    const delUserComments = await prisma.comment.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delUserComments.count} comments by test users`);

    // 3c. Reviews
    const delReviews = await prisma.review.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delReviews.count} reviews`);

    // 3d. Notifications
    const delNotifs = await prisma.notification.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delNotifs.count} notifications`);

    // 3e. Order Items → Orders
    if (testOrderIds.length > 0) {
        const delOrderItems = await prisma.orderItem.deleteMany({ where: { orderId: { in: testOrderIds } } });
        console.log(`  ✓ Deleted ${delOrderItems.count} order items`);
    }
    const delOrders = await prisma.order.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delOrders.count} orders`);

    // 3f. Coffee Images
    const delImages = await prisma.coffeeImage.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delImages.count} coffee images`);

    // 3g. Blends
    const delBlends = await prisma.blend.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delBlends.count} blends`);

    // 3h. Taste Profiles
    const delTaste = await prisma.tasteProfile.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delTaste.count} taste profiles`);

    // 3i. Subscriptions
    const delSubs = await prisma.subscription.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delSubs.count} subscriptions`);

    // 3j. Sessions & Accounts
    const delSessions = await prisma.session.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delSessions.count} sessions`);
    const delAccounts = await prisma.account.deleteMany({ where: { userId: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delAccounts.count} accounts`);

    // 3k. Users (parent — last)
    const delUsers = await prisma.user.deleteMany({ where: { id: { in: testUserIds } } });
    console.log(`  ✓ Deleted ${delUsers.count} test users`);

    // Step 4: Verification (Architect — post-delete read)
    console.log('\n--- Verification ---\n');
    const remainingTestUsers = await prisma.user.findMany({
        where: {
            OR: TEST_EMAIL_PATTERNS.map(p => ({ email: { endsWith: p } })),
        },
    });

    if (remainingTestUsers.length === 0) {
        console.log('✅ Verification passed: 0 test users remain in database.');
    } else {
        console.log(`⚠️  WARNING: ${remainingTestUsers.length} test user(s) still remain!`);
        remainingTestUsers.forEach(u => console.log(`  - ${u.email}`));
    }

    console.log('\n======================================');
    console.log('🏁 Cleanup complete.');
    console.log('======================================\n');

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error('❌ Cleanup script failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
