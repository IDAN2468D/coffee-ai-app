import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from './DashboardClient';
import { getDailyFact } from "@/app/actions/daily-fact";
import { getLoyaltyStatus } from "@/lib/loyalty";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    let points = 0;
    let userData: any = null;
    let orders: any[] = [];
    let loyaltyStatus = null;

    if (session?.user?.email) {
        try {
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
                // Safe handling for loyalty status
                try {
                    loyaltyStatus = await getLoyaltyStatus(userData.id);
                } catch (e) {
                    console.error("Loyalty status fetch error:", e);
                }
            }

            // Safe handling for orders
            try {
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
            } catch (e: any) {
                console.error("Order fetch error (likely Enum mismatch):", e);
                // Return empty orders if fetch fails to prevent page crash
                orders = [];
            }
        } catch (error) {
            console.error("Dashboard critical error:", error);
        }
    }

    // Fetch Daily Fact
    const dailyFactData = await getDailyFact();

    return <DashboardClient
        initialPoints={points}
        initialOrders={orders}
        subscription={userData?.subscription ? {
            plan: userData.subscription.plan,
            status: userData.subscription.status,
            expiry: userData.subscription.nextBillingDate
        } : null}
        loyaltyStatus={loyaltyStatus}
        dailyFact={dailyFactData.success && dailyFactData.data ? dailyFactData.data : null}
    />;
}
