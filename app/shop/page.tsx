import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoffeeShop from "@/components/CoffeeShop";
import ShopHeader from "@/components/ShopHeader";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    let products: Product[] = [];
    try {
        products = await prisma.product.findMany({
            include: {
                category: true
            }
        });
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

    return (
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            <ShopHeader />

            <CoffeeShop initialProducts={products} initialFavoriteIds={favoriteIds} />

            <Footer />
        </main>
    );
}
