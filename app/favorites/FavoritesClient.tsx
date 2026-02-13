'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/products'; // Note: using the interface from lib/products or prisma client type
import { Star, Trash2, ShoppingBag, CheckSquare, Square, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/context/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FavoritesClientProps {
    initialFavorites: Product[]; // Updated from any to Product
}

export default function FavoritesClient({ initialFavorites }: FavoritesClientProps) {
    const [favorites, setFavorites] = useState(initialFavorites);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { addItem } = useCartStore();
    const router = useRouter();

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sId => sId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === favorites.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(favorites.map(f => f.id));
        }
    };

    const handleRemoveSelected = async () => {
        // Optimistic update
        const remaining = favorites.filter(f => !selectedIds.includes(f.id));
        setFavorites(remaining);
        setSelectedIds([]);

        // Call API for each removed item to toggle it off
        for (const id of selectedIds) {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id })
            });
        }
        router.refresh();
    };

    const handleAddToCartSelected = () => {
        favorites.filter(f => selectedIds.includes(f.id)).forEach(product => {
            addItem(product);
        });
        // Optional: Notify user
        alert('Items added to cart!');
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12" dir="rtl">
            <header className="mb-12 text-right">
                <Link href="/dashboard" className="text-stone-400 hover:text-[#8B4513] mb-4 inline-flex items-center gap-2">
                    <ArrowRight size={16} /> בחזרה לדשבורד
                </Link>
                <h1 className="text-4xl font-serif font-bold text-[#2D1B14] mt-2">המועדפים שלי</h1>
                <p className="text-stone-500 mt-2">נהלו את הפריטים שאהבתם ומצאו את הבחירה המושלמת</p>
            </header>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
                    <Star className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                    <p className="text-xl font-medium text-stone-400">רשימת המועדפים שלך ריקה</p>
                    <Link href="/shop" className="mt-6 inline-block bg-[#2D1B14] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#8B4513] transition-colors">
                        למעבר לחנות
                    </Link>
                </div>
            ) : (
                <>
                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 mb-8 flex items-center justify-between sticky top-4 z-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 text-sm font-bold text-[#2D1B14] hover:bg-stone-50 px-3 py-2 rounded-lg transition-colors"
                            >
                                {selectedIds.length === favorites.length ? <CheckSquare size={20} /> : <Square size={20} />}
                                בחירה הכל
                            </button>
                            <span className="text-stone-400 text-sm">|</span>
                            <span className="text-sm text-stone-500">{selectedIds.length} נבחרו</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddToCartSelected}
                                disabled={selectedIds.length === 0}
                                className="flex items-center gap-2 bg-[#C37D46] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#A66330] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ShoppingBag size={16} />
                                הוסף לסל
                            </button>
                            <button
                                onClick={handleRemoveSelected}
                                disabled={selectedIds.length === 0}
                                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Trash2 size={16} />
                                הסר
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleSelect(product.id)}
                                className={`group relative bg-white rounded-2xl p-4 transition-all cursor-pointer border-2 ${selectedIds.includes(product.id) ? 'border-[#C37D46] shadow-md bg-[#FFF8F0]' : 'border-transparent hover:border-stone-100 shadow-sm'}`}
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    {selectedIds.includes(product.id) ? (
                                        <div className="w-6 h-6 bg-[#C37D46] rounded-md flex items-center justify-center text-white">
                                            <CheckSquare size={16} />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 border-2 border-stone-200 rounded-md group-hover:border-[#C37D46]" />
                                    )}
                                </div>

                                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-stone-50 relative">
                                    <Image src={product.image || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                                </div>

                                <div className="text-right">
                                    <h3 className="font-serif font-bold text-lg text-[#2D1B14]">{product.name}</h3>
                                    <p className="text-sm text-stone-500 line-clamp-2 mt-1">{product.description}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-bold text-[#8B4513] text-lg">${product.price}</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} size={12} className="fill-[#C37D46] text-[#C37D46]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
