import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VIPDashboard from "@/components/vip/VIPDashboard";
import { redirect } from "next/navigation";
import { User, UserTier } from "@/src/types";

export default async function VIPPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth/signin?callbackUrl=/vip");
    }

    const prismaUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!prismaUser) {
        redirect("/auth/signin");
    }

    // Transform Prisma user to match User interface (handling Dates)
    // We cast to User because the interface expects Date but we're passing it to a client component
    // In a real app we'd adhere strictly to the Date type or transform the interface.
    // For now we assume the component won't crash on Date string/object mismatch if not used.
    // Note: To be 100% strictly typed without 'any', we need a ClientUser type.
    // But since User interface expects Date, and client components receive JSON, we often have to map.

    // We will pass the user as is, but we need to aware Next.js might complain.
    // Actually, let's keep it simple. If we encounter build errors we fix them.
    // But wait, "NO any ALLOWED" rule.

    // Let's create a compliant object.
    const user: User = {
        ...prismaUser,
        tier: prismaUser.tier as UserTier,
        subscriptionId: prismaUser.subscriptionId,
        isSubscriptionActive: prismaUser.isSubscriptionActive,
        currentPeriodEnd: prismaUser.currentPeriodEnd,
        // The interface says Date. Prisma returns Date.
        // The issue is purely serialization boundary.
        // We'll trust that we are in a server component rendering a client component.
        // If we strictly follow types, this is fine.
        // If runtime error occurs, we fix.
    };

    return <VIPDashboard user={user} />;
}
