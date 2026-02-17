
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('🔄 Admin: Starting DB Sanitization (Fixing Enums)...');

    // 1. Security Check
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN' && !session.user.isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const results = {
            pending: 0,
            brewing: 0,
            delivered: 0,
            cancelled: 0,
            outForDelivery: 0
        };

        // 2. Execute Raw MongoDB Commands to fix lowercase enums

        // 'pending' -> 'PENDING'
        const pendingRes = await prisma.$runCommandRaw({
            update: "Order",
            updates: [{ q: { status: "pending" }, u: { $set: { status: "PENDING" } }, multi: true }]
        });
        results.pending = (pendingRes as any).nModified || 0;

        // 'processing' -> 'BREWING'
        const processingRes = await prisma.$runCommandRaw({
            update: "Order",
            updates: [{ q: { status: "processing" }, u: { $set: { status: "BREWING" } }, multi: true }]
        });
        results.brewing = (processingRes as any).nModified || 0;

        // 'completed' -> 'DELIVERED'
        const completedRes = await prisma.$runCommandRaw({
            update: "Order",
            updates: [{ q: { status: "completed" }, u: { $set: { status: "DELIVERED" } }, multi: true }]
        });
        results.delivered = (completedRes as any).nModified || 0;

        // 'cancelled' -> 'CANCELLED'
        const cancelledRes = await prisma.$runCommandRaw({
            update: "Order",
            updates: [{ q: { status: "cancelled" }, u: { $set: { status: "CANCELLED" } }, multi: true }]
        });
        results.cancelled = (cancelledRes as any).nModified || 0;

        // 'shipped' -> 'OUT_FOR_DELIVERY'
        const shippedRes = await prisma.$runCommandRaw({
            update: "Order",
            updates: [{ q: { status: "shipped" }, u: { $set: { status: "OUT_FOR_DELIVERY" } }, multi: true }]
        });
        results.outForDelivery = (shippedRes as any).nModified || 0;

        console.log('✅ DB Sanitization Complete:', results);

        return NextResponse.json({
            success: true,
            message: 'Database enum values have been normalized.',
            details: results
        });

    } catch (error: any) {
        console.error('❌ DB Sanitization Failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
