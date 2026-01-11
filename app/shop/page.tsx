import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoffeeShop from "@/components/CoffeeShop";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";

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

    return (
        <main className="min-h-screen bg-white font-sans">
            <Navbar />

            <div className="pt-32 pb-10 bg-[#2D1B14] text-center">
                <h1 className="text-4xl md:text-5xl font-serif text-white font-bold">Our Collection</h1>
                <p className="text-white/70 mt-4 max-w-2xl mx-auto px-6">
                    Discover your perfect brew from our carefully curated selection.
                </p>
            </div>

            <CoffeeShop initialProducts={products} />

            <Footer />
        </main>
    );
}
