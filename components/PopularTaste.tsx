'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@prisma/client';
import { useCartStore } from '@/context/useCartStore';
import { PRODUCTS } from '@/lib/products';

type ProductWithCategory = Product & {
    category?: Category | string | null;
};

type PopularTasteProps = {
    products?: ProductWithCategory[];
};

export default function PopularTaste({ products = [] }: PopularTasteProps) {
    const { addItem } = useCartStore();
    const [activeFilter, setActiveFilter] = useState('הכל');

    const displayProducts = products.length > 0 ? products : (PRODUCTS as unknown as ProductWithCategory[]);

    const filters = ['הכל', 'חם', 'קר', 'מאפים'];

    const filteredProducts = displayProducts.filter(item => {
        const categoryName = typeof item.category === 'string' ? item.category : (item.category as any)?.name;

        // Map Hebrew filters to English DB categories
        const dbCategory =
            activeFilter === 'חם' ? 'Hot' :
                activeFilter === 'קר' ? 'Cold' :
                    activeFilter === 'מאפים' ? 'Bakery' : 'All';

        if (activeFilter === 'הכל') return true;
        if (activeFilter === 'מאפים') return categoryName === 'Pastry' || categoryName === 'Bakery';
        return categoryName === dbCategory;
    }).slice(0, 3); // Show top 3

    return (
        <section className="py-24 bg-white text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14] mb-16">המוצרים האהובים</h2>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-8 mb-12 text-sm font-bold uppercase tracking-wider text-stone-400">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`transition-colors pb-1 border-b-2 ${activeFilter === filter
                            ? 'text-[#2D1B14] border-[#2D1B14]'
                            : 'border-transparent hover:text-[#2D1B14]'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={item.id}
                            className="group relative bg-[#F5F5F5] rounded-3xl p-4 transition-transform hover:-translate-y-2"
                        >
                            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                                <Image
                                    src={item.image || '/images/placeholder.jpg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button className="absolute top-3 left-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-stone-500 hover:bg-white hover:text-red-500 transition-colors z-10">
                                    <Heart size={16} fill="currentColor" />
                                </button>
                            </div>
                            <div className="text-right px-2 pb-4">
                                <h3 className="font-serif font-bold text-xl text-[#2D1B14] mb-1">{item.name}</h3>
                                <p className="text-xs text-stone-500 mb-4 line-clamp-2 h-8">{item.description}</p>
                                <div className="flex items-center justify-between flex-row-reverse">
                                    <span className="text-[#C37D46] font-bold text-lg">
                                        ₪{item.price}
                                    </span>
                                    <button
                                        onClick={() => addItem(item as any)}
                                        className="bg-[#2D1B14] text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-black transition-colors flex items-center gap-2"
                                    >
                                        הוסף לסל
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-16">
                <Link href="/shop" className="inline-flex bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest items-center justify-center mx-auto gap-2 hover:bg-[#2D1B14] flex-row-reverse">
                    לכל המוצרים <ArrowRight size={14} className="rotate-180" />
                </Link>
            </div>
        </section>
    );
}
