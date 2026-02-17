"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addLoyaltyPoint() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Increment points
        let newPoints = (user.loyaltyPoints || 0) + 1;
        let message = "Point added!";
        let rewardEarned = false;

        // Check for reward (Buy 9 get 1 free -> 10th point triggers reset?)
        // Task says: "If points reach 10 -> Reset to 0 and grant a free drink coupon."
        if (newPoints >= 10) {
            newPoints = 0;
            rewardEarned = true;
            message = "Congratulations! You earned a FREE Drink!";

            // Grant Coupon Logic (Mock for now, or use GiftCard/Coupon model if exists)
            // For MVP, we might just store it in a 'coupons' array if we had one, or create a GiftCard.
            // Protocol check: "Buy 9, Get 1 Free".
            // Implementation: We'll create a GiftCard with value matching a drink (e.g., 20) or a special code.
            // Let's create a specialized coupon code or generic value.
            // Given "GiftCard" model exists, let's issue a 20 NIS gift card.

            await prisma.giftCard.create({
                data: {
                    code: `FREE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    balance: 20, // Avg drink price
                    originalAmount: 20,
                    senderId: user.id, // Self-reward? or System Admin? System ID is better but we lack one. 
                    // We'll use user.id as sender for "Self-Reward" or leave empty if schema allows? 
                    // Schema: senderId String @db.ObjectId. Sender is User.
                    // We'll use the user themselves as the "Sender" (earned it).
                    recipientEmail: user.email!,
                    message: "Loyalty Reward: Free Drink!",
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
                }
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { loyaltyPoints: newPoints },
        });

        revalidatePath("/loyalty");
        revalidatePath("/dashboard");

        return {
            success: true,
            data: {
                points: newPoints,
                rewardEarned,
                message
            }
        };

    } catch (error) {
        console.error("Loyalty Error:", error);
        return { success: false, error: "Failed to update loyalty points" };
    }
}
