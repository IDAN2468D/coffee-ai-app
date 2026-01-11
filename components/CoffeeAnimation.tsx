'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function CoffeeAnimation() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* The Cup / Container - Glassmorphism style */}
            <div className="relative w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#1a100c] to-[#0f0806] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_20px_rgba(255,255,255,0.1)] border border-white/5 overflow-hidden flex items-center justify-center ring-[1px] ring-white/10">

                {/* Liquid Surface Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(195,125,70,0.1),_transparent_60%)]" />

                {/* Mesmerizing Ripples (Aroma Waves) */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-[#C37D46]/20 rounded-full"
                        style={{ width: '30%', height: '30%' }}
                        animate={{
                            scale: [1, 2.5],
                            opacity: [0.6, 0],
                            borderWidth: ["2px", "0px"]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "easeOut"
                        }}
                    />
                ))}

                {/* Inner Glow / Soul */}
                <motion.div
                    className="absolute w-20 h-20 bg-[#C37D46] rounded-full blur-[40px] opacity-40 mix-blend-screen"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Spinning Latte Art Abstract */}
                <motion.div
                    className="absolute inset-4 opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full text-[#C37D46]">
                        <defs>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#C37D46" stopOpacity="0" />
                                <stop offset="50%" stopColor="#C37D46" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#8B4513" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Elegant Curves */}
                        <path d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20"
                            fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="4 8" />
                        <path d="M100,40 C130,40 160,70 160,100 C160,130 130,160 100,160 C70,160 40,130 40,100 C40,70 70,40 100,40"
                            fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeDasharray="2 10" opacity="0.6" />
                    </svg>
                </motion.div>

                {/* Floating Particles (Sparkles) */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`p-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            y: -60 - Math.random() * 40,
                            x: (Math.random() - 0.5) * 40,
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeOut"
                        }}
                    />
                ))}

            </div>

            {/* Realistic Steam (Blurred Layers) */}
            <div className="absolute top-[-10%] w-full flex justify-center pointer-events-none mix-blend-screen">
                <motion.div
                    className="w-24 h-48 bg-gradient-to-t from-white/10 to-transparent blur-[30px] rounded-full origin-bottom"
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scaleY: [0.8, 1.1, 0.8],
                        skewX: [-5, 5, -5]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Ambient Back Glow - Behind Container */}
            <div className="absolute -z-10 w-[90%] h-[90%] bg-[#C37D46] rounded-full blur-[100px] opacity-10 animate-pulse" />
        </div>
    );
}
