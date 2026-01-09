'use client';

import React from 'react';
import { Calendar, Heart, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Highlights() {
    const items = [
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Book a Table",
            desc: "Reserve your spot for the perfect afternoon break.",
            active: false
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Delicious",
            desc: "Our menu is curated for the most discerning palates.",
            active: true
        },
        {
            icon: <Coffee className="w-8 h-8" />,
            title: "Coffee",
            desc: "Premium blends roasted to perfection every single day.",
            active: false
        }
    ];

    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-bold text-[#2D1B14]">Quick Service, Quality Every Time</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-12 rounded-2xl transition-all ${item.active
                                    ? 'bg-[#8B4513] text-white shadow-2xl scale-105'
                                    : 'bg-white text-[#2D1B14] border border-stone-200'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${item.active ? 'bg-white/20' : 'bg-[#8B4513]/10 text-[#8B4513]'
                                }`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">{item.title}</h3>
                            <p className={`text-sm leading-relaxed ${item.active ? 'text-white/70' : 'text-stone-500'}`}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
