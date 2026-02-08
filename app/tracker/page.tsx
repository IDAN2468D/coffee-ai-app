'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/TempNavbar";
import { Plus, Clock, TrendingDown, Info, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

// Types
interface DrinkLog {
    id: number;
    name: string;
    caffeine: number; // mg
    time: Date;
    halflife: number; // hours (avg 5)
}

const COMMON_DRINKS = [
    { name: 'אספרסו קצר', caffeine: 63, icon: '☕' },
    { name: 'אספרסו כפול', caffeine: 125, icon: '☕☕' },
    { name: 'קפוצ\'ינו (הפוך)', caffeine: 75, icon: '🥛' },
    { name: 'קולד ברו', caffeine: 150, icon: '🧊' },
    { name: 'פילטר', caffeine: 140, icon: '⚗️' },
    { name: 'תה ירוק', caffeine: 30, icon: '🍵' },
];

export default function CaffeineTrackerPage() {
    const [logs, setLogs] = useState<DrinkLog[]>([]);
    const [now, setNow] = useState(new Date());

    // Effect to update "now" every minute for accurate decay view
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const addDrink = (drink: typeof COMMON_DRINKS[0]) => {
        const newLog: DrinkLog = {
            id: Date.now(),
            name: drink.name,
            caffeine: drink.caffeine,
            time: new Date(),
            halflife: 5 // Average half-life
        };
        setLogs([...logs, newLog]);
    };

    // --- Calculation Logic ---
    const calculateTotalLevel = (targetTime: Date) => {
        let total = 0;
        logs.forEach(log => {
            const diffHours = (targetTime.getTime() - log.time.getTime()) / (1000 * 60 * 60);
            if (diffHours >= 0) {
                // Formula: Concentration = Initial * (0.5)^(time / halfLife)
                total += log.caffeine * Math.pow(0.5, diffHours / log.halflife);
            }
        });
        return Math.max(0, total); // No negative caffeine
    };

    // Calculate current level
    const currentLevel = calculateTotalLevel(now);

    // Generate Graph Data (Next 12 Hours)
    const generateGraphPoints = () => {
        const points = [];
        const hoursToShow = 12;
        const width = 100; // SVG viewBox percentage
        const maxCaffeine = 400; // Recommend daily limit scale (clamped visually)

        for (let i = 0; i <= hoursToShow * 2; i++) { // Every 30 mins
            const t = new Date(now.getTime() + i * 30 * 60 * 1000);
            const level = calculateTotalLevel(t);

            // X: 0 to 100%
            const x = (i / (hoursToShow * 2)) * 100;
            // Y: 100% (bottom) to 0% (top). Scale so 400mg is top.
            const y = 100 - (Math.min(level, maxCaffeine) / maxCaffeine) * 100;

            points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    const graphPath = `M ${generateGraphPoints()}`;

    // Calculate when sleep is safe ("Safe" < 50mg is arbitrary but common threshold)
    const getSleepTime = () => {
        if (currentLevel < 50) return "עכשיו";

        let hoursAdded = 0;
        while (hoursAdded < 24) {
            const futureTime = new Date(now.getTime() + hoursAdded * 60 * 60 * 1000);
            if (calculateTotalLevel(futureTime) < 50) {
                return futureTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
            }
            hoursAdded += 0.5;
        }
        return "מחר...";
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#2D1B14]/5 px-4 py-2 rounded-full mb-4">
                        <TrendingDown className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-sm font-bold text-[#2D1B14] uppercase tracking-wider">Smart Caffeine Tracker</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-[#2D1B14] mb-4">
                        מעקב קפאין חכם
                    </h1>
                    <p className="text-stone-500 max-w-lg mx-auto">
                        למדו כיצד הקפה משפיע על הגוף שלכם לאורך זמן ותכננו את הצריכה שלכם לשינה טובה יותר.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    {/* Current Level Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#C37D46]/10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform hover:scale-110" />
                        <span className="text-stone-400 font-medium text-sm">רמה בדם כרגע</span>
                        <div className="text-5xl font-black text-[#2D1B14] tabular-nums">
                            {currentLevel.toFixed(0)}<span className="text-lg font-bold text-stone-400">mg</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full mt-2 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${currentLevel > 300 ? 'bg-red-500' : 'bg-[#C37D46]'}`}
                                style={{ width: `${Math.min((currentLevel / 400) * 100, 100)}%` }}
                            />
                        </div>
                    </motion.div>

                    {/* Sleep Time Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#2D1B14] text-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center space-y-2"
                    >
                        <Clock className="w-8 h-8 text-[#C37D46] mb-2" />
                        <span className="text-white/60 font-medium text-sm">מוכן לשינה (מתחת ל-50mg)</span>
                        <div className="text-4xl font-serif font-bold text-white">
                            {getSleepTime()}
                        </div>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#C37D46]/10 p-6 rounded-3xl border border-[#C37D46]/20 flex flex-col justify-center space-y-3"
                    >
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-[#C37D46] shrink-0 mt-1" />
                            <p className="text-sm text-[#2D1B14] leading-relaxed">
                                <strong>זמן מחצית החיים:</strong> לקפאין לוקח כ-5 שעות לרדת לחצי כמות בגוף. אספרסו ב-16:00 עדיין יהיה 50% פעיל ב-21:00!
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Graph Section */}
                <div className="bg-[#2D1B14] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden mb-12 text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 mb-1">
                                    <TrendingDown className="w-6 h-6 text-[#C37D46]" />
                                    תחזית ל-12 השעות הקרובות
                                </h3>
                                <p className="text-white/40 text-sm">הערכה מבוססת זמן מחצית חיים (5 שעות)</p>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="text-xs text-white/40 uppercase tracking-widest mb-1">קו השינה הבטוח</div>
                                <div className="text-[#4ADE80] font-mono font-bold">50mg</div>
                            </div>
                        </div>

                        <div className="relative w-full h-72 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            {/* Y-Axis Labels (Left) */}
                            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between py-4 px-2 text-[10px] text-white/30 font-mono text-right">
                                <span>400</span>
                                <span>300</span>
                                <span>200</span>
                                <span>100</span>
                                <span>0</span>
                            </div>

                            {/* Sleep Safe Zone Background (Bottom 12.5% of graph approx representing <50mg if max is 400) */}
                            <div className="absolute bottom-8 left-12 right-0 h-[12.5%] bg-[#4ADE80]/5 border-t border-[#4ADE80]/30 transition-all">
                                <div className="absolute top-0 right-2 -translate-y-1/2 text-[10px] text-[#4ADE80] bg-[#2D1B14] px-1 rounded-full">שינה טובה</div>
                            </div>

                            {/* The SVG Chart */}
                            <svg className="absolute inset-0 w-full h-full pt-4 pb-8 pl-12 pr-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C37D46" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#C37D46" stopOpacity="0" />
                                    </linearGradient>
                                    <clipPath id="chartClip">
                                        <rect width="100" height="100" />
                                    </clipPath>
                                </defs>

                                {/* Grid Lines (Vertical) */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <line key={i} x1={i * 25} y1="0" x2={i * 25} y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                                ))}

                                {/* Fill Area */}
                                <path d={`${graphPath} V 100 H 0 Z`} fill="url(#chartGradient)" className="transition-all duration-700 ease-in-out" />

                                {/* Stroke Line */}
                                <path d={graphPath} fill="none" stroke="#C37D46" strokeWidth="2" className="transition-all duration-700 ease-in-out drop-shadow-[0_0_10px_rgba(195,125,70,0.5)]" />

                            </svg>

                            {/* Current Time Dot - HTML Overlay for Perfect Roundness */}
                            <div
                                className="absolute left-12 z-20 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    top: `${5.55 + (1 - Math.min(currentLevel, 400) / 400) * 83.33}%`
                                }}
                            >
                                <div className="relative flex items-center justify-center w-8 h-8">
                                    <div className="absolute inset-0 bg-[#C37D46] opacity-30 blur-sm rounded-full animate-pulse" />
                                    <div className="relative w-4 h-4 bg-[#2D1B14] rounded-full border-2 border-[#C37D46] shadow-md z-10" />
                                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full z-20" />
                                </div>
                            </div>

                            {/* Time Labels (X Axis) */}
                            <div className="absolute bottom-2 left-12 right-4 flex justify-between text-xs text-white/40 font-mono">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const t = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
                                    return (
                                        <span key={i} className="-translate-x-1/2">
                                            {i === 0 ? 'עכשיו' : t.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Add Section */}
                <div>
                    <h3 className="text-xl font-bold text-[#2D1B14] mb-6">מה שתית עכשיו?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {COMMON_DRINKS.map((drink) => (
                            <button
                                key={drink.name}
                                onClick={() => addDrink(drink)}
                                className="flex flex-col items-center justify-center gap-3 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all w-full border border-stone-100 group"
                            >
                                <span className="text-3xl group-hover:animate-bounce">{drink.icon}</span>
                                <span className="text-sm font-bold text-[#2D1B14] text-center leading-tight">{drink.name}</span>
                                <span className="text-xs text-stone-400 font-mono">{drink.caffeine}mg</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Logs List usage (Simple list) */}
                {logs.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-lg font-bold text-stone-400 mb-4 uppercase tracking-widest text-sm">היסטוריה (סשן נוכחי)</h3>
                        <div className="space-y-3">
                            {logs.slice().reverse().map(log => (
                                <div key={log.id} className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-stone-50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[#FDFCF0] p-2 rounded-full">
                                            <Coffee className="w-5 h-5 text-[#C37D46]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#2D1B14]">{log.name}</div>
                                            <div className="text-xs text-stone-400">{log.time.toLocaleTimeString('he-IL')}</div>
                                        </div>
                                    </div>
                                    <div className="font-mono font-bold text-[#C37D46]">+{log.caffeine}mg</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
