import React from 'react';
import Navbar from "@/components/TempNavbar";
import Footer from "@/components/AppFooter";
import CoffeeShop from "@/components/CoffeeShop";
import ShopHeader from "@/components/ShopHeader";
import ReengagementBanner from "@/components/ReengagementBanner";
import { prisma } from "@/lib/prisma";
import { Product } from "@/src/types";
import { getReengagementStatus } from "@/app/actions/user";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    let products: Product[] = [];
    try {
        const productsResult = await prisma.product.findMany({
            include: {
                category: true
            }
        });
        products = productsResult.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image || '/placeholder.png',
            category: (p.category?.name as any) || 'Hot',
            roast: p.roast,
            flavor: p.flavor,
            tags: p.tags
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }

    let favoriteIds: string[] = [];
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { favoriteIds: true }
        });
        if (user) favoriteIds = user.favoriteIds;
    }

    // Fetch re-engagement data server-side
    const reengagementData = await getReengagementStatus();

    return (
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            <ReengagementBanner data={reengagementData} />

            <ShopHeader />

            <CoffeeShop initialProducts={products} initialFavoriteIds={favoriteIds} />

            <Footer />
        </main>
    );
}
