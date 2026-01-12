'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { Coffee, Sparkles, RefreshCw, Moon, Star, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SYMBOLS = [
    { name: 'לב', icon: '❤️', id: 'heart', description: 'אהבה, תשוקה, וקרבה רגשית' },
    { name: 'ציפור', icon: '🐦', id: 'bird', description: 'חופש, בשורות טובות, ומסע חדש' },
    { name: 'הר', icon: '🏔️', id: 'mountain', description: 'אתגר, יציבות, והישגים גדולים' },
    { name: 'כוכב', icon: '⭐', id: 'star', description: 'תקווה, מזל, והצלחה עתידית' },
    { name: 'דג', icon: '🐟', id: 'fish', description: 'שפע, פריון, ועושר רוחני' },
    { name: 'עין', icon: '👁️', id: 'eye', description: 'אינטואיציה, הגנה, וראיית הנסתר' },
    { name: 'סולם', icon: '🪜', id: 'ladder', description: 'התקדמות בקריירה, עלייה בדרגה' },
    { name: 'עץ', icon: '🌳', id: 'tree', description: 'צמיחה, משפחה, ושורשים' },
];

export default function FortuneClient() {
    const [state, setState] = useState<'ready' | 'drinking' | 'reading' | 'result'>('ready');
    const [fortune, setFortune] = useState<string>('');
    const [symbol, setSymbol] = useState<any>(null);

    const startRitual = async () => {
        setState('drinking');

        // Simulate drinking time
        setTimeout(async () => {
            setState('reading');

            // Pick a random symbol
            const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            setSymbol(randomSymbol);

            try {
                // Get interpretation from Gemini
                const response = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `תפקד כקוראת בקפה מיסטית ומשעשעת. "ראיתי" צורה של ${randomSymbol.name} בתחתית כוס הקפה. תן לי תחזית קצרה, מיסטית ומעוררת השראה (עד 3 משפטים) על מה זה אומר לגבי העתיד הקרוב שלי. היה יצירתי! השתמש באימוג'יז.`
                    })
                });

                const data = await response.json();
                setFortune(data.reply);
                setState('result');
            } catch (error) {
                console.error("Failed to read fortune", error);
                setFortune("הערפל כבד היום... הרוחות לא מדברות. נסה שוב מאוחר יותר.");
                setState('result');
            }
        }, 3000);
    };

    const reset = () => {
        setState('ready');
        setFortune('');
        setSymbol(null);
    };

    return (
        <main className="min-h-screen bg-[#0F0A08] font-sans flex flex-col text-white relative overflow-hidden" dir="rtl">
            <Navbar />

            {/* Mystic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
            </div>

            <div className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 pt-20">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full mb-4 backdrop-blur-md">
                        <Sparkles className="w-5 h-5 text-[#C37D46] animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-[#C37D46] via-[#E8CBAD] to-[#C37D46] bg-clip-text text-transparent mb-4">
                        האורקל בקפה
                    </h1>
                    <p className="text-white/50 text-lg font-light max-w-xl mx-auto">
                        גלה מה צופן לך העתיד. לגום מהקפה הווירטואלי, ומשקעים יגלו את האמת.
                    </p>
                </motion.div>

                <div className="relative w-80 h-80 md:w-96 md:h-96 mb-12 flex items-center justify-center">
                    {/* Coffee Cup Area */}
                    <AnimatePresence mode="wait">
                        {state === 'ready' && (
                            <motion.div
                                key="cup-full"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="relative cursor-pointer group"
                                onClick={startRitual}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2D1B14] rounded-full shadow-[0_0_50px_rgba(45,27,20,0.5)] border-4 border-[#5A382A] flex items-center justify-center overflow-hidden">
                                    {/* Coffee Surface */}
                                    <div className="absolute inset-2 bg-[#3E2723] rounded-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#4E342E] rounded-full blur-2xl opacity-60" />

                                        {/* Steam */}
                                        <motion.div
                                            animate={{ y: [-10, -20, -10], opacity: [0, 0.5, 0] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="absolute top-10 left-10 w-20 h-20 bg-white/5 blur-xl rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-24 border-4 border-[#2D1B14] rounded-r-3xl" />

                                <motion.div
                                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#C37D46] text-black font-bold px-8 py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                                >
                                    שתה וגלה את העתיד
                                </motion.div>
                            </motion.div>
                        )}

                        {state === 'drinking' && (
                            <motion.div
                                key="drinking"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-4"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-8xl"
                                >
                                    ☕
                                </motion.div>
                                <p className="text-xl font-serif text-[#C37D46] animate-pulse">לוגם את הקפה...</p>
                            </motion.div>
                        )}

                        {state === 'reading' && (
                            <motion.div
                                key="reading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative flex flex-col items-center justify-center"
                            >
                                <div className="w-64 h-64 border-4 border-dashed border-[#C37D46]/30 rounded-full animate-spin-slow flex items-center justify-center">
                                    <div className="w-48 h-48 border-4 border-dashed border-[#C37D46]/50 rounded-full animate-spin-reverse" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-12 h-12 text-[#C37D46] animate-pulse" />
                                </div>
                                <p className="absolute -bottom-12 text-[#E8CBAD] font-serif">המשקעים מתגבשים...</p>
                            </motion.div>
                        )}

                        {state === 'result' && (
                            <motion.div
                                key="result"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative"
                            >
                                {/* Cup Bottom with Symbol */}
                                <div className="w-64 h-64 bg-[#1a0f0a] rounded-full border-4 border-[#3E2723] flex items-center justify-center shadow-[0_0_60px_rgba(195,125,70,0.2)] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 mix-blend-overlay" />
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                                        className="text-8xl filter drop-shadow-[0_0_15px_rgba(195,125,70,0.8)]"
                                    >
                                        {symbol?.icon}
                                    </motion.div>
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-full">
                                    <span className="text-sm font-black uppercase tracking-[0.3em] text-[#C37D46]">{symbol?.name}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Fortune Text */}
                <AnimatePresence>
                    {state === 'result' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 text-center max-w-2xl shadow-2xl relative"
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2D1B14] p-3 rounded-full border border-[#C37D46] shadow-lg">
                                <Moon className="w-6 h-6 text-[#C37D46]" />
                            </div>
                            <p className="text-xl md:text-2xl font-serif leading-relaxed text-[#E8CBAD]">
                                "{fortune}"
                            </p>
                            <div className="mt-8">
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 mx-auto text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    קרא שוב בקפה
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </main>
    );
}
