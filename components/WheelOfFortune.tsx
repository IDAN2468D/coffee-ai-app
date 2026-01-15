'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Copy, Trophy, Coffee, Star, ArrowDown } from 'lucide-react';

const PRIZES = [
    { id: 1, text: '10% הנחה', color: '#2D1B14', textColor: '#FDFCF0', code: 'COFFEE10', type: 'coupon', icon: '☕' },
    { id: 2, text: 'משלוח חינם', color: '#C37D46', textColor: '#fff', code: 'FREESHIP', type: 'coupon', icon: '🚚' },
    { id: 3, text: 'טיפ בריסטה', color: '#FDFCF0', textColor: '#2D1B14', msg: 'תמיד לחמם את הכוס לפני המזיגה!', type: 'info', icon: '💡' },
    { id: 4, text: 'הפתעה', color: '#2D1B14', textColor: '#fff', code: 'SURPRISE', type: 'coupon', icon: '🎁' },
    { id: 5, text: 'נסה מחר', color: '#5C4033', textColor: '#FDFCF0', type: 'none', icon: '😢' },
    { id: 6, text: '5% הנחה', color: '#C37D46', textColor: '#fff', code: 'COFFEE5', type: 'coupon', icon: '🏷️' },
];

export default function WheelOfFortune() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prize, setPrize] = useState<typeof PRIZES[0] | null>(null);
    const [hasSpun, setHasSpun] = useState(false);
    const wheelRef = useRef<HTMLDivElement>(null);

    // Sound effects (using stable reliable URLs or silent fallback)
    const spinSound = typeof Audio !== "undefined" ? new Audio('https://actions.google.com/sounds/v1/tools/ratchet_wrench_fast.ogg') : null;
    const winSound = typeof Audio !== "undefined" ? new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg') : null;

    useEffect(() => {
        // Check if user has already spun in the last 24 hours
        const lastSpin = localStorage.getItem('lastSpinTime');
        const now = new Date().getTime();

        if (!lastSpin || now - parseInt(lastSpin) > 24 * 60 * 60 * 1000) {
            // Wait a bit before showing 
            const timer = setTimeout(() => setIsOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSpin = () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        if (spinSound) {
            spinSound.volume = 0.3;
            spinSound.currentTime = 0;
            spinSound.play().catch(() => { });
        }

        const spins = 8; // Number of full rotations
        const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
        const segmentAngle = 360 / PRIZES.length;

        // Calculate stopping angle
        const stopAngle = 360 * spins + (360 - (randomPrizeIndex * segmentAngle)) + (segmentAngle / 2);

        // Add random jitter
        const jitter = (Math.random() - 0.5) * (segmentAngle * 0.8);
        const finalRotation = stopAngle + jitter;

        setRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setHasSpun(true);
            setPrize(PRIZES[randomPrizeIndex]);
            localStorage.setItem('lastSpinTime', new Date().getTime().toString());

            if (PRIZES[randomPrizeIndex].type !== 'none') {
                if (winSound) {
                    winSound.volume = 0.5;
                    winSound.play().catch(() => { });
                }
            }
        }, 5000); // 5 seconds spin duration matches CSS transition
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" dir="rtl">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 50 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative bg-[#FDFCF0] rounded-[3rem] shadow-2xl max-w-lg w-full overflow-visible border-4 border-[#C37D46]/30 font-sans"
                >
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -right-12 text-[#C37D46]/20 rotate-12 pointer-events-none">
                        <Star size={120} fill="currentColor" />
                    </div>
                    <div className="absolute -bottom-8 -left-8 text-[#2D1B14]/5 -rotate-12 pointer-events-none">
                        <Coffee size={150} />
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-stone-100 transition-all border border-stone-100 group"
                    >
                        <X className="w-5 h-5 text-stone-400 group-hover:text-[#2D1B14]" />
                    </button>

                    <div className="p-8 md:p-12 text-center space-y-8 relative z-0">
                        {/* Header */}
                        <div className="space-y-3">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C37D46]/10 text-[#C37D46] text-xs font-bold uppercase tracking-widest">
                                מתנה יומית
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-[#2D1B14] leading-tight">
                                <span className="block text-[#C37D46] text-2xl mb-1 font-sans font-bold">סובב וזכה</span>
                                גלגל המזל
                            </h2>
                        </div>

                        {!prize ? (
                            <div className="relative py-8 flex flex-col items-center">
                                {/* Pointer Container */}
                                <div className="absolute top-0 z-20 transform translate-y-4 filter drop-shadow-xl h-12 w-full flex justify-center pointer-events-none">
                                    <div className="relative">
                                        <div className="w-10 h-12 bg-[#2D1B14]" style={{ clipPath: 'polygon(100% 0, 0 0, 50% 100%)' }}></div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#C37D46] rounded-full"></div>
                                    </div>
                                </div>

                                {/* Wheel Container */}
                                <div className="p-3 rounded-full bg-gradient-to-b from-[#C37D46] to-[#8B4513] shadow-2xl">
                                    <div className="p-2 rounded-full bg-[#2D1B14] shadow-inner">

                                        {/* Rotating Wheel */}
                                        <motion.div
                                            ref={wheelRef}
                                            className="w-80 h-80 md:w-96 md:h-96 rounded-full relative overflow-hidden bg-[#2D1B14]"
                                            animate={{ rotate: rotation }}
                                            transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
                                        >
                                            {/* Center Cap */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full z-10 shadow-xl border-4 border-[#C37D46] flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-[#2D1B14] flex items-center justify-center">
                                                    <Star className="w-8 h-8 text-[#C37D46]" fill="currentColor" />
                                                </div>
                                            </div>

                                            {PRIZES.map((p, i) => (
                                                <div
                                                    key={p.id}
                                                    className="absolute w-1/2 h-1/2 top-0 right-1/2 origin-bottom-right"
                                                    style={{
                                                        transform: `rotate(${i * (360 / PRIZES.length)}deg) skewY(-${90 - (360 / PRIZES.length)}deg)`,
                                                        background: p.color,
                                                        borderRight: '2px solid rgba(255,255,255,0.1)',
                                                        borderTop: '2px solid rgba(255,255,255,0.1)',
                                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <div
                                                        className="absolute bottom-16 left-8 text-center w-40 flex flex-col items-center justify-center gap-2"
                                                        style={{
                                                            transform: `skewY(${90 - (360 / PRIZES.length)}deg) rotate(${360 / PRIZES.length / 2}deg) translate(20px, 0px)`,
                                                        }}
                                                    >
                                                        <span className="text-2xl filter drop-shadow-md transform -rotate-90">{p.icon}</span>
                                                        <span
                                                            className="text-sm font-black uppercase tracking-wider whitespace-nowrap px-1 transform -rotate-90 origin-center"
                                                            style={{
                                                                color: p.textColor,
                                                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                                            }}
                                                        >
                                                            {p.text}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSpin}
                                    disabled={isSpinning}
                                    className="mt-12 relative group overflow-hidden bg-[#2D1B14] text-white px-16 py-5 rounded-full font-black text-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isSpinning ? (
                                            <>
                                                <Sparkles className="w-6 h-6 animate-spin" />
                                                ...מתגלגל
                                            </>
                                        ) : (
                                            <>
                                                סובב
                                                <Sparkles className="w-6 h-6 text-[#C37D46]" />
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#C37D46] to-[#b36b32] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8 py-8"
                            >
                                <motion.div
                                    initial={{ rotate: -10, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-40 h-40 bg-gradient-to-br from-[#C37D46] to-[#2D1B14] rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl relative overflow-hidden"
                                >
                                    {/* CSS-only noise pattern */}
                                    <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                                    />
                                    {prize.type === 'coupon' ? <Gift className="w-20 h-20 text-white" /> :
                                        prize.type === 'info' ? <Sparkles className="w-20 h-20 text-white" /> :
                                            <Trophy className="w-20 h-20 text-white/50" />}

                                    <div className="absolute -top-4 -right-4 bg-[#FFD700] text-[#2D1B14] text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-white transform rotate-12">
                                        זכית!
                                    </div>
                                </motion.div>

                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-[#2D1B14] leading-tight">
                                        {prize.type === 'none' ? 'לא נורא, פעם הבאה!' : `ברכות! זכית ב-`}
                                        <span className="block text-[#C37D46] mt-2 text-4xl">{prize.text}</span>
                                    </h3>

                                    {prize.code && (
                                        <div
                                            className="mx-auto max-w-sm bg-white border-2 border-dashed border-[#C37D46]/30 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-[#C37D46] transition-colors relative overflow-hidden shadow-sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(prize.code!);
                                                // Could add a toast here
                                            }}
                                        >
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">קוד קופון</span>
                                                <span className="font-mono text-3xl font-black text-[#2D1B14]">{prize.code}</span>
                                            </div>
                                            <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center group-hover:bg-[#C37D46] transition-colors">
                                                <Copy className="w-6 h-6 text-stone-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    )}

                                    {prize.msg && <p className="text-xl text-stone-600 font-serif italic">"{prize.msg}"</p>}
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full max-w-sm bg-[#2D1B14] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#1a100c] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                >
                                    תודה רבה
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
