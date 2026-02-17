"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
    productId: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export async function submitReview(formData: { productId: string; rating: number; comment?: string }) {
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

        const validatedDates = reviewSchema.safeParse(formData);

        if (!validatedDates.success) {
            return { success: false, error: "Invalid data" };
        }

        const { productId, rating, comment } = validatedDates.data;

        // Constraint: One review per product per user?
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.id,
                productId: productId
            }
        });

        if (existingReview) {
            // Update or Error? Prompt says "limit to 1 review per product per user".
            // Let's allow updating.
            await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment }
            });
            revalidatePath(`/products/${productId}`); // Assuming product page
            return { success: true, message: "Review updated!" };
        }

        // Verify purchase? (Optional in prompt, let's skip for speed/MVP unless strictly required "Constraint: Verify user has purchased... (optional)")
        // I'll skip purchase verification to let users review freely for now (Social Proof seeding).

        await prisma.review.create({
            data: {
                userId: user.id,
                productId: productId,
                rating,
                comment: comment || "",
                isVerified: false // Could check orders here to set true
            }
        });

        revalidatePath(`/products/${productId}`);
        return { success: true, message: "Review submitted!" };

    } catch (error) {
        console.error("Review Error:", error);
        return { success: false, error: "Failed to submit review" };
    }
}
