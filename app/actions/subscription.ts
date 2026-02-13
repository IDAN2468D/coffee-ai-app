"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Plan, Subscription } from "@/src/types";
import { revalidatePath } from "next/cache";

const updateSubscriptionSchema = z.object({
    plan: z.nativeEnum(Plan).optional(),
    tier: z.enum(['SILVER', 'GOLD', 'PLATINUM']).optional(),
});

export async function updateSubscription(formData: FormData | { plan?: Plan; tier?: 'SILVER' | 'GOLD' | 'PLATINUM' }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "You must be logged in to upgrade your plan." };
        }

        const data = formData instanceof FormData
            ? {
                plan: formData.get("plan") as Plan,
                tier: formData.get("tier") as any
            }
            : formData;

        const validatedData = updateSubscriptionSchema.safeParse(data);

        if (!validatedData.success) {
            return { success: false, error: "Invalid plan selected." };
        }

        const { plan, tier } = validatedData.data;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found." };
        }

        // Calculate next billing date (30 days from now)
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        if (tier) {
            await prisma.user.update({
                where: { id: user.id },
                data: { tier: tier as any },
            });
        }

        const subscription = plan ? await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
                plan,
                status: "active",
                nextBillingDate,
            },
            create: {
                userId: user.id,
                plan,
                status: "active",
                nextBillingDate,
            },
        }) : null;

        revalidatePath("/vip");
        revalidatePath("/dashboard");
        revalidatePath("/subscription");

        return { success: true, data: subscription as Subscription };
    } catch (error) {
        console.error("Subscription update error:", error);
        return { success: false, error: "An unexpected error occurred while updating your subscription." };
    }
}
