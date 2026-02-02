import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: (session.user as any).id,
                read: false
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Fetch notifications error:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { notificationId } = await req.json();

        if (notificationId) {
            // Mark specific
            await prisma.notification.update({
                where: { id: notificationId },
                data: { read: true }
            });
        } else {
            // Mark all for user
            await prisma.notification.updateMany({
                where: { userId: (session.user as any).id, read: false },
                data: { read: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update notification error:", error);
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }
}
