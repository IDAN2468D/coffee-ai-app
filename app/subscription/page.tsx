'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Coffee, Calendar, Info, Check, Package, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
    const [cupsPerDay, setCupsPerDay] = useState(3);
    const [basketSize, setBasketSize] = useState(18); // grams
    const { addItem } = useCart();
    const router = useRouter();

    // Calculations
    const gramsPerDay = cupsPerDay * basketSize;
    const bagWeight = 250; // Standard bag
    const daysLasting = Math.floor(bagWeight / gramsPerDay);
    const bagsPerMonth = Math.ceil((gramsPerDay * 30) / bagWeight);

    // Mock Product for Subscription
    const subscriptionProduct = {
        id: 'sub-ethiopia',
        name: 'Ethiopian Bundle (Subscription)',
        description: `Monthly supply of ${bagsPerMonth} bags based on your habit.`,
        price: 18.00 * bagsPerMonth * 0.9, // 10% discount
        image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop',
        category: 'Beans' as const
    };

    const handleSubscribe = () => {
        addItem({
            id: subscriptionProduct.id,
            name: `${subscriptionProduct.name} - ${bagsPerMonth} Bags`,
            price: subscriptionProduct.price,
            image: subscriptionProduct.image,
            quantity: 1,
            // category: 'Beans' // Store might not need category, but Product interface has it.
            // Using logic from store.ts which spreads product.
            description: subscriptionProduct.description,
            category: 'Beans'
        });
        router.push('/checkout');
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-24">

                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/20 text-[#C37D46]">
                        <Sparkles size={18} />
                        <span className="text-sm font-bold tracking-widest uppercase">Smart Subscription AI</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-black text-[#2D1B14] tracking-tight">
                        לעולם אל תיתקע בלי <span className="text-[#C37D46]">קפה</span>
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
                        המחשבון שלנו ינתח את הרגלי השתייה שלך ויבנה לך את המנוי המדויק,
                        כדי שהפולים יגיעו לפתח הדלת בדיוק כשהשקית הקודמת נגמרת.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Calculator Card */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-stone-100">
                        <div className="space-y-10">
                            <div>
                                <label className="flex items-center gap-3 text-lg font-bold text-[#2D1B14] mb-4">
                                    <Coffee className="text-[#C37D46]" />
                                    כמה כוסות ביום?
                                </label>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={cupsPerDay}
                                        onChange={(e) => setCupsPerDay(Number(e.target.value))}
                                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#C37D46]"
                                    />
                                    <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-[#2D1B14] text-white px-3 py-1 rounded-lg font-bold text-sm">
                                        {cupsPerDay} כוסות
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-stone-400 font-mono">
                                        <span>1</span>
                                        <span>5</span>
                                        <span>10</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 text-lg font-bold text-[#2D1B14] mb-4">
                                    <Info className="text-[#C37D46]" />
                                    גודל הסלסלה (גרם לידית)?
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[16, 18, 20].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setBasketSize(size)}
                                            className={`py-3 rounded-xl border-2 font-bold transition-all ${basketSize === size ? 'border-[#C37D46] bg-[#C37D46]/5 text-[#C37D46]' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}
                                        >
                                            {size}g
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-stone-400 mt-2">18g הוא הסטנדרט למנה כפולה ברוב המכונות.</p>
                            </div>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="space-y-6">
                        <div className="bg-[#2D1B14] text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C37D46] rounded-full blur-[80px] opacity-20 pointer-events-none" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold mb-1">התוכנית שלך</h3>
                                        <p className="text-white/60 text-sm">מבוסס על צריכה יומית של {gramsPerDay}g</p>
                                    </div>
                                    <Package size={40} className="text-[#C37D46]" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                                        <div className="text-3xl font-black mb-1">{bagsPerMonth}</div>
                                        <div className="text-xs text-white/60 uppercase tracking-widest">שקיות בחודש</div>
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                                        <div className="text-3xl font-black mb-1">{daysLasting}</div>
                                        <div className="text-xs text-white/60 uppercase tracking-widest">ימים לשקית</div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-white/80">מחיר מיוחד למנוי</span>
                                        <span className="text-3xl font-bold text-[#C37D46]">₪{subscriptionProduct.price.toFixed(0)}<span className="text-sm text-white/40 font-normal">/חודש</span></span>
                                    </div>
                                    <button
                                        onClick={handleSubscribe}
                                        className="w-full bg-white text-[#2D1B14] py-4 rounded-xl font-black text-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        הוסף מנוי לסל
                                        <Check size={20} />
                                    </button>
                                    <p className="text-center text-xs text-white/40 mt-3">ביטול בכל עת. ללא התחייבות.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
