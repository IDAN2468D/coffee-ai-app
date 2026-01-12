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
        <main className="min-h-screen bg-gradient-to-br from-[#0a0506] via-[#1a0f0d] to-[#0f0808] font-sans flex flex-col text-white relative overflow-hidden" dir="rtl">
            <Navbar />

            {/* Enhanced Mystic Background */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5" />
            </div>

            <div className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 pt-24 pb-12">

                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity }
                        }}
                        className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 rounded-full mb-6 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                        <Sparkles className="w-7 h-7 text-amber-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-black mb-6"
                        style={{
                            textShadow: "0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.4), 0 8px 16px rgba(0,0,0,0.5)"
                        }}
                    >
                        <span
                            className="inline-block animate-shimmer"
                            style={{
                                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 25%, #fcd34d 50%, #fbbf24 75%, #f59e0b 100%)",
                                backgroundSize: "300% auto",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}
                        >
                            האורקל המיסטי
                        </span>
                        <motion.span
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 15, -15, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="inline-block mx-3"
                            style={{
                                filter: "drop-shadow(0 0 25px rgba(245,158,11,1))"
                            }}
                        >
                            ☕
                        </motion.span>
                    </motion.h1>

                    <style jsx global>{`
                        @keyframes shimmer {
                            0% { background-position: 0% 50%; }
                            100% { background-position: 300% 50%; }
                        }
                        .animate-shimmer {
                            animation: shimmer 4s linear infinite;
                        }
                    `}</style>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-amber-100/90 text-lg font-light max-w-3xl mx-auto leading-relaxed"
                        style={{
                            textShadow: "0 2px 15px rgba(0,0,0,0.6)"
                        }}
                    >
                        ✨ גלה את סודות העתיד החבויים במשקעי הקפה הקסומים ✨
                    </motion.p>

                    <div className="flex items-center justify-center gap-6 mt-6">
                        {[Star, Moon, Cloud].map((Icon, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                            >
                                <Icon className="w-5 h-5 text-amber-500/50" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <div className="relative w-full max-w-md mb-12">
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
                                {/* Glow effect */}
                                <motion.div
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-purple-600/30 rounded-full blur-3xl"
                                />

                                <div className="relative w-80 h-80 mx-auto">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-[#2D1B14] to-[#1a0f0a] rounded-full shadow-[0_0_80px_rgba(195,125,70,0.4)] border-4 border-[#5A382A] flex items-center justify-center overflow-hidden"
                                    >
                                        {/* Coffee Surface */}
                                        <div className="absolute inset-4 bg-gradient-to-br from-[#3E2723] via-[#4E342E] to-[#3E2723] rounded-full overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#4E342E] rounded-full blur-2xl opacity-60" />

                                            {/* Steam */}
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{
                                                        y: [0, -40],
                                                        opacity: [0, 0.6, 0]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        delay: i * 0.8
                                                    }}
                                                    className="absolute top-10 w-10 h-10 bg-white/10 blur-xl rounded-full"
                                                    style={{ left: `${30 + i * 20}%` }}
                                                />
                                            ))}
                                        </div>

                                        {/* Button inside cup */}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="relative z-10 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black px-8 py-4 rounded-full shadow-xl border-2 border-amber-400"
                                        >
                                            שתה וגלה את העתיד
                                        </motion.div>
                                    </motion.div>

                                    {/* Cup handle */}
                                    <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-16 h-32 border-4 border-[#2D1B14] rounded-r-3xl" />
                                </div>
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
