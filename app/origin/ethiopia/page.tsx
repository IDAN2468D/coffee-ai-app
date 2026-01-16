'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Sun, Clock, Users, X } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Hotspots
const HOTSPOTS = [
    {
        id: 1,
        x: 30, // Percentage from left
        y: 60, // Percentage from top
        label: "החקלאים שלנו",
        icon: Users,
        title: "משפחת אבבה",
        content: "כבר 3 דורות שמגדלים קפה באזור ירגשף. כל פול נקטף ידנית רק כשהוא בשיא הבשלות (אדום עז)."
    },
    {
        id: 2,
        x: 55,
        y: 40,
        label: "תנאי הגידול",
        icon: Sun,
        title: "גובה 2,000 מטר",
        content: "האוויר הדליל והשמש הישירה יוצרים פולים דחוסים בטעמים. תהליך הייבוש נעשה על מיטות הגבהה בשמש."
    },
    {
        id: 3,
        x: 75,
        y: 70,
        label: "זמן הקלייה",
        icon: Clock,
        title: "נקלה בתל אביב: 15/01/24",
        content: "הפולים הגיעו ירוקים ונקלו בשיטת 'קלייה בהירה' כדי לשמור על החמיצות הפירותית הייחודית."
    }
];

export default function EthiopiaJourney() {
    const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Simple parallax effect on mouse move
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const moveX = (clientX / window.innerWidth - 0.5) * 20; // -10 to 10
        const moveY = (clientY / window.innerHeight - 0.5) * 10; // -5 to 5
        setMousePosition({ x: moveX, y: moveY });
    };

    return (
        <main
            className="h-screen w-screen overflow-hidden relative bg-[#2D1B14] text-white"
            dir="rtl"
            onMouseMove={handleMouseMove}
        >
            <div className="absolute top-4 right-4 z-50">
                <Link href="/" className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all text-white border border-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            {/* Panorama Background Container */}
            <motion.div
                className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%]"
                animate={{
                    x: mousePosition.x * -1,
                    y: mousePosition.y * -1
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
                <img
                    src="/images/ethiopia_pano.png"
                    alt="Ethiopia Coffee Farm Panorama"
                    className="w-full h-full object-cover brightness-[0.8]"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14] via-transparent to-[#2D1B14]/30" />
            </motion.div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full pointer-events-none">
                {/* Header */}
                <div className="absolute top-10 left-0 right-0 text-center pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block bg-black/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 mb-4"
                    >
                        <span className="text-yellow-400 font-bold tracking-widest uppercase text-xs">מסע למקור</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-5xl md:text-7xl font-serif font-black text-white drop-shadow-lg"
                    >
                        אתיופיה ירגשף
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-white/80 mt-2 text-lg font-light"
                    >
                        הזיזו את העכבר/טלפון כדי לחקור את החווה
                    </motion.p>
                </div>

                {/* Hotspots */}
                {HOTSPOTS.map((spot, idx) => (
                    <div
                        key={spot.id}
                        className="absolute pointer-events-auto"
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    >
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 + idx * 0.2 }}
                            onClick={() => setActiveHotspot(spot.id)}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-50" />
                            <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md border border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                                <spot.icon className="w-6 h-6" />
                            </div>

                            {/* Label Tooltip */}
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur text-xs px-3 py-1 rounded-full text-white">
                                {spot.label}
                            </div>
                        </motion.button>
                    </div>
                ))}
            </div>

            {/* Info Modal/Drawer */}
            <AnimatePresence>
                {activeHotspot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setActiveHotspot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/95 backdrop-blur-xl text-[#2D1B14] p-8 rounded-[2rem] max-w-md w-full shadow-2xl relative border border-white/50"
                        >
                            <button
                                onClick={() => setActiveHotspot(null)}
                                className="absolute top-4 left-4 p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {(() => {
                                const spot = HOTSPOTS.find(s => s.id === activeHotspot);
                                if (!spot) return null;
                                const Icon = spot.icon;

                                return (
                                    <div className="text-center space-y-6">
                                        <div className="w-20 h-20 bg-[#2D1B14] rounded-full flex items-center justify-center mx-auto shadow-lg">
                                            <Icon className="w-10 h-10 text-yellow-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-[#C37D46] mb-2">{spot.label}</h4>
                                            <h2 className="text-3xl font-serif font-bold">{spot.title}</h2>
                                        </div>
                                        <p className="text-lg text-stone-600 leading-relaxed">
                                            {spot.content}
                                        </p>
                                        <div className="h-1 w-20 bg-stone-200 mx-auto rounded-full" />
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
