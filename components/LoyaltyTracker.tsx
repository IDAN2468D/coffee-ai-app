'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Coffee, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import type { LoyaltyStatus } from '@/lib/loyalty';
import { GOLD_ORDER_THRESHOLD, PLATINUM_ORDER_THRESHOLD } from '@/lib/loyalty';
import { TIER_BENEFITS } from '@/lib/tiers';

interface LoyaltyTrackerProps {
    status: LoyaltyStatus;
}

export default function LoyaltyTracker({ status }: LoyaltyTrackerProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [animatedOrderProgress, setAnimatedOrderProgress] = useState(0);

    const nextThreshold = status.nextTier === 'GOLD' ? GOLD_ORDER_THRESHOLD : PLATINUM_ORDER_THRESHOLD;
    const orderProgress = Math.min((status.orderCount / nextThreshold) * 100, 100);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedOrderProgress(orderProgress);
        }, 300);
        return () => clearTimeout(timer);
    }, [orderProgress]);

    useEffect(() => {
        if (status.justUpgraded) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [status.justUpgraded]);

    if (status.tier === 'PLATINUM') {
        return (
            <div className="relative overflow-hidden" dir="rtl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-bl from-purple-900 via-indigo-900 to-purple-900 p-8 rounded-[2.5rem] border border-purple-500/30 shadow-2xl relative overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent"
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Crown className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-wide">VIP PLATINUM</h3>
                                <p className="text-xs text-purple-200/70 font-bold uppercase tracking-widest">חבר פרימיום בדרגה הגבוהה ביותר</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-purple-300/60 font-black uppercase tracking-widest mb-1">הזמנות</p>
                                <p className="text-2xl font-black text-white">{status.orderCount}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-purple-300/60 font-black uppercase tracking-widest mb-1">סה״כ קניות</p>
                                <p className="text-2xl font-black text-white">₪{status.totalSpent.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <AnimatePresence>{showConfetti && <ConfettiEffect />}</AnimatePresence>
            </div>
        );
    }

    return (
        <div dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-[#C37D46]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#2D1B14]">הדרך ל-{status.nextTier || 'PLATINUM'}</h3>
                            <p className="text-xs text-stone-400 font-bold">דרגת {status.tier}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-[#C37D46]" />
                            <span className="text-sm font-bold text-[#2D1B14]">הזמנות</span>
                        </div>
                        <span className="text-sm font-black text-[#C37D46]">
                            {status.orderCount}/{nextThreshold}
                        </span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-l from-amber-400 to-[#C37D46] rounded-full relative"
                            initial={{ width: '0%' }}
                            animate={{ width: `${animatedOrderProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
                        </motion.div>
                        {Array.from({ length: nextThreshold }).map((_, i) => (
                            <div
                                key={i}
                                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-colors ${status.orderCount > i
                                    ? 'bg-[#C37D46] border-[#C37D46]'
                                    : 'bg-white border-stone-300'
                                    }`}
                                style={{ right: `${(i / (nextThreshold - 1)) * 100}%` }}
                            />
                        ))}
                    </div>
                    {status.ordersToNextTier > 0 && (
                        <p className="text-xs text-stone-400 mt-2 font-medium">
                            עוד {status.ordersToNextTier} הזמנות לדרגת {status.nextTier}
                        </p>
                    )}
                </div>

                <div className="mt-6 p-4 bg-[#FFF8E7] rounded-2xl border border-[#FFD700]/15">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#B8860B]" />
                        <span className="text-xs font-black text-[#B8860B] uppercase tracking-wider">הטבות {status.tier}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#8B7355] font-medium">
                        <span>✦ הנחת Happy Hour: {TIER_BENEFITS[status.tier].happyHourDiscount * 100}%</span>
                        <span>✦ הנחת VIP: {TIER_BENEFITS[status.tier].vipDiscount * 100}%</span>
                        {TIER_BENEFITS[status.tier].freeShipping && <span>✦ משלוח חינם</span>}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ConfettiEffect() {
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: ['#A855F7', '#6366F1', '#D8B4FE', '#818CF8'][Math.floor(Math.random() * 4)],
        size: 4 + Math.random() * 8,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: '-2%',
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                    }}
                    initial={{ y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                        y: '110vh',
                        opacity: [1, 1, 0],
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: 'easeIn',
                    }}
                />
            ))}
        </div>
    );
}
