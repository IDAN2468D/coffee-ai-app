'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles, Heart, Star } from 'lucide-react';

interface CoffeeLoginAnimationProps {
    isVisible: boolean;
    onComplete: () => void;
}

export default function CoffeeLoginAnimation({ isVisible, onComplete }: CoffeeLoginAnimationProps) {
    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onComplete, 4000); // Extended animation duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-[#2D1B14] via-[#4a2c20] to-[#1a0f0a] overflow-hidden"
                >
                    {/* Animated Background Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                    y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    y: -100,
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    delay: Math.random() * 0.5,
                                    repeat: Infinity,
                                }}
                                className="absolute w-2 h-2 bg-amber-400 rounded-full"
                                style={{
                                    filter: 'blur(1px)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Coffee Bean Explosions */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={`bean-${i}`}
                                initial={{
                                    x: '50vw',
                                    y: '50vh',
                                    opacity: 0,
                                    scale: 0,
                                    rotate: 0,
                                }}
                                animate={{
                                    x: `${50 + (Math.cos((i / 20) * Math.PI * 2) * 40)}vw`,
                                    y: `${50 + (Math.sin((i / 20) * Math.PI * 2) * 40)}vh`,
                                    opacity: [0, 1, 1, 0],
                                    scale: [0, 1.5, 1, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 2,
                                    delay: 1.8 + (i * 0.02),
                                    ease: "easeOut"
                                }}
                                className="absolute"
                            >
                                <Coffee className="w-8 h-8 text-amber-700" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Coffee Animation Container */}
                    <div className="relative z-10 flex flex-col items-center">

                        {/* Welcome Text with Letter Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="mb-12 text-center"
                        >
                            <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-3 flex items-center justify-center gap-2 flex-wrap">
                                {['ב', 'ר', 'ו', 'ך', ' ', 'ה', 'ב', 'א', '!'].map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 50, scale: 0 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        transition={{
                                            delay: 0.3 + i * 0.08,
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 10
                                        }}
                                        style={{
                                            display: 'inline-block',
                                            textShadow: '0 0 20px rgba(255,255,255,0.5)'
                                        }}
                                    >
                                        {letter === ' ' ? '\u00A0' : letter}
                                    </motion.span>
                                ))}
                                <motion.span
                                    initial={{ opacity: 0, rotate: -180, scale: 0 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
                                    className="inline-block"
                                >
                                    ☕
                                </motion.span>
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="text-amber-200 text-xl font-light"
                            >
                                מכין לך קפה טרי...
                            </motion.p>

                            {/* Floating Hearts & Stars */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={`icon-${i}`}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0.5],
                                        x: [(i % 2 === 0 ? -1 : 1) * (50 + i * 10)],
                                        y: [-20 - i * 15],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: 1 + i * 0.15,
                                        ease: "easeOut"
                                    }}
                                    className="absolute top-0 left-1/2"
                                >
                                    {i % 2 === 0 ? (
                                        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                                    ) : (
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Coffee Cup Container */}
                        <div className="relative w-64 h-64">

                            {/* Steam Animation */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full flex justify-center gap-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                        animate={{
                                            opacity: [0, 0.7, 0],
                                            y: -60,
                                            scale: [0.5, 1, 1.5],
                                            x: [0, (i - 1) * 10, (i - 1) * 20],
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.3,
                                            repeat: Infinity,
                                            ease: "easeOut"
                                        }}
                                        className="w-8 h-12 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-sm"
                                    />
                                ))}
                            </div>

                            {/* Coffee Cup */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: 0.3
                                }}
                                className="relative w-full h-full"
                            >
                                {/* Cup Body */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-44 h-52">
                                    {/* Cup Shape */}
                                    <div className="relative w-full h-full bg-gradient-to-b from-white via-stone-50 to-stone-100 rounded-b-[3rem] border-4 border-[#8B4513] shadow-2xl overflow-hidden"
                                        style={{
                                            clipPath: "polygon(15% 0%, 85% 0%, 95% 100%, 5% 100%)"
                                        }}
                                    >
                                        {/* Coffee Liquid Pouring Animation */}
                                        <motion.div
                                            initial={{ height: "0%" }}
                                            animate={{ height: "85%" }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 0.8,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#6F4E37] via-[#8B4513] to-[#3E2723] rounded-b-[2.5rem]"
                                        >
                                            {/* Coffee Surface Shine */}
                                            <motion.div
                                                animate={{
                                                    opacity: [0.3, 0.6, 0.3],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                                className="absolute top-0 left-1/4 right-1/4 h-3 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent rounded-full blur-sm"
                                            />
                                        </motion.div>

                                        {/* Sparkles on Cup */}
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    scale: [0, 1, 0],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: 1 + i * 0.2,
                                                    repeat: Infinity,
                                                }}
                                                className="absolute text-yellow-300"
                                                style={{
                                                    left: `${20 + (i % 3) * 30}%`,
                                                    top: `${10 + Math.floor(i / 3) * 40}%`,
                                                }}
                                            >
                                                <Sparkles size={16} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Cup Handle */}
                                    <div className="absolute right-0 top-12 w-16 h-20 border-4 border-[#8B4513] rounded-r-full"
                                        style={{
                                            borderLeft: "none",
                                        }}
                                    />

                                    {/* Coffee Bean Icon on Cup */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 1.2, type: "spring" }}
                                        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10"
                                    >
                                        <Coffee className="w-12 h-12 text-amber-700/30" strokeWidth={3} />
                                    </motion.div>

                                    {/* Light Sweep Effect */}
                                    <motion.div
                                        initial={{ x: '-100%', opacity: 0 }}
                                        animate={{
                                            x: ['100%', '200%'],
                                            opacity: [0, 0.8, 0]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: 1.5,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 w-1/3"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                            transform: 'skewX(-20deg)'
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Circular Glow Effect */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.2, 0.8],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 rounded-full bg-gradient-radial from-amber-400/20 to-transparent blur-2xl"
                            />

                            {/* Pulsing Rings */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={`ring-${i}`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: [0.8, 2.5, 3],
                                        opacity: [0.6, 0.3, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: 0.5 + i * 0.4,
                                        repeat: Infinity,
                                        repeatDelay: 0.6
                                    }}
                                    className="absolute inset-0 rounded-full border-4 border-amber-400/40"
                                    style={{
                                        filter: 'blur(2px)'
                                    }}
                                />
                            ))}

                            {/* Sparkle Burst */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={`sparkle-${i}`}
                                    initial={{
                                        x: 0,
                                        y: 0,
                                        opacity: 0,
                                        scale: 0,
                                    }}
                                    animate={{
                                        x: Math.cos((i / 12) * Math.PI * 2) * 150,
                                        y: Math.sin((i / 12) * Math.PI * 2) * 150,
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: 1.2 + i * 0.05,
                                        ease: "easeOut"
                                    }}
                                    className="absolute top-1/2 left-1/2"
                                >
                                    <Sparkles className="w-6 h-6 text-yellow-300" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Coffee Drops Animation */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-32">
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 0, opacity: 0 }}
                                    animate={{
                                        y: [0, 120],
                                        opacity: [0, 1, 0.5, 0],
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.8 + i * 0.15,
                                        ease: "easeIn",
                                    }}
                                    className="absolute top-0 left-0 w-2 h-6 bg-gradient-to-b from-[#6F4E37] to-[#3E2723] rounded-full"
                                />
                            ))}
                        </div>

                        {/* Bottom Text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="mt-16 text-amber-100/60 text-sm font-light tracking-widest"
                        >
                            מעביר אותך לחוויה...
                        </motion.div>
                    </div>

                    {/* Enhanced Confetti Effect */}
                    {[...Array(80)].map((_, i) => {
                        const shapes = ['circle', 'square', 'star', 'heart'];
                        const shape = shapes[i % 4];
                        const colors = ['#8B4513', '#C37D46', '#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4'];
                        const color = colors[i % colors.length];

                        return (
                            <motion.div
                                key={`confetti-${i}`}
                                initial={{
                                    x: '50vw',
                                    y: '50vh',
                                    opacity: 0,
                                    scale: 0,
                                }}
                                animate={{
                                    x: `${Math.random() * 100}vw`,
                                    y: `${Math.random() * 100}vh`,
                                    opacity: [0, 1, 1, 0],
                                    scale: [0, 1.2, 1, 0],
                                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1), 720 * (Math.random() > 0.5 ? 1 : -1)],
                                }}
                                transition={{
                                    duration: 2.5,
                                    delay: 2 + Math.random() * 0.8,
                                    ease: "easeOut"
                                }}
                                className="absolute"
                                style={{
                                    width: shape === 'star' || shape === 'heart' ? '16px' : '12px',
                                    height: shape === 'star' || shape === 'heart' ? '16px' : '12px',
                                }}
                            >
                                {shape === 'circle' && (
                                    <div
                                        className="w-full h-full rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                )}
                                {shape === 'square' && (
                                    <div
                                        className="w-full h-full"
                                        style={{ backgroundColor: color, transform: 'rotate(45deg)' }}
                                    />
                                )}
                                {shape === 'star' && (
                                    <Star className="w-full h-full" style={{ color: color, fill: color }} />
                                )}
                                {shape === 'heart' && (
                                    <Heart className="w-full h-full" style={{ color: color, fill: color }} />
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
