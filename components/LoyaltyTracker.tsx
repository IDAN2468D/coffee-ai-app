'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Coffee, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import type { LoyaltyStatus } from '@/lib/loyalty';

const VIP_ORDER_GOAL = 3;
const VIP_SPEND_GOAL = 500;

interface LoyaltyTrackerProps {
    status: LoyaltyStatus;
}

export default function LoyaltyTracker({ status }: LoyaltyTrackerProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [animatedOrderProgress, setAnimatedOrderProgress] = useState(0);
    const [animatedSpendProgress, setAnimatedSpendProgress] = useState(0);

    const orderProgress = Math.min((status.orderCount / VIP_ORDER_GOAL) * 100, 100);
    const spendProgress = Math.min((status.totalSpent / VIP_SPEND_GOAL) * 100, 100);

    // Animate progress on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedOrderProgress(orderProgress);
            setAnimatedSpendProgress(spendProgress);
        }, 300);
        return () => clearTimeout(timer);
    }, [orderProgress, spendProgress]);

    // Confetti on upgrade
    useEffect(() => {
        if (status.justUpgraded) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [status.justUpgraded]);

    if (status.tier === 'PRO') {
        return (
            <div className="relative overflow-hidden" dir="rtl">
                {/* VIP Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-bl from-[#1a1005] via-[#2D1B14] to-[#1a1005] p-8 rounded-[2.5rem] border border-[#C37D46]/30 shadow-2xl relative overflow-hidden"
                >
                    {/* Gold shimmer */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FFD700]/5 to-transparent"
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Glow effects */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-[80px] -mr-12 -mt-12" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C37D46]/15 rounded-full blur-[60px] -ml-8 -mb-8" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
                                <Crown className="w-7 h-7 text-[#1a1005]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#FFD700] tracking-wide">VIP PRO</h3>
                                <p className="text-xs text-[#C37D46]/70 font-bold uppercase tracking-widest">חבר פרימיום לצמיתות</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-[#C37D46]/60 font-black uppercase tracking-widest mb-1">הזמנות</p>
                                <p className="text-2xl font-black text-white">{status.orderCount}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[10px] text-[#C37D46]/60 font-black uppercase tracking-widest mb-1">סה״כ קניות</p>
                                <p className="text-2xl font-black text-white">₪{status.totalSpent.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Confetti */}
                <AnimatePresence>
                    {showConfetti && <ConfettiEffect />}
                </AnimatePresence>
            </div>
        );
    }

    // STANDARD tier — show progress
    return (
        <div dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-[#C37D46]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#2D1B14]">הדרך ל-VIP</h3>
                            <p className="text-xs text-stone-400 font-bold">Coffee Lover</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#FFD700]/10 px-3 py-1.5 rounded-full border border-[#FFD700]/20">
                        <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span className="text-[10px] font-black text-[#B8860B] uppercase tracking-wider">PRO</span>
                    </div>
                </div>

                {/* Orders Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-[#C37D46]" />
                            <span className="text-sm font-bold text-[#2D1B14]">הזמנות</span>
                        </div>
                        <span className="text-sm font-black text-[#C37D46]">
                            {status.orderCount}/{VIP_ORDER_GOAL}
                        </span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-l from-[#FFD700] to-[#C37D46] rounded-full relative"
                            initial={{ width: '0%' }}
                            animate={{ width: `${animatedOrderProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
                        </motion.div>
                        {/* Milestone dots */}
                        {[1, 2, 3].map((milestone) => (
                            <div
                                key={milestone}
                                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-colors ${status.orderCount >= milestone
                                        ? 'bg-[#FFD700] border-[#FFD700]'
                                        : 'bg-white border-stone-300'
                                    }`}
                                style={{ right: `${((milestone - 1) / VIP_ORDER_GOAL) * 100 + (100 / VIP_ORDER_GOAL / 2)}%` }}
                            />
                        ))}
                    </div>
                    {status.ordersToVip > 0 && (
                        <p className="text-xs text-stone-400 mt-2 font-medium">
                            עוד {status.ordersToVip} הזמנות ל-VIP PRO
                        </p>
                    )}
                </div>

                {/* Spend Progress */}
                <div className="mb-2">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#C37D46]" />
                            <span className="text-sm font-bold text-[#2D1B14]">סה״כ קניות</span>
                        </div>
                        <span className="text-sm font-black text-[#C37D46]">
                            ₪{status.totalSpent.toFixed(0)}/₪{VIP_SPEND_GOAL}
                        </span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-l from-[#FFD700] to-[#C37D46] rounded-full relative"
                            initial={{ width: '0%' }}
                            animate={{ width: `${animatedSpendProgress}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent" />
                        </motion.div>
                    </div>
                    {status.spendToVip > 0 && (
                        <p className="text-xs text-stone-400 mt-2 font-medium">
                            עוד ₪{status.spendToVip.toFixed(0)} ל-VIP PRO
                        </p>
                    )}
                </div>

                {/* VIP Benefit teaser */}
                <div className="mt-6 p-4 bg-[#FFF8E7] rounded-2xl border border-[#FFD700]/15">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#B8860B]" />
                        <span className="text-xs font-black text-[#B8860B] uppercase tracking-wider">הטבות VIP PRO</span>
                    </div>
                    <div className="flex gap-4 text-xs text-[#8B7355] font-medium">
                        <span>✦ משלוח חינם</span>
                        <span>✦ גישה מוקדמת</span>
                        <span>✦ הנחות בלעדיות</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Confetti particles
function ConfettiEffect() {
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: ['#FFD700', '#C37D46', '#B8860B', '#FF6B35', '#E8CBAD'][Math.floor(Math.random() * 5)],
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
