"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const likeSchema = z.object({
    imageId: z.string().min(1),
});

const commentSchema = z.object({
    imageId: z.string().min(1),
    text: z.string().min(1).max(500),
});

export async function toggleLike(imageId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const valid = likeSchema.safeParse({ imageId });
        if (!valid.success) {
            return { success: false, error: "Invalid image ID" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                coffeeImageId_userId: {
                    coffeeImageId: imageId,
                    userId: user.id
                }
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            revalidatePath('/gallery');
            return { success: true, data: { liked: false } };
        } else {
            await prisma.like.create({
                data: {
                    coffeeImageId: imageId,
                    userId: user.id
                }
            });
            revalidatePath('/gallery');
            return { success: true, data: { liked: true } };
        }
    } catch (error) {
        console.error("Like action error:", error);
        return { success: false, error: "Internal Server Error" };
    }
}

export async function addComment(imageId: string, text: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const valid = commentSchema.safeParse({ imageId, text });
        if (!valid.success) {
            return { success: false, error: "Invalid input" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const comment = await prisma.comment.create({
            data: {
                text,
                coffeeImageId: imageId,
                userId: user.id
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            }
        });

        revalidatePath('/gallery');
        return { success: true, data: comment };
    } catch (error) {
        console.error("Comment action error:", error);
        return { success: false, error: "Internal Server Error" };
    }
}
