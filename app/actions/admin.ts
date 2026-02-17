"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client"; // Ensure generated client has this Enum
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
    try {
        console.log('Starting getAdminStats...');
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            console.warn('getAdminStats: Unauthorized access attempt (no session/email)');
            return { success: false, error: "Unauthorized" };
        }

        // Verify Admin Role with safe access
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, isAdmin: true } as any // Check both for legacy support
        });

        if (!user || ((user as any).role !== 'ADMIN' && !user.isAdmin)) {
            console.warn(`getAdminStats: Access denied for user ${session.user.email}`);
            return { success: false, error: "Access Denied: Admin Only" };
        }

        console.log('getAdminStats: Authorized. Fetching stats...');

        // 1. Total Revenue
        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: {
                    in: ['DELIVERED', 'OUT_FOR_DELIVERY', 'BREWING', 'PENDING'] as any
                }
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
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const lastWeekOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                },
                status: { not: 'CANCELLED' as any }
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

        console.log('getAdminStats: Success');
        return {
            success: true,
            data: {
                revenue: totalRevenue._sum.total || 0,
                recentOrders,
                topProducts: topProductsWithDetails,
                chartData
            }
        };

    } catch (error: any) {
        console.error("Admin Stats Critical Error:", error);
        // Log environment status safely
        console.error("DB URL Present:", !!process.env.DATABASE_URL);

        // MOCK DATA FALLBACK (Emergency Fix)
        // If DB fails, return mock data so the page can render and we can see the console logs.
        if (process.env.NODE_ENV === 'production') {
            console.warn("Returning MOCK DATA due to production error.");
            return {
                success: true,
                data: {
                    revenue: 0,
                    recentOrders: [],
                    topProducts: [],
                    chartData: []
                }
            };
        }

        return {
            success: false,
            error: `Server Error: ${error.message || 'Unknown error'}`
        };
    }
}
