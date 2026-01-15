
'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { Coffee, RotateCcw, ShoppingBag, Star, Sparkles, Tag, Check, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store';
import { Product } from '@/lib/products';

const FLAVOR_TAGS = [
    { id: 'choc', label: 'שוקולדי', color: '#5D4037' },
    { id: 'nut', label: 'אגוזי', color: '#8D6E63' },
    { id: 'fruit', label: 'פירותי', color: '#E57373' },
    { id: 'floral', label: 'פרחוני', color: '#F06292' },
    { id: 'spicy', label: 'תבלינים', color: '#FFB74D' },
    { id: 'caramel', label: 'קרמל', color: '#D4A017' }
];

export default function CustomBlendClient() {
    const { addItem } = useCart();

    // State
    const [name, setName] = useState('');
    const [arabicaRatio, setArabicaRatio] = useState(80); // 0-100
    const [roastLevel, setRoastLevel] = useState(3); // 1-5
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    const [grind, setGrind] = useState('beans');

    const toggleFlavor = (id: string) => {
        if (selectedFlavors.includes(id)) {
            setSelectedFlavors(prev => prev.filter(f => f !== id));
        } else {
            if (selectedFlavors.length < 3) {
                setSelectedFlavors(prev => [...prev, id]);
            }
        }
    };

    const handleAddToCart = () => {
        const blendName = name || `My Custom Blend #${Math.floor(Math.random() * 1000)}`;

        const customProduct: Product = {
            id: `custom-${Date.now()}`,
            name: blendName,
            description: `תערובת אישית: ${arabicaRatio}% ערביקה, ${100 - arabicaRatio}% רובוסטה. קלייה ${getRoastLabel(roastLevel)}.`,
            price: 65, // Standard custom blend price
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop',
            category: 'Beans'
        };

        addItem(customProduct, 'M'); // Default size M for bags usually implies 250g/Standard

        // Show success animation or toast (omitted for brevity, assume global toast handles cart updates usually)
        alert('התערובת נוספה לסל! 🎨☕');
    };

    const getRoastLabel = (level: number) => {
        switch (level) {
            case 1: return 'בהירה (Light City)';
            case 2: return 'בינונית (City)';
            case 3: return 'בינונית-כהה (Full City)';
            case 4: return 'כהה (Vienna)';
            case 5: return 'כהה מאוד (French)';
            default: return 'בינונית';
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">

                {/* Visual Preview Panel (Sticky) */}
                <div className="lg:sticky lg:top-32 w-full lg:w-1/2">
                    <div className="relative aspect-square max-w-lg mx-auto bg-[#F5F1E8] rounded-[3rem] shadow-2xl p-12 flex items-center justify-center overflow-hidden group">
                        {/* Dynamic Bag Lighting */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D1B14]/10 to-transparent opacity-50" />

                        {/* Coffee Bag Visual (Simplified CSS art or Image composite) */}
                        <div className="relative w-64 h-80 bg-[#E8E6D9] rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center text-center p-6 border-b-8 border-[#D8D6C9] transform transition-transform duration-500 hover:scale-105">
                            {/* Bag Fold */}
                            <div className="absolute -top-4 w-full h-8 bg-[#D8D6C9] skew-x-12 opacity-50" />

                            <div className="mt-8 mb-4">
                                <div className="w-16 h-16 bg-[#2D1B14] rounded-full flex items-center justify-center mx-auto text-white">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                            </div>

                            <h2 className="font-serif font-black text-2xl text-[#2D1B14] leading-tight break-words w-full h-16 flex items-center justify-center">
                                {name || "התערובת שלך"}
                            </h2>

                            <div className="mt-4 space-y-1 w-full">
                                <div className="h-0.5 w-10 bg-[#C37D46] mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest text-[#2D1B14]">{getRoastLabel(roastLevel).split('(')[0]}</p>
                                <p className="text-[10px] text-stone-500 flex justify-center gap-2">
                                    <span>{arabicaRatio}% Arabica</span>
                                    <span>•</span>
                                    <span>{100 - arabicaRatio}% Robusta</span>
                                </p>
                            </div>

                            <div className="mt-auto flex gap-1 justify-center flex-wrap">
                                {selectedFlavors.map(fid => {
                                    const f = FLAVOR_TAGS.find(t => t.id === fid);
                                    return (
                                        <span key={fid} className="text-[10px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: f?.color }}>
                                            {f?.label}
                                        </span>
                                    )
                                })}
                            </div>

                            {/* Label Texture */}
                            <div className="absolute inset-4 border border-[#2D1B14]/10 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="w-full lg:w-1/2 space-y-10">
                    <div>
                        <div className="inline-flex items-center space-x-2 space-x-reverse px-4 py-2 bg-[#C37D46]/10 text-[#C37D46] rounded-full mb-4">
                            <Award className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase tracking-widest">Custom Roast Lab</span>
                        </div>
                        <h1 className="text-5xl font-serif font-black text-[#2D1B14] leading-tight mb-4">
                            הרכיבו את <br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-[#C37D46] to-[#8B4513]">טביעת האצבע</span> שלכם.
                        </h1>
                        <p className="text-stone-500 text-lg">
                            בחרו את הזנים, רמת הקלייה והטעמים המועדפים עליכם, ואנחנו נקלה את זה במיוחד בשבילכם.
                        </p>
                    </div>

                    <div className="space-y-8 bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
                        {/* Name Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-black text-[#2D1B14] uppercase tracking-wide">שם התערובת</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="למשל: בוקר של אלופים"
                                className="w-full bg-stone-50 border-2 border-stone-100 focus:border-[#2D1B14] rounded-xl px-4 py-3 text-lg font-bold outline-none transition-all"
                            />
                        </div>

                        {/* Bean Ratio Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-black text-[#2D1B14] uppercase tracking-wide">הרכב הפולים</label>
                                <span className="text-xs font-bold text-stone-400">איזון בין מתיקות (ערביקה) לגוף (רובוסטה)</span>
                            </div>

                            <div className="relative h-12 bg-stone-100 rounded-xl overflow-hidden flex">
                                <motion.div
                                    className="h-full bg-[#2D1B14] flex items-center justify-center text-white text-xs font-bold"
                                    animate={{ width: `${arabicaRatio}%` }}
                                >
                                    {arabicaRatio > 20 && `${arabicaRatio}% Arabica`}
                                </motion.div>
                                <motion.div
                                    className="h-full bg-[#8B4513] flex items-center justify-center text-white text-xs font-bold"
                                    animate={{ width: `${100 - arabicaRatio}%` }}
                                >
                                    {100 - arabicaRatio > 20 && `${100 - arabicaRatio}% Robusta`}
                                </motion.div>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="10"
                                value={arabicaRatio}
                                onChange={(e) => setArabicaRatio(parseInt(e.target.value))}
                                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#2D1B14]"
                            />
                        </div>

                        {/* Roast Level */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-black text-[#2D1B14] uppercase tracking-wide">רמת קלייה</label>
                                <span className="font-bold text-[#C37D46]">{getRoastLabel(roastLevel)}</span>
                            </div>
                            <div className="flex justify-between px-2 text-xl mb-2">
                                {[1, 2, 3, 4, 5].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setRoastLevel(l)}
                                        className={`transition-transform ${l === roastLevel ? 'scale-125' : 'opacity-30'}`}
                                    >
                                        🔥
                                    </button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={roastLevel}
                                onChange={(e) => setRoastLevel(parseInt(e.target.value))}
                                className="w-full h-2 bg-gradient-to-r from-[#D7CCC8] to-[#3E2723] rounded-lg appearance-none cursor-pointer accent-[#2D1B14]"
                            />
                        </div>

                        {/* Flavors */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-[#2D1B14] uppercase tracking-wide">דגשי טעם (עד 3)</label>
                            <div className="flex flex-wrap gap-3">
                                {FLAVOR_TAGS.map(tag => {
                                    const isSelected = selectedFlavors.includes(tag.id);
                                    return (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleFlavor(tag.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all flex items-center gap-2 ${isSelected
                                                    ? 'bg-[#2D1B14] text-white border-[#2D1B14]'
                                                    : 'bg-white text-stone-500 border-stone-200 hover:border-[#C37D46]'
                                                }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3" />}
                                            {tag.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-6">
                            <div className="text-right">
                                <span className="block text-xs text-stone-500 mb-1">מחיר לשקית 250 גרם</span>
                                <span className="text-3xl font-black text-[#2D1B14]">₪65.00</span>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#2D1B14] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span>צור והוסף לסל</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
