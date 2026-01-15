'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Copy, Trophy } from 'lucide-react';

const PRIZES = [
    { id: 1, text: '10% הנחה', color: '#2D1B14', textColor: '#fff', code: 'COFFEE10', type: 'coupon' },
    { id: 2, text: 'משלוח חינם', color: '#C37D46', textColor: '#fff', code: 'FREESHIP', type: 'coupon' },
    { id: 3, text: 'טיפ בריסטה', color: '#F5F1E8', textColor: '#2D1B14', msg: 'תמיד לחמם את הכוס לפני המזיגה!', type: 'info' },
    { id: 4, text: 'הפתעה במתנה', color: '#2D1B14', textColor: '#fff', code: 'SURPRISE', type: 'coupon' },
    { id: 5, text: 'נסה מחר', color: '#e5e5e5', textColor: '#666', type: 'none' },
    { id: 6, text: '5% הנחה', color: '#C37D46', textColor: '#fff', code: 'COFFEE5', type: 'coupon' },
];

export default function WheelOfFortune() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [prize, setPrize] = useState<typeof PRIZES[0] | null>(null);
    const [hasSpun, setHasSpun] = useState(false);

    useEffect(() => {
        // Check if user has already spun in the last 24 hours
        const lastSpin = localStorage.getItem('lastSpinTime');
        const now = new Date().getTime();

        if (!lastSpin || now - parseInt(lastSpin) > 24 * 60 * 60 * 1000) {
            // Wait a bit before showing to not be annoying immediately
            const timer = setTimeout(() => setIsOpen(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSpin = () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);
        const spins = 5; // Number of full rotations
        const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
        const segmentAngle = 360 / PRIZES.length;

        // Calculate stopping angle
        // We want the pointer (top) to point to the selected prize.
        // If 0 deg is at top, and we rotate clockwise.
        const stopAngle = 360 - (randomPrizeIndex * segmentAngle);

        // Add random jitter within the segment
        const jitter = Math.random() * (segmentAngle - 2) + 1;

        const totalRotation = 360 * spins + stopAngle + jitter;

        setRotation(totalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setHasSpun(true);
            setPrize(PRIZES[randomPrizeIndex]);
            localStorage.setItem('lastSpinTime', new Date().getTime().toString());

        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="relative bg-[#FDFCF0] rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden border-4 border-white"
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 left-4 z-10 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-500" />
                    </button>

                    <div className="p-8 text-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-serif font-black text-[#2D1B14]">גלגל המזל היומי</h2>
                            <p className="text-stone-500">סובב את הגלגל וזכה בפרסים שווים!</p>
                        </div>

                        {!prize ? (
                            <div className="relative py-4">
                                {/* Pointer */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 z-20">
                                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[30px] border-t-[#2D1B14] border-r-[15px] border-r-transparent filter drop-shadow-lg" />
                                </div>

                                {/* Wheel */}
                                <motion.div
                                    className="w-64 h-64 rounded-full border-8 border-[#2D1B14] shadow-xl mx-auto relative overflow-hidden bg-white"
                                    animate={{ rotate: rotation }}
                                    transition={{ duration: 3, ease: "circOut" }}
                                >
                                    {PRIZES.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="absolute w-1/2 h-1/2 top-0 right-1/2 origin-bottom-right flex items-center justify-center"
                                            style={{
                                                transform: `rotate(${i * (360 / PRIZES.length)}deg) skewY(-${90 - (360 / PRIZES.length)}deg)`,
                                                backgroundColor: p.color
                                            }}
                                        >
                                            <span
                                                className="absolute bottom-8 left-8 w-32 text-center text-xs font-bold whitespace-nowrap"
                                                style={{
                                                    color: p.textColor,
                                                    transform: `skewY(${90 - (360 / PRIZES.length)}deg) rotate(15deg)` // Approximate adjustment
                                                }}
                                            >
                                                {p.text}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>

                                <button
                                    onClick={handleSpin}
                                    disabled={isSpinning}
                                    className="mt-8 bg-[#C37D46] text-white px-10 py-3 rounded-xl font-black text-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {isSpinning ? 'מסתובב...' : 'סובב עכשיו! 🎲'}
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 py-4"
                            >
                                <div className="w-24 h-24 bg-[#2D1B14] rounded-full mx-auto flex items-center justify-center shadow-inner">
                                    {prize.type === 'coupon' ? <Gift className="w-10 h-10 text-[#C37D46]" /> :
                                        prize.type === 'info' ? <Sparkles className="w-10 h-10 text-[#C37D46]" /> :
                                            <Trophy className="w-10 h-10 text-stone-400" />}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-[#2D1B14] mb-2">{prize.text}</h3>
                                    {prize.code && (
                                        <div className="bg-stone-100 border border-stone-200 p-4 rounded-xl flex items-center justify-between group cursor-pointer"
                                            onClick={() => { navigator.clipboard.writeText(prize.code); alert('הקוד הועתק!'); }}>
                                            <span className="font-mono text-xl font-bold tracking-widest text-[#C37D46]">{prize.code}</span>
                                            <Copy className="w-5 h-5 text-stone-400 group-hover:text-[#2D1B14]" />
                                        </div>
                                    )}
                                    {prize.msg && <p className="text-stone-600 italic">"{prize.msg}"</p>}
                                    {prize.type === 'none' && <p className="text-stone-500">לא נורא, תמיד יש את מחר!</p>}
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-[#2D1B14] text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
                                >
                                    תודה!
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
