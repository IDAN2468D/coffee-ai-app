'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';

export default function HappyHourBanner() {
    const [isActive, setIsActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        function checkAndUpdateTimer() {
            const now = new Date();
            // Israel timezone
            const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
            const hour = israelTime.getHours();
            const minutes = israelTime.getMinutes();
            const seconds = israelTime.getSeconds();

            const active = hour >= 14 && hour < 17;
            setIsActive(active);

            if (active) {
                // Calculate remaining time until 17:00
                const remainingHours = 16 - hour;
                const remainingMinutes = 59 - minutes;
                const remainingSeconds = 59 - seconds;
                setTimeRemaining(
                    `${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
                );
            }
        }

        checkAndUpdateTimer();
        const interval = setInterval(checkAndUpdateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted || !isActive) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="relative overflow-hidden"
            >
                <div className="bg-gradient-to-l from-amber-500 via-orange-500 to-red-500 py-4 px-6">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                        {/* Floating emojis */}
                        {['⚡', '🔥', '☕', '🥐'].map((emoji, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.5,
                                    repeat: Infinity,
                                }}
                                className="absolute text-2xl"
                                style={{
                                    left: `${15 + i * 22}%`,
                                    top: '20%',
                                }}
                            >
                                {emoji}
                            </motion.span>
                        ))}
                    </div>

                    <div className="max-w-7xl mx-auto flex items-center justify-between flex-row-reverse relative z-10" dir="rtl">
                        {/* Left side: Text */}
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl border border-white/30 shadow-lg"
                            >
                                <Zap className="w-6 h-6 text-yellow-200 fill-yellow-200" />
                            </motion.div>
                            <div>
                                <h3 className="text-white font-black text-lg md:text-xl tracking-tight">
                                    ⚡ שעת הפי אוור!
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm font-bold">
                                    הנחה של 15% על כל המאפים
                                </p>
                            </div>
                        </div>

                        {/* Right side: Countdown */}
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-white/60" />
                            <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-[9px] text-white/50 font-black uppercase tracking-widest block text-center">
                                    נגמר בעוד
                                </span>
                                <span className="text-white font-mono font-black text-xl md:text-2xl tracking-[0.15em]">
                                    {timeRemaining}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
