'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';
import type { ReengagementData } from '@/app/actions/user';

const DISMISS_KEY = 'reengagement-dismissed';

interface ReengagementBannerProps {
    data: ReengagementData;
}

export default function ReengagementBanner({ data }: ReengagementBannerProps) {
    const [dismissed, setDismissed] = useState(true); // start hidden to avoid CLS

    useEffect(() => {
        // Only show if not previously dismissed
        const wasDismissed = localStorage.getItem(DISMISS_KEY);
        if (!wasDismissed && data.shouldShow) {
            setDismissed(false);
        }
    }, [data.shouldShow]);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem(DISMISS_KEY, 'true');
    };

    if (dismissed || !data.shouldShow) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                dir="rtl"
                className="relative mx-4 mt-4 mb-2 md:mx-8 rounded-2xl overflow-hidden shadow-lg"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-l from-amber-800 via-amber-900 to-stone-900" />

                {/* Animated shimmer */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-600/10 to-transparent"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5">
                    {/* Right side: Icon + Text */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Coffee icon with glow */}
                        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-amber-700/40 border border-amber-500/30 flex-shrink-0">
                            <Coffee className="w-6 h-6 text-amber-300" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                <h3 className="text-amber-100 font-bold text-sm md:text-base truncate">
                                    חסר לנו אותך! ☕
                                </h3>
                            </div>
                            <p className="text-amber-200/80 text-xs md:text-sm leading-relaxed">
                                {data.productName ? (
                                    <>
                                        ה-<span className="text-amber-300 font-semibold">{data.productName}</span> שלך עדיין מחכה.{' '}
                                    </>
                                ) : (
                                    <>הקפה שלך עדיין מחכה. </>
                                )}
                                השתמש בקוד{' '}
                                <span className="inline-flex items-center gap-1 bg-amber-700/50 text-amber-200 font-mono font-bold px-2 py-0.5 rounded-md text-xs border border-amber-600/30">
                                    <Gift className="w-3 h-3" />
                                    COFFEE10
                                </span>
                                {' '}ל-10% הנחה!
                            </p>
                        </div>
                    </div>

                    {/* Left side: CTA + Dismiss */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link
                            href="/shop"
                            className="hidden sm:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs md:text-sm px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-md"
                        >
                            <Sparkles className="w-4 h-4" />
                            לחנות
                        </Link>

                        <button
                            onClick={handleDismiss}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-amber-800/50 transition-colors"
                            aria-label="סגור באנר"
                        >
                            <X className="w-4 h-4 text-amber-400/70 hover:text-amber-300" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
