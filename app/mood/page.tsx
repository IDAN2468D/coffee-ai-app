
'use client';

import React, { useState } from 'react';
import Navbar from "@/components/TempNavbar";
import { Sparkles, MessageSquare, Coffee, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export default function MoodPage() {
    const [mood, setMood] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<{ product: Product, reason: string } | null>(null);

    const presetMoods = [
        "עייף מאוד 😴",
        "לחוץ 🤯",
        "רומנטי 🥰",
        "צריך אנרגיה ⚡",
        "רגוע 🧘‍♂️",
        "בא לי משהו מתוק 🍭"
    ];

    const handleGetRecommendation = async (selectedMood: string) => {
        if (!selectedMood) return;

        setIsLoading(true);
        setRecommendation(null);
        setMood(selectedMood);

        try {
            const res = await fetch('/api/recommend-mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: selectedMood })
            });
            const data = await res.json();
            setRecommendation(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white" dir="rtl">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
            }}></div>

            <Navbar />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/30 backdrop-blur-md shadow-[0_0_15px_rgba(195,125,70,0.3)]">
                        <MessageSquare className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-[#C37D46]">AI Sommelier</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#C37D46] to-[#8B4513] drop-shadow-sm pb-2">
                        Mood Brew
                    </h1>
                    <p className="text-xl text-white/40 max-w-lg mx-auto leading-relaxed font-light">
                        איך אתם מרגישים עכשיו? <br />
                        ספרו ל-AI, והוא יתאים לכם את הקפה המושלם.
                    </p>
                </div>

                {/* Main Interaction Area */}
                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Input */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* Preset Moods */}
                        <div className="flex flex-wrap gap-3">
                            {presetMoods.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleGetRecommendation(m)}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-[#C37D46]/20 hover:border-[#C37D46]/50 transition-all text-sm font-medium hover:scale-105"
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {/* Custom Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendation(mood)}
                                placeholder="או כתבו כאן איך אתם מרגישים..."
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-[#C37D46] focus:ring-1 focus:ring-[#C37D46] transition-all"
                            />
                            <button
                                onClick={() => handleGetRecommendation(mood)}
                                className="absolute left-3 top-3 bottom-3 bg-[#C37D46] hover:bg-[#A66330] p-3 rounded-xl transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Result */}
                    <div className="relative min-h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="w-20 h-20 border-4 border-[#C37D46] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-[#C37D46] font-mono animate-pulse tracking-widest uppercase">
                                        Brewing logic...
                                    </p>
                                </motion.div>
                            ) : recommendation ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="w-full bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={recommendation.product.image}
                                            alt={recommendation.product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
                                            <span className="text-[#C37D46] font-bold">₪{recommendation.product.price}</span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div>
                                            <div className="text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">
                                                המלצת ה-AI עבורך
                                            </div>
                                            <h3 className="text-3xl font-serif font-black text-white/90">
                                                {recommendation.product.name}
                                            </h3>
                                        </div>

                                        <div className="bg-[#C37D46]/10 border-r-2 border-[#C37D46] p-4 text-white/80 italic font-serif leading-relaxed">
                                            "{recommendation.reason}"
                                        </div>

                                        <button className="w-full bg-[#C37D46] py-4 rounded-xl font-bold text-white hover:bg-[#A66330] shadow-lg shadow-[#C37D46]/20 transition-all active:scale-95">
                                            הוסף להזמנה
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center opacity-30 pointer-events-none"
                                >
                                    <Coffee className="w-32 h-32 mx-auto stroke-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </main>
    );
}
