import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VIPDashboard from "./VIPDashboard";
import { redirect } from "next/navigation";
import { Subscription, Plan } from "@/src/types";

export default async function VIPPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth/signin?callbackUrl=/vip");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true },
    });

    if (!user) {
        redirect("/auth/signin");
    }

    // Cast prisma subscription to our internal Subscription type
    const initialSubscription: Subscription | null = user.subscription ? {
        id: user.subscription.id,
        userId: user.subscription.userId,
        plan: user.subscription.plan as Plan,
        status: user.subscription.status as "active" | "cancelled",
        nextBillingDate: user.subscription.nextBillingDate,
        createdAt: user.subscription.createdAt,
        updatedAt: user.subscription.updatedAt,
    } : null;

    return <VIPDashboard initialSubscription={initialSubscription} />;
}
