'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/lib/products';
import { ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoffeeShop({ initialProducts = [] }: { initialProducts?: any[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const { items, addItem, removeItem } = useCart();

    const categories = ['All', 'Hot', 'Cold', 'Bakery']; // Simplified categories

    // Map Hebrew categories to English for display if needed, or just use English
    const productsToDisplay = initialProducts.length > 0 ? initialProducts : PRODUCTS;

    const filteredProducts = productsToDisplay.filter(p => {
        if (activeCategory === 'All') return true;
        const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
        return categoryName === activeCategory;
    });

    return (
        <section id="menu" className="py-24 bg-[#F2F2F2]"> {/* Light grey background from design */}
            <div className="max-w-7xl mx-auto px-6" dir="ltr"> {/* LTR for English design */}

                {/* Categories */}
                <div className="flex justify-center space-x-8 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-lg font-serif font-bold tracking-wide uppercase transition-colors ${activeCategory === cat ? 'text-[#2D1B14] underline underline-offset-8 decoration-2' : 'text-stone-400 hover:text-[#2D1B14]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {filteredProducts.map((product) => {
                        const cartItem = items.find(i => i.id === product.id);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                key={product.id}
                                className="relative bg-white rounded-[2rem] p-6 pt-24 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center mt-12"
                            >
                                {/* Floating Image */}
                                <div className="absolute -top-16 w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-serif font-bold text-[#2D1B14] mb-2">{product.name}</h3>
                                <div className="text-[#2D1B14] font-black text-lg mb-4">$ {product.price}</div>

                                <p className="text-xs text-stone-500 mb-6 px-4 leading-relaxed line-clamp-2">
                                    {product.description || "Rich coffee brewed of Italian origin roast with raw sugar and steamed milk."}
                                </p>

                                {/* Stars */}
                                <div className="flex text-[#C37D46] gap-1 mb-8">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#C37D46" />)}
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={() => addItem(product)}
                                    className="bg-[#C37D46] text-white w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#A66330] transition-colors flex items-center justify-center gap-2 group"
                                >
                                    add to cart
                                    <span className="bg-white/20 rounded-full p-0.5 group-hover:bg-white/30 transition-colors">
                                        <Plus size={14} />
                                    </span>
                                </button>

                                {/* Right Side Toggles (Visual Only for now) */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col gap-2 bg-white rounded-full p-1 shadow-lg border border-stone-100 hidden xl:flex">
                                    <div className="w-8 h-8 rounded-full bg-[#C37D46] text-white flex items-center justify-center text-[10px] font-bold">L</div>
                                    <div className="w-8 h-8 rounded-full bg-[#F5F5DC] text-[#2D1B14] flex items-center justify-center text-[10px] font-bold">M</div>
                                    <div className="w-8 h-8 rounded-full bg-[#F5F5DC] text-[#2D1B14] flex items-center justify-center text-[10px] font-bold">S</div>
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
