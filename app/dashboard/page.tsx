import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    let points = 0;
    let userData: any = null;
    let orders: any[] = [];

    if (session?.user?.email) {
        userData = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                points: true,
                subscriptionTier: true,
                subscriptionStatus: true,
                subscriptionExpiry: true
            }
        });
        if (userData) points = userData.points;

        orders = await prisma.order.findMany({
            where: { user: { email: session.user.email } },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    return <DashboardClient
        initialPoints={points}
        initialOrders={orders}
        subscription={userData ? {
            tier: userData.subscriptionTier,
            status: userData.subscriptionStatus,
            expiry: userData.subscriptionExpiry
        } : null}
    />;
}
