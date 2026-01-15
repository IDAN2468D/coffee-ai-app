
'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/lib/store';
import { getAIPairing } from '@/lib/pairing-logic';
import { Product } from '@/lib/products';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Sparkles, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function AIPairingPopup() {
    const { recentlyAddedItem, clearRecentlyAdded, addItem } = useCart();
    const [suggestion, setSuggestion] = useState<{ suggestedProduct: Product, reason: string } | null>(null);

    useEffect(() => {
        if (recentlyAddedItem) {
            const match = getAIPairing(recentlyAddedItem);
            if (match) {
                setSuggestion(match);
            } else {
                setSuggestion(null);
            }
        }
    }, [recentlyAddedItem]);

    const handleAddSuggestion = () => {
        if (suggestion) {
            addItem(suggestion.suggestedProduct);
            handleClose();
        }
    };

    const handleClose = () => {
        setSuggestion(null);
        clearRecentlyAdded();
    };

    if (!suggestion) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white/90 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-2xl p-5 z-50 flex flex-col gap-4 overflow-hidden"
                dir="rtl"
            >
                {/* AI Badge */}
                <div className="absolute top-0 right-0 bg-[#2D1B14] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C37D46]" />
                    AI PAIRING
                </div>

                <div className="flex gap-4 pt-2">
                    <div className="w-20 h-20 bg-stone-100 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                            src={suggestion.suggestedProduct.image}
                            alt={suggestion.suggestedProduct.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#2D1B14] leading-tight mb-1">{suggestion.suggestedProduct.name}</h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mb-2">{suggestion.reason}</p>
                        <div className="text-[#C37D46] font-black text-sm">₪{suggestion.suggestedProduct.price.toFixed(2)}</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleAddSuggestion}
                        className="flex-1 bg-[#2D1B14] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        הוסף להזמנה
                    </button>
                    <button
                        onClick={handleClose}
                        className="w-10 bg-stone-100 text-stone-500 rounded-xl flex items-center justify-center hover:bg-stone-200 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
