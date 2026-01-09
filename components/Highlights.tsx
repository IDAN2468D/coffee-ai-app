'use client';

import React from 'react';
import { Calendar, Heart, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Highlights() {
    const items = [
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "הזמנת מקום",
            desc: "שריינו שולחן להפסקת הקפה המושלמת שלכם.",
            active: false
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "טעם בלתי נשכח",
            desc: "התפריט שלנו נאצר בקפידה עבור החיך המעודן ביותר.",
            active: true
        },
        {
            icon: <Coffee className="w-8 h-8" />,
            title: "קפה משובח",
            desc: "תערובות פרימיום שנקלו לשלמות מדי יום ביומו.",
            active: false
        }
    ];

    return (
        <section className="py-24 bg-stone-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-16" dir="rtl">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14]">שירות מהיר, איכות ללא פשרות</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-12 rounded-[2rem] transition-all hover:translate-y-[-10px] duration-300 ${item.active
                                ? 'bg-[#2D1B14] text-white shadow-2xl scale-105'
                                : 'bg-white text-[#2D1B14] border border-stone-100 shadow-sm'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform ${item.active ? 'bg-white/10 scale-110 rotate-3' : 'bg-[#8B4513]/5 text-[#8B4513]'
                                }`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-[0.2em]">{item.title}</h3>
                            <p className={`text-lg leading-relaxed ${item.active ? 'text-white/70' : 'text-stone-500'}`}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
