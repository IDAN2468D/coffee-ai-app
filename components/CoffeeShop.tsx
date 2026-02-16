'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Plus, Minus, Zap } from 'lucide-react';
import { useCartStore } from '@/context/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/src/types';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            type="submit"
            className="bg-[#C37D46] text-white w-full py-4 rounded-xl font-bold tracking-widest text-sm hover:bg-[#A66330] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <span>הוסף לסל</span>
                    <span className="bg-white/20 rounded-full p-0.5 group-hover:bg-white/30 transition-colors">
                        <Plus size={14} />
                    </span>
                </>
            )}
        </button>
    );
}

export default function CoffeeShop({ initialProducts = [], initialFavoriteIds = [] }: { initialProducts?: Product[], initialFavoriteIds?: string[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('הכל');
    const { items, addItem, removeItem } = useCartStore();
    const [favoriteIds, setFavoriteIds] = useState<string[]>(initialFavoriteIds);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
    const [isHappyHour, setIsHappyHour] = useState(false);

    useEffect(() => {
        function checkHappyHour() {
            const now = new Date();
            const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
            const hour = israelTime.getHours();
            setIsHappyHour(hour >= 14 && hour < 17);
        }
        checkHappyHour();
        const interval = setInterval(checkHappyHour, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleFavorite = async (productId: string) => {
        // Optimistic update
        const isFav = favoriteIds.includes(productId);
        const newFavs = isFav ? favoriteIds.filter(id => id !== productId) : [...favoriteIds, productId];
        setFavoriteIds(newFavs);

        try {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            // Revert on error
            setFavoriteIds(favoriteIds);
        }
    };

    const handleSizeSelect = (productId: string, size: string) => {
        setSelectedSizes(prev => ({ ...prev, [productId]: size }));
    };


    const categories = ['הכל', 'חם', 'קר', 'מאפים', 'קפסולות'];

    const filteredProducts = initialProducts.filter(p => {
        if (activeCategory === 'הכל') return true;
        const categoryRaw = p.category as any;
        const categoryName = typeof categoryRaw === 'string' ? categoryRaw : categoryRaw?.name;
        // Map Hebrew UI categories to English DB categories or just match if DB updated
        // For now, let's map Hebrew back to the English DB keys or string values
        // Actually, seed used English keys 'Hot', 'Cold', etc for `category.name`?
        // Let's check prisma logic. `prisma/seed.js` used: `name of categoryNames`.
        // I did NOT translate `categoryNames` in seed.js to Hebrew. I only translated Product Names.
        // So DB categories are still: Hot, Cold, Pastry, Beans, Equipment, Capsules.

        switch (activeCategory) {
            case 'חם': return categoryName === 'Hot' || categoryName === 'Coffee';
            case 'קר': return categoryName === 'Cold';
            case 'מאפים': return categoryName === 'Pastry' || categoryName === 'Bakery';
            case 'קפסולות': return categoryName === 'Capsules';
            case 'ציוד': return categoryName === 'Equipment'; // Added Equipment if needed
            default: return false;
        }
    });

    return (
        <section id="menu" className="py-24 bg-[#F2F2F2]">
            <div className="max-w-7xl mx-auto px-6" dir="rtl">

                {/* Categories */}
                <div className="flex justify-center flex-wrap gap-4 md:space-x-8 md:space-x-reverse mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-lg font-serif font-bold tracking-wide uppercase transition-colors px-4 py-2 rounded-full ${activeCategory === cat ? 'bg-[#2D1B14] text-white shadow-lg' : 'text-stone-400 hover:text-[#2D1B14] hover:bg-stone-200'
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
                                className="relative bg-white rounded-[2rem] p-6 pt-24 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center mt-12 group/card"
                            >
                                {/* Happy Hour Badge */}
                                {isHappyHour && (product.tags?.includes('PASTRY') || (product.category as any)?.name === 'Pastry' || product.category === 'Pastry') && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -12 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute top-4 left-4 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                                    >
                                        <Zap className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Happy Hour</span>
                                    </motion.div>
                                )}
                                {/* Floating Image */}
                                <Link
                                    href={`/shop/${product.id}`}
                                    className="absolute -top-16 w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover/card:scale-110 transition-transform duration-500 cursor-pointer"
                                >
                                    {product.image && (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                            onError={(e) => {
                                                (e.target as any).src = '/placeholder.png';
                                            }}
                                        />
                                    )}
                                </Link>

                                {/* Heart Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                                >
                                    <Star className={`w-5 h-5 ${favoriteIds.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-stone-300'}`} />
                                </button>


                                {/* Content */}
                                <Link href={`/shop/${product.id}`} className="block mb-2 group-hover/card:text-[#C37D46] transition-colors">
                                    <h3 className="text-xl font-serif font-bold text-[#2D1B14]">{product.name}</h3>
                                </Link>
                                {/* Dynamic Pricing */}
                                {isHappyHour && (product.tags?.includes('PASTRY') || (product.category as any)?.name === 'Pastry' || product.category === 'Pastry') ? (
                                    <div className="mb-4 flex items-center gap-2 justify-center">
                                        <span className="text-stone-400 line-through text-sm">₪{product.price}</span>
                                        <span className="text-[#2D1B14] font-black text-lg">₪{Math.round(product.price * 0.85)}</span>
                                        <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">-15%</span>
                                    </div>
                                ) : (
                                    <div className="text-[#2D1B14] font-black text-lg mb-4">₪{product.price}</div>
                                )}

                                <p className="text-xs text-stone-500 mb-6 px-4 leading-relaxed line-clamp-2 min-h-[2.5em]">
                                    {product.description || "Rich coffee brewed of Italian origin roast with raw sugar and steamed milk."}
                                </p>

                                {/* Stars */}
                                <div className="flex text-[#C37D46] gap-1 mb-8 justify-center">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#C37D46" />)}
                                </div>

                                {/* Add Button */}
                                <form action={async () => {
                                    const size = (selectedSizes[product.id] || 'M');
                                    await import('@/app/actions/cart').then(mod => mod.addToCart({
                                        productId: product.id,
                                        quantity: 1,
                                        size: size
                                    }));
                                }}>
                                    <SubmitButton />
                                </form>

                                {/* Right Side Toggles (Interactive) */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-2 bg-white rounded-full p-1 shadow-lg border border-stone-100 hidden xl:flex">
                                    {['L', 'M', 'S'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeSelect(product.id, size)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${(selectedSizes[product.id] || 'M') === size
                                                ? 'bg-[#C37D46] text-white'
                                                : 'bg-[#F5F5DC] text-[#2D1B14] hover:bg-[#E8E8C8]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
