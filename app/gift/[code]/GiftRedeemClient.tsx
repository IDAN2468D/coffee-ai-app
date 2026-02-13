'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, PartyPopper, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { redeemGiftCard } from '@/app/actions/giftcard';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface GiftRedeemClientProps {
    giftCard: {
        code: string;
        balance: number;
        message?: string;
        isRedeemed: boolean;
        isExpired: boolean;
        senderName?: string;
    };
}

export default function GiftRedeemClient({ giftCard }: GiftRedeemClientProps) {
    const { data: session } = useSession();
    const [isUnwrapped, setIsUnwrapped] = useState(false);
    const [isRedeemed, setIsRedeemed] = useState(giftCard.isRedeemed);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [error, setError] = useState('');

    const handleUnwrap = () => {
        setIsUnwrapped(true);

        // Fire confetti
        const duration = 2000;
        const end = Date.now() + duration;
        const colors = ['#C37D46', '#FFD700', '#2D1B14', '#F59E0B'];

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors,
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const handleRedeem = async () => {
        if (!session) {
            setError('יש להתחבר כדי לממש את הגיפט קארד');
            return;
        }

        setIsRedeeming(true);
        setError('');

        const result = await redeemGiftCard({ code: giftCard.code });

        if (result.success) {
            setIsRedeemed(true);
            // Celebration confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22C55E', '#FFD700', '#C37D46'],
            });
        } else {
            setError(result.error || 'שגיאה במימוש');
        }

        setIsRedeeming(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#FDFCF0] to-[#F5F0E3] flex items-center justify-center p-6" dir="rtl">
            <div className="max-w-lg w-full">
                <AnimatePresence mode="wait">
                    {!isUnwrapped ? (
                        /* ====== Wrapped State — "Unwrap" CTA ====== */
                        <motion.div
                            key="wrapped"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                            transition={{ duration: 0.5 }}
                            className="text-center space-y-8"
                        >
                            {/* Gift Box */}
                            <motion.div
                                animate={{
                                    y: [0, -12, 0],
                                    rotate: [0, -3, 3, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="inline-block"
                            >
                                <div className="relative">
                                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-[#C37D46] to-[#8B4513] rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                                        {/* Ribbon */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-[#FFD700]/30" />
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-[#FFD700]/30" />
                                        {/* Bow */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#FFD700] rounded-full shadow-lg" />
                                        <Gift className="w-16 h-16 text-white/80 relative z-10" />
                                    </div>
                                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-[#FFD700] animate-pulse" />
                                    <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-[#C37D46] animate-pulse delay-500" />
                                </div>
                            </motion.div>

                            <div className="space-y-3">
                                <h1 className="text-4xl font-serif font-bold text-[#2D1B14]">
                                    יש לך מתנה! 🎁
                                </h1>
                                {giftCard.senderName && (
                                    <p className="text-stone-500 text-lg">
                                        מ-<span className="font-bold text-[#2D1B14]">{giftCard.senderName}</span>
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleUnwrap}
                                disabled={giftCard.isExpired}
                                className="bg-gradient-to-r from-[#C37D46] to-[#A05A2C] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-[#C37D46]/30 hover:scale-105 hover:shadow-[#C37D46]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {giftCard.isExpired ? 'פג תוקף 😔' : '🎁 פתח את המתנה'}
                            </button>
                        </motion.div>
                    ) : (
                        /* ====== Unwrapped State — Show Balance + Redeem ====== */
                        <motion.div
                            key="unwrapped"
                            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.6, type: 'spring' }}
                            className="space-y-8"
                        >
                            {/* Card Visual */}
                            <div className="relative bg-gradient-to-br from-[#2D1B14] to-[#1A0E0A] rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                                {/* Decorative */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C37D46]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFD700]/5 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

                                <div className="relative z-10 space-y-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <CreditCard className="w-5 h-5 text-[#C37D46]" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Digital Gift Card</span>
                                    </div>

                                    <div>
                                        <p className="text-6xl font-black text-white mb-2">
                                            ₪{giftCard.balance}
                                        </p>
                                        <p className="text-white/40 text-sm font-bold">יתרה זמינה</p>
                                    </div>

                                    {giftCard.message && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <p className="text-white/70 text-sm italic leading-relaxed">
                                                &ldquo;{giftCard.message}&rdquo;
                                            </p>
                                            {giftCard.senderName && (
                                                <p className="text-[#C37D46] text-xs font-bold mt-2">
                                                    — {giftCard.senderName}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="bg-black/30 rounded-xl px-4 py-2 inline-block">
                                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">קוד: </span>
                                        <span className="text-white font-mono font-bold tracking-wider">{giftCard.code}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isRedeemed ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-xl border border-green-200">
                                        <PartyPopper className="w-5 h-5" />
                                        <span className="font-bold">מומש בהצלחה! הנקודות נוספו לחשבונך</span>
                                    </div>
                                    <div>
                                        <Link
                                            href="/shop"
                                            className="block w-full bg-[#2D1B14] text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform"
                                        >
                                            לקניות עם הנקודות 🛍️
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {error && (
                                        <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100">
                                            {error}
                                        </p>
                                    )}
                                    <button
                                        onClick={handleRedeem}
                                        disabled={isRedeeming || giftCard.isExpired}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isRedeeming ? (
                                            <span className="animate-pulse">מממש...</span>
                                        ) : (
                                            '✨ ממש את הגיפט קארד'
                                        )}
                                    </button>
                                    {!session && (
                                        <p className="text-stone-500 text-xs text-center">
                                            יש להתחבר כדי לממש —{' '}
                                            <Link href="/auth/login" className="text-[#C37D46] font-bold underline">
                                                התחברות
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
