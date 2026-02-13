'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Trophy, Lightbulb } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DailyScratchCard() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isScratched, setIsScratched] = useState(false);
    const [prize, setPrize] = useState<{ text: string, code?: string, type: 'coupon' | 'fact' } | null>(null);
    const [mounted, setMounted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        // Check cooldown (24 hours)
        const lastPlay = localStorage.getItem('lastDailyPlay');
        const now = new Date().getTime();
        const COOLDOWN = 24 * 60 * 60 * 1000; // 24 Hours

        if (!lastPlay || now - parseInt(lastPlay) > COOLDOWN) {
            // Auto open strictly for demo if not played
            setTimeout(() => setIsOpen(true), 2000);
        }
    }, []);


    const fetchPrize = React.useCallback(async () => {
        if (prize) return; // Already fetched

        const userTier = (session?.user as any)?.tier || 'SILVER';
        const rand = Math.random();

        // Adjust odds based on tier
        let factThreshold = 0.7; // 70% fact for Silver
        let smallCouponThreshold = 0.9; // 20% coupon for Silver

        if (userTier === 'GOLD') {
            factThreshold = 0.5; // 50% fact
            smallCouponThreshold = 0.8; // 30% coupon
        } else if (userTier === 'PLATINUM') {
            factThreshold = 0.3; // 30% fact
            smallCouponThreshold = 0.6; // 30% coupon, 40% big prize
        }

        if (rand < factThreshold) {
            // Coffee Fact (AI)
            try {
                const res = await fetch('/api/daily-fact');
                const data = await res.json();
                setPrize({ text: data.fact, type: 'fact' });
            } catch (e) {
                setPrize({ text: "הידעת? קפה הוא פרי!", type: 'fact' });
            }
        } else if (rand < smallCouponThreshold) {
            // Small Coupon
            setPrize({ text: '5% הנחה לקנייה הבאה', code: 'COFFEE5', type: 'coupon' });
        } else {
            // Big Prize
            if (userTier === 'PLATINUM') {
                setPrize({ text: '15% הנחה לקנייה הבאה!', code: 'PLATINUM15', type: 'coupon' });
            } else if (userTier === 'GOLD') {
                setPrize({ text: '10% הנחה לקנייה הבאה!', code: 'GOLD10', type: 'coupon' });
            } else {
                setPrize({ text: 'משלוח חינם!', code: 'FREESHIP', type: 'coupon' });
            }
        }
    }, [prize, session?.user]);

    useEffect(() => {
        if (isOpen) {
            fetchPrize();
        }
    }, [isOpen, fetchPrize]);

    useEffect(() => {
        if (isOpen && canvasRef.current && containerRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;
            canvas.width = width;
            canvas.height = height;

            // Fill with "Gold/Coffee" dust
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#C37D46');
            gradient.addColorStop(0.5, '#E8CBAD');
            gradient.addColorStop(1, '#8B4513');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Add some texture/text top
            ctx.fillStyle = '#2D1B14';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('גרד כאן לגילוי הפרס', width / 2, height / 2);

            let isDrawing = false;

            const getPos = (e: MouseEvent | TouchEvent) => {
                const rect = canvas.getBoundingClientRect();
                let clientX, clientY;
                if ('touches' in e) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = (e as MouseEvent).clientX;
                    clientY = (e as MouseEvent).clientY;
                }
                return {
                    x: clientX - rect.left,
                    y: clientY - rect.top
                };
            };

            const scratch = (x: number, y: number) => {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, 30, 0, Math.PI * 2);
                ctx.fill();
            };

            const start = () => isDrawing = true;
            const end = () => isDrawing = false;
            const move = (e: MouseEvent | TouchEvent) => {
                if (!isDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                scratch(pos.x, pos.y);
            };

            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('touchstart', start);
            canvas.addEventListener('mouseup', end);
            canvas.addEventListener('touchend', end);
            canvas.addEventListener('mousemove', move);
            canvas.addEventListener('touchmove', move);

            return () => {
                canvas.removeEventListener('mousedown', start);
                // clean up
            };
        }
    }, [isOpen]);

    // Better check: on mouse up, check %
    const handleScratchEnd = () => {
        if (!canvasRef.current || isScratched) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 128) transparent++;
        }

        if (transparent > (pixels.length / 4) * 0.4) { // 40% cleared
            setIsScratched(true);
            localStorage.setItem('lastDailyPlay', new Date().getTime().toString());
            // Fade out canvas
            canvas.classList.add('opacity-0', 'pointer-events-none');
        }
    };

    if (!mounted) return null;

    // Hide on auth pages and dashboard
    if (pathname?.startsWith('/auth/') || pathname === '/dashboard') {
        return null;
    }

    return (
        <>
            {/* Floating Trigger - Gift Box */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: !isOpen ? 1 : 0 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-24 md:right-56 z-40 bg-[#C37D46] text-white p-4 rounded-full shadow-xl border-2 border-white flex items-center gap-2 group transform hover:-translate-y-1 transition-transform"
            >
                <div className="relative">
                    <Gift className="w-6 h-6 group-hover:animate-bounce" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full animate-pulse">1</span>
                </div>
                <span className="hidden md:inline font-bold">מתנה יומית</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" dir="rtl">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#FDFCF0] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C37D46] font-sans"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 left-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                            >
                                <X size={20} className="text-[#2D1B14]" />
                            </button>

                            <div className="p-8 text-center space-y-6">
                                <div>
                                    <h2 className="text-3xl font-black text-[#2D1B14] mb-2">כרטיס גירוד יומי</h2>
                                    <p className="text-[#C37D46] font-medium">גרד את הכרטיס וגלה מה זכית!</p>
                                </div>

                                <div
                                    ref={containerRef}
                                    className="relative w-full h-64 bg-white rounded-2xl shadow-inner border-2 border-dashed border-[#C37D46]/30 overflow-hidden flex items-center justify-center select-none"
                                >
                                    {/* Prize Layer (Hidden underneath) */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-3 bg-[#FDFCF0] opacity-100">
                                        {prize?.type === 'fact' ? (
                                            <>
                                                <Lightbulb className="w-16 h-16 text-yellow-500 animate-bounce" />
                                                <h3 className="text-xl font-bold text-[#2D1B14] leading-relaxed">&quot;{prize.text}&quot;</h3>
                                                <p className="text-xs text-stone-400">חזור מחר להפתעה נוספת!</p>
                                            </>
                                        ) : (
                                            <>
                                                <Trophy className="w-16 h-16 text-[#C37D46] animate-bounce" />
                                                <h3 className="text-2xl font-bold text-[#2D1B14]">{prize?.text}</h3>
                                                {prize?.code && (
                                                    <>
                                                        <div className="bg-[#2D1B14] text-white px-6 py-2 rounded-lg font-mono text-xl tracking-widest cursor-pointer hover:bg-[#4a2c20]" onClick={() => navigator.clipboard.writeText(prize.code || '')}>
                                                            {prize.code}
                                                        </div>
                                                        <p className="text-xs text-stone-400">לחץ להעתקת הקוד</p>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Scratch Layer (Canvas) */}
                                    <canvas
                                        ref={canvasRef}
                                        onMouseUp={handleScratchEnd}
                                        onTouchEnd={handleScratchEnd}
                                        className="absolute inset-0 z-10 w-full h-full cursor-crosshair touch-none transition-opacity duration-1000"
                                    />

                                    {isScratched && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 pointer-events-none flex items-center justify-center"
                                        >
                                            <Sparkles className="w-full h-full text-yellow-400 opacity-50 animate-pulse" />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="text-sm text-stone-500">
                                    {isScratched
                                        ? "מזל טוב! הכרטיס תקף ל-24 שעות הקרובות."
                                        : "השתמש באצבע או בעכבר כדי לגרד"
                                    }
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
