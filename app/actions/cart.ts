'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ServerActionResponse } from '@/src/types';

// Zod Validation Schema
const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    size: z.string().optional(),
});

export async function addToCart(rawInput: unknown): Promise<ServerActionResponse> {
    try {
        const cookieStore = await cookies();

        // 1. Validate Input
        const result = addToCartSchema.safeParse(rawInput);
        if (!result.success) {
            return { success: false, error: 'Invalid input data: ' + result.error.errors[0].message };
        }
        const { productId, quantity, size } = result.data;

        // 2. Get User & Session State
        const session = await getServerSession(authOptions);
        let userId: string | undefined;

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });
            userId = user?.id;
        }

        let cartId = cookieStore.get('cartId')?.value;
        let cart;

        // 3. Find Existing Cart
        if (cartId) {
            cart = await prisma.cart.findUnique({
                where: { id: cartId },
                select: { id: true, userId: true } // Minimize data fetch
            });
        }

        // 4. Handle Cart Creation / User Linking
        if (!cart) {
            // Create new cart linked to user (if logged in) or anonymous
            cart = await prisma.cart.create({
                data: {
                    userId: userId // undefined if guest
                }
            });
            cartId = cart.id;

            // Set cookie for persistence
            cookieStore.set('cartId', cartId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 Days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });
        } else {
            // If logged in user interacts with an anonymous cart, claim it
            if (userId && !cart.userId) {
                await prisma.cart.update({
                    where: { id: cartId },
                    data: { userId }
                });
            }
        }

        // 5. Upsert Item Logic
        // We check for existing item first to decide update vs create
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cartId!,
                productId: productId,
                size: size ?? undefined
            }
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: { increment: quantity } }
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cartId!,
                    productId: productId,
                    quantity: quantity,
                    size: size
                }
            });
        }

        // 6. Revalidate UI
        revalidatePath('/', 'layout'); // Update header cart icon globally

        return { success: true };

    } catch (error) {
        console.error('Add to Cart Error:', error);
        return { success: false, error: 'Failed to add item to cart. Please try again.' };
    }
}
