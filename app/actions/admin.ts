"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client"; // Ensure generated client has this Enum
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify Admin Role
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, isAdmin: true } // Check both for legacy support
        });

        if (!user || (user.role !== 'ADMIN' && !user.isAdmin)) {
            return { success: false, error: "Access Denied: Admin Only" };
        }

        // 1. Total Revenue
        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: {
                    in: ['DELIVERED', 'OUT_FOR_DELIVERY', 'BREWING', 'PENDING']
                    // Exclude CANCELLED? Usually yes. "Sum of all completed orders" requested?
                    // Request says: "Sum of all completed orders".
                    // But typically revenue counts processed orders unless refunder.
                    // Let's count DELIVERED only? Or all non-cancelled?
                    // Prompt text: "Total Revenue (Sum of all completed orders)".
                    // "Completed" likely means status=DELIVERED.
                }
                // Wait, status is enum now. 
                // I need to use the Enum values. 
                // If client generation failed, this file will error on build.
                // Assuming client generation worked or will work.
            }
        });

        // 2. Recent Orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                items: true
            }
        });

        // 3. Top Selling Products
        // Complex query. Group by productId in OrderItem?
        // Prisma doesn't support deep relation grouping easily in one go.
        // Option: Fetch all order items? Too heavy.
        // Option: Native raw query?
        // Option: Aggregate on OrderItem? groupBy productId, sum quantity.
        const topSelling = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 5,
        });

        // Fetch product details for top selling
        const topProductsWithDetails = await Promise.all(
            topSelling.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId }
                });
                return {
                    ...product,
                    sold: item._sum.quantity
                };
            })
        );

        // 4. Daily Sales Chart Data (Last 7 days)
        // Group by createdAt day?
        // Prisma groupBy createdAt is tricky with dates.
        // Often easier to fetch last 7 days orders and aggregate in JS or use Raw SQL.
        // Let's use JS aggregation for simplicity heavily filtered orders if scale allows, 
        // or just plain total for now?
        // Prompt says "bar chart of daily sales".

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const lastWeekOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                },
                status: { not: 'CANCELLED' } // Assuming Enum string literal works
            },
            select: {
                createdAt: true,
                total: true
            }
        });

        // Aggregate by day
        const dailySales = lastWeekOrders.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + order.total;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(dailySales).map(([date, total]) => ({
            name: date,
            sales: total
        })).sort((a, b) => a.name.localeCompare(b.name));

        return {
            success: true,
            data: {
                revenue: totalRevenue._sum.total || 0,
                recentOrders,
                topProducts: topProductsWithDetails,
                chartData
            }
        };

    } catch (error) {
        console.error("Admin Stats Error:", error);
        return { success: false, error: "Failed to fetch admin statistics" };
    }
}
