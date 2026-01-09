'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/lib/products';
import { Search, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CoffeeShop({ initialProducts = [] }: { initialProducts?: any[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('הכל');
    const [searchTerm, setSearchTerm] = useState('');
    const { items, addItem, removeItem, total } = useCart();

    const categories = ['הכל', 'חם', 'קר', 'מאפים', 'פולים', 'ציוד'];

    const filteredProducts = (initialProducts.length > 0 ? initialProducts : PRODUCTS).filter(p =>
        (activeCategory === 'הכל' || p.category === activeCategory) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="space-y-12 pb-24" dir="rtl">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl shadow-stone-200/50">
                <div className="flex flex-wrap p-1.5 bg-stone-100 rounded-2xl border border-stone-200 w-fit justify-center md:justify-start">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-6 py-2.5 rounded-xl transition-all text-sm font-semibold ${activeCategory === cat
                                ? 'bg-white text-[#2D1B14] shadow-sm'
                                : 'text-stone-500 hover:text-[#2D1B14]'
                                }`}
                        >
                            {cat}
                            {activeCategory === cat && (
                                <motion.div layoutId="pill" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-sm" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-[#2D1B14] transition-colors" />
                    <input
                        type="text"
                        placeholder="חפש בתפריט שלנו..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-12 pl-6 py-3.5 bg-white border-2 border-stone-100 rounded-2xl text-sm focus:outline-none focus:border-[#2D1B14]/20 transition-all shadow-inner shadow-stone-50 text-right font-bold"
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.map((product, idx) => {
                        const cartItem = items.find(i => i.id === product.id);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={product.id}
                                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-black text-[#2D1B14] shadow-xl">
                                        ₪{product.price.toFixed(0)}
                                    </div>

                                    {/* Category Tag */}
                                    <div className="absolute bottom-5 right-5">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-bold text-white tracking-widest border border-white/30">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex-grow flex flex-col bg-stone-50/50 text-right">
                                    <h3 className="text-2xl font-serif font-bold text-[#2D1B14] mb-3 leading-tight">{product.name}</h3>
                                    <p className="text-stone-500 text-[15px] mb-8 leading-relaxed font-light">{product.description}</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        {cartItem ? (
                                            <div className="flex items-center space-x-6 space-x-reverse bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-sm w-full justify-center">
                                                <button
                                                    onClick={() => removeItem(product.id)}
                                                    className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-400 hover:text-red-500"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <span className="font-bold text-lg min-w-[24px] text-center text-[#2D1B14]">{cartItem.quantity}</span>
                                                <button
                                                    onClick={() => addItem(product)}
                                                    className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-400 hover:text-green-600"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addItem(product)}
                                                className="group/btn flex items-center space-x-3 space-x-reverse bg-[#2D1B14] text-white pr-6 pl-5 py-4 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 w-full justify-between overflow-hidden relative"
                                            >
                                                <span className="text-sm font-bold tracking-wide uppercase">הוסף להזמנה</span>
                                                <div className="bg-white/10 p-1.5 rounded-xl group-hover/btn:-translate-x-1 transition-transform">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Floating Checkout Bar */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
                    >
                        <Link href="/checkout">
                            <div className="bg-[#2D1B14] text-white p-5 pl-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(45,27,20,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group cursor-pointer border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center space-x-6 space-x-reverse">
                                    <div className="relative bg-white/10 p-4 rounded-2xl">
                                        <ShoppingBag className="w-7 h-7" />
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-[#2D1B14]">
                                            {cartCount}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] uppercase tracking-[0.2em] font-black opacity-50 mb-1">הבחירה שלך</p>
                                        <p className="text-2xl font-black">₪{total.toFixed(0)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 space-x-reverse bg-white/95 text-[#2D1B14] px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider group-hover:bg-white transition-colors">
                                    <span>סיום הזמנה</span>
                                    <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
                <div className="text-center py-32 bg-stone-100/50 rounded-[3rem] border-4 border-dashed border-stone-200">
                    <p className="text-stone-400 font-serif italic text-xl">לא נמצאו פריטים שתואמים לחיפוש שלך.</p>
                </div>
            )}
        </div>
    );
}
