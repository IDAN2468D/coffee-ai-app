"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUnlockedOrigins() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                orders: {
                    where: { status: "delivered" }, // Only delivered orders unlock origins
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const origins = new Set<string>();
        user.orders.forEach(order => {
            order.items.forEach(item => {
                const product = item.product as any;
                if (product.origin) {
                    origins.add(product.origin);
                }
            });
        });

        return { success: true, origins: Array.from(origins) };
    } catch (error) {
        console.error("Odyssey error:", error);
        return { success: false, error: "Failed to load your odyssey." };
    }
}
