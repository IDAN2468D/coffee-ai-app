"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Plan, Subscription } from "@/src/types";
import { revalidatePath } from "next/cache";

const updateSubscriptionSchema = z.object({
    plan: z.nativeEnum(Plan),
});

export async function updateSubscription(formData: FormData | { plan: Plan }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("You must be logged in to upgrade your plan.");
    }

    const data = formData instanceof FormData
        ? { plan: formData.get("plan") as Plan }
        : formData;

    const validatedData = updateSubscriptionSchema.safeParse(data);

    if (!validatedData.success) {
        throw new Error("Invalid plan selected.");
    }

    const { plan } = validatedData.data;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    // Calculate next billing date (30 days from now)
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 30);

    const subscription = await prisma.subscription.upsert({
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
    });

    revalidatePath("/vip");
    revalidatePath("/dashboard");

    return { success: true, subscription: subscription as Subscription };
}
