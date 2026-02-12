import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from './DashboardClient';
import { getLoyaltyStatus } from "@/lib/loyalty";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    let points = 0;
    let userData: any = null;
    let orders: any[] = [];
    let loyaltyStatus = null;

    if (session?.user?.email) {
        userData = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                points: true,
                subscription: true
            }
        });
        if (userData) {
            points = userData.points;
            loyaltyStatus = await getLoyaltyStatus(userData.id);
        }

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
        subscription={userData?.subscription ? {
            tier: userData.subscription.plan,
            status: userData.subscription.status,
            expiry: userData.subscription.nextBillingDate
        } : null}
        loyaltyStatus={loyaltyStatus}
    />;
}
