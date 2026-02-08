
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "../../../components/TempNavbar";
import { Coffee, Timer, Droplets, Scale, Flame, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BREW_METHODS = [
    {
        id: 'v60',
        name: 'V60 Pour Over',
        icon: '🌊',
        desc: 'חליטה צלולה ונקייה המדגישה את טעמי הפרי והחמיצות.',
        defaultRatio: 16, // 1:16
        steps: [
            { time: 0, text: 'הרטבה (Bloom): מזוג 50 גרם ממים', duration: 45 },
            { time: 45, text: 'מזיגה ראשונה: עד 60% מהכמות', duration: 45 },
            { time: 90, text: 'מזיגה שנייה: השלמה ל-100%', duration: 60 },
            { time: 150, text: 'המתנה לסיום הטפטוף', duration: 30 }
        ]
    },
    {
        id: 'french',
        name: 'French Press',
        icon: '🫖',
        desc: 'גוף מלא, עשיר ושמנוני. מתאים למי שאוהב קפה חזק.',
        defaultRatio: 15,
        steps: [
            { time: 0, text: 'מזיגת כל המים בבת אחת', duration: 30 },
            { time: 30, text: 'ערבוב עדין והמתנה', duration: 210 }, // 3.5 min
            { time: 240, text: 'שבירת "קרום" הקפה למעלה', duration: 30 },
            { time: 270, text: 'דחיסת הבוכנה ומזיגה', duration: 30 }
        ]
    },
    {
        id: 'aeropress',
        name: 'Aeropress',
        icon: '🚀',
        desc: 'חליטה ורסטילית ומרוכזת, אידיאלית למטיילים.',
        defaultRatio: 14,
        steps: [
            { time: 0, text: 'מזיגת מים עד סימון 4', duration: 30 },
            { time: 30, text: 'ערבוב נמרץ 10 שניות', duration: 10 },
            { time: 40, text: 'סגירת הפקק והמתנה', duration: 60 },
            { time: 100, text: 'לחיצה איטית ויציבה', duration: 30 }
        ]
    }
];

export default function BrewCalculatorClient() {
    const [selectedMethod, setSelectedMethod] = useState(BREW_METHODS[0]);
    const [coffeeGrams, setCoffeeGrams] = useState(15);
    const [ratio, setRatio] = useState(selectedMethod.defaultRatio);
    const [waterGrams, setWaterGrams] = useState(0);

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        setWaterGrams(Math.round(coffeeGrams * ratio));
    }, [coffeeGrams, ratio]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCurrentStep = () => {
        // Find the active step based on timeElapsed
        let accumulatedTime = 0;
        for (const step of selectedMethod.steps) {
            if (timeElapsed >= step.time && timeElapsed < step.time + step.duration) {
                return step;
            }
        }
        return timeElapsed > 0 ? { text: 'החליטה הושלמה! תהנו ☕', time: 999 } : selectedMethod.steps[0];
    };

    const toggleTimer = () => setTimerActive(!timerActive);
    const resetTimer = () => {
        setTimerActive(false);
        setTimeElapsed(0);
    };

    const currentStep = getCurrentStep();

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="pt-32 pb-12 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Configuration Panel */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center space-x-2 space-x-reverse px-4 py-2 bg-[#2D1B14]/5 text-[#2D1B14] rounded-full">
                            <Scale className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase tracking-widest">מחשבון בריסטה</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14] leading-tight">
                            המתכון ל<span className="text-[#C37D46]">כוס המושלמת</span>
                        </h1>
                        <p className="text-stone-500 text-lg">
                            בחרו את השיטה, הזינו את כמות הקפה, ואנחנו נדאג לכל השאר.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {BREW_METHODS.map(method => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    setSelectedMethod(method);
                                    setRatio(method.defaultRatio);
                                    resetTimer();
                                }}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center text-sm ${selectedMethod.id === method.id
                                    ? 'border-[#2D1B14] bg-[#2D1B14] text-white shadow-xl'
                                    : 'border-stone-200 bg-white text-stone-600 hover:border-[#C37D46]'
                                    }`}
                            >
                                <span className="text-2xl">{method.icon}</span>
                                <span className="font-bold">{method.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100 space-y-8">
                        {/* Coffee Input */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="font-bold text-[#2D1B14] flex items-center gap-2">
                                    <Coffee className="w-5 h-5" />
                                    כמות קפה (גרם)
                                </label>
                                <span className="font-mono font-bold text-xl text-[#C37D46]">{coffeeGrams}g</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="60"
                                step="1"
                                value={coffeeGrams}
                                onChange={(e) => setCoffeeGrams(parseInt(e.target.value))}
                                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#2D1B14]"
                            />
                        </div>

                        {/* Ratio Input */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="font-bold text-[#2D1B14] flex items-center gap-2">
                                    <Droplets className="w-5 h-5" />
                                    יחס מים (Ratio)
                                </label>
                                <span className="font-mono font-bold text-xl text-[#C37D46]">1:{ratio}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="20"
                                step="1"
                                value={ratio}
                                onChange={(e) => setRatio(parseInt(e.target.value))}
                                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#2D1B14]"
                            />
                            <div className="flex justify-between text-xs text-stone-400 font-bold px-1">
                                <span>חזק (1:10)</span>
                                <span>מאוזן (1:16)</span>
                                <span>עדין (1:20)</span>
                            </div>
                        </div>

                        {/* Result Display */}
                        <div className="bg-[#2D1B14] text-white p-6 rounded-2xl flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-white/50 text-xs font-bold uppercase tracking-wider">סה"כ מים נדרשים</span>
                                <span className="text-4xl font-mono font-bold">{waterGrams}ml</span>
                            </div>
                            <div className="h-10 w-px bg-white/20" />
                            <div className="flex flex-col text-right">
                                <span className="text-white/50 text-xs font-bold uppercase tracking-wider">זמן משוער</span>
                                <span className="text-4xl font-mono font-bold">
                                    {formatTime(selectedMethod.steps.reduce((acc, s) => acc + s.duration, 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Guide Panel */}
                <div className="relative">
                    <div className="sticky top-32 bg-white rounded-[2.5rem] shadow-2xl p-8 border border-stone-100 h-fit min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-stone-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#FDFCF0] rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                    {selectedMethod.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-[#2D1B14]">{selectedMethod.name}</h2>
                                    <p className="text-stone-500 text-sm max-w-[200px]">{selectedMethod.desc}</p>
                                </div>
                            </div>
                        </div>

                        {/* Active Step Display */}
                        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 py-4">
                            <div className="relative">
                                <div className="w-64 h-64 rounded-full border-8 border-stone-50 flex items-center justify-center relative">
                                    {timerActive && (
                                        <svg className="absolute inset-0 w-full h-full -rotate-90 text-[#C37D46]" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="46" fill="transparent" strokeDasharray="289.02652413026095" strokeDashoffset={289.026 - (289.026 * (timeElapsed % 60)) / 60} strokeWidth="4" stroke="currentColor" strokeLinecap="round" className="transition-all duration-1000 linear" />
                                        </svg>
                                    )}
                                    <span className="text-7xl font-mono font-bold text-[#2D1B14] tracking-tighter">
                                        {formatTime(timeElapsed)}
                                    </span>
                                </div>
                            </div>

                            <motion.div
                                key={currentStep.text}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2 max-w-md"
                            >
                                <span className="text-[#C37D46] font-bold text-sm uppercase tracking-widest">
                                    {timeElapsed > 0 ? "צעד נוכחי" : "מוכנים?"}
                                </span>
                                <h3 className="text-3xl font-bold text-[#2D1B14] leading-tight">
                                    {currentStep.text}
                                </h3>
                            </motion.div>
                        </div>

                        {/* Controls */}
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={toggleTimer}
                                className={`flex-1 py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 transition-all ${timerActive
                                    ? 'bg-stone-100 text-[#2D1B14] hover:bg-stone-200'
                                    : 'bg-[#2D1B14] text-white hover:bg-[#000] shadow-xl hover:scale-105'
                                    }`}
                            >
                                {timerActive ? <><Pause className="w-5 h-5" /> השהה</> : <><Play className="w-5 h-5" /> התחל טיימר</>}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="w-16 bg-stone-50 text-stone-400 rounded-xl flex items-center justify-center hover:bg-stone-100 hover:text-[#2D1B14] transition-all"
                            >
                                <RotateCcw className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
