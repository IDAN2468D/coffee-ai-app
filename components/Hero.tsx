'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Sun, CloudRain, Snowflake } from 'lucide-react';
import Link from 'next/link';
import CoffeeAnimation from './CoffeeAnimation';
import type { ContextData } from '@/src/types';

interface SmartHeroProps {
    context?: ContextData | null;
}

const gradientMap = {
    Morning: 'from-[#2D1B14] via-[#4A2C1D]/80 to-[#C37D46]/30',
    Afternoon: 'from-[#2D1B14] via-[#5C3A24]/70 to-[#D4943D]/20',
    Evening: 'from-[#1A0E0A] via-[#2D1B14]/90 to-[#1E1145]/40',
};

const bgOverlayMap = {
    Morning: 'bg-gradient-to-r from-[#2D1B14] via-[#2D1B14]/60 to-amber-900/10',
    Afternoon: 'bg-gradient-to-r from-[#2D1B14] via-[#3A2112]/50 to-orange-800/10',
    Evening: 'bg-gradient-to-r from-[#1A0E0A] via-[#2D1B14]/70 to-indigo-950/30',
};

const WeatherIcon = ({ weather }: { weather: string }) => {
    switch (weather) {
        case 'Rainy':
            return <CloudRain className="w-5 h-5 text-blue-300" />;
        case 'Cold':
            return <Snowflake className="w-5 h-5 text-cyan-200" />;
        default:
            return <Sun className="w-5 h-5 text-yellow-300" />;
    }
};

export default function Hero({ context }: SmartHeroProps) {
    const timeOfDay = context?.timeOfDay || 'Morning';
    const gradient = gradientMap[timeOfDay];
    const overlay = bgOverlayMap[timeOfDay];

    return (
        <section className={`relative h-screen min-h-[700px] w-full flex items-center overflow-hidden bg-gradient-to-br ${gradient}`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/premium_hero_bg.png"
                    alt="Premium Coffee Shop Ambience"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className={`absolute inset-0 ${overlay}`} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 text-right"
                    >
                        {/* Context Badge */}
                        {context && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full"
                            >
                                <WeatherIcon weather={context.weather} />
                                <span className="text-white/80 text-sm font-bold">
                                    {context.weather === 'Sunny' ? 'שמשי' : context.weather === 'Rainy' ? 'גשום' : 'קריר'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <Coffee className="w-4 h-4 text-[#C37D46]" />
                                <span className="text-[#C37D46] text-sm font-bold">
                                    {timeOfDay === 'Morning' ? 'בוקר' : timeOfDay === 'Afternoon' ? 'צהריים' : 'ערב'}
                                </span>
                            </motion.div>
                        )}

                        {/* Dynamic Greeting */}
                        {context?.greeting ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xl md:text-2xl text-[#C37D46] font-bold"
                            >
                                {context.greeting}
                            </motion.p>
                        ) : null}

                        <h1 className="text-5xl md:text-7xl font-serif text-white font-bold leading-tight">
                            חלוט <span className="text-[#C37D46]">לשלמות</span>,<br />
                            נלגם בתשוקה.
                        </h1>

                        <p className="text-lg text-white/80 font-light leading-relaxed max-w-lg ml-auto">
                            {context?.recommendedProduct
                                ? `אנחנו ממליצים היום על ${context.recommendedProduct}. מושלם ל${timeOfDay === 'Morning' ? 'בוקר' : timeOfDay === 'Afternoon' ? 'אחר הצהריים' : 'ערב'} שלכם.`
                                : 'אנו מלקטים את פולי הקפה המשובחים בעולם, קלויים לשלמות כדי להביא לכם את חווית הקפה האולטימטיבית.'}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4 justify-start">
                            <Link
                                href="/shop"
                                className="bg-[#C37D46] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#A66330] transition-all shadow-lg hover:shadow-[#C37D46]/20 border-2 border-transparent hover:scale-105 flex items-center gap-2"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                הזמן עכשיו
                            </Link>
                            <Link
                                href="/dashboard"
                                className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                האזור האישי
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:flex justify-end relative items-center justify-center p-12"
                    >
                        <div className="relative w-[500px] h-[500px]">
                            <CoffeeAnimation />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decor elements */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#2D1B14] to-transparent z-20" />
        </section>
    );
}
