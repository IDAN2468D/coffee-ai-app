'use client';

import React, { useState } from 'react';
import Navbar from "@/components/TempNavbar";
import { Check, Sparkles, Coffee, Package, Star, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
    {
        id: 'silver',
        name: 'Cyber Silver',
        price: 49,
        description: 'הכניסה המושלמת לעולם הקפה החכם',
        features: [
            '2 שקיות קפה (250 גרם) בחודש',
            'פרופיל טעם מותאם אישית ע"י AI',
            'משלוח חינם בכל הארץ',
            'צבירת נקודות כפולה ברכישות',
        ],
        icon: Coffee,
        popular: false,
        color: 'bg-stone-100',
        textColor: 'text-stone-800',
        buttonColor: 'bg-[#2D1B14] text-white hover:bg-black'
    },
    {
        id: 'gold',
        name: 'Cyber Gold',
        price: 99,
        description: 'לחובבי קפה שרוצים את הטוב ביותר',
        features: [
            '4 שקיות קפה פרימיום בחודש',
            'גישה מוקדמת למהדורות נדירות',
            'בונוס חודשי: אביזר קפה או מאפה',
            'צבירת נקודות משולשת (x3)',
            'ייעוץ V.I.P עם הבריסטה AI',
        ],
        icon: Star,
        popular: true,
        color: 'bg-[#C37D46]',
        textColor: 'text-white',
        buttonColor: 'bg-white text-[#C37D46] hover:bg-stone-100 shadow-xl'
    },
    {
        id: 'platinum',
        name: 'Cyber Platinum',
        price: 199,
        description: 'החוויה האולטימטיבית ללא פשרות',
        features: [
            '6 שקיות קפה Reserve (נדיר ביותר)',
            'סדנאות לאטה-ארט דיגיטליות',
            'מרצ׳נדייז בלעדי כל רבעון',
            'כרטיס חבר מתכת יוקרתי',
            'משלוח אקספרס (באותו יום)',
            'זמינות 24/7 לבוט הבריסטה',
        ],
        icon: Crown,
        popular: false,
        color: 'bg-[#2D1B14]',
        textColor: 'text-[#C37D46]',
        buttonColor: 'bg-[#C37D46] text-white hover:bg-[#A66330] shadow-xl shadow-amber-900/40'
    }
];

export default function SubscriptionClient() {
    const [loading, setLoading] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleJoin = async (tierId: string) => {
        setLoading(tierId);
        try {
            const response = await fetch('/api/subscription/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: tierId.toUpperCase() === 'SILVER' ? 'BASIC' : 'PRO' })
            });

            if (response.ok) {
                setSuccess(tierId);
                setTimeout(() => setSuccess(null), 5000);
            } else {
                alert("נראה שיש בעיה. אולי כדאי לנסות שוב?");
            }
        } catch (error) {
            console.error(error);
            alert("שגיאת תקשורת. בדקו את החיבור לאינטרנט.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="pt-40 pb-20 px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#2D1B14] text-white px-6 py-2 rounded-full mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-[#C37D46]" />
                        <span className="text-sm font-bold uppercase tracking-widest">מועדון המנויים החכם</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-[#2D1B14]"
                    >
                        קפה שמותאם בדיוק לך, כל חודש מחדש.
                    </motion.h1>
                    <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">
                        האלגוריתם שלנו לומד את הטעם שלך ושולח לך בכל חודש את הפולים שהכי תאהב. ללא התחייבות, בטל בכל עת.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {PLANS.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-xl border border-stone-100 ${plan.color} ${plan.textColor} ${plan.popular ? 'scale-105 shadow-2xl z-10' : 'hover:scale-105 transition-transform'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2D1B14] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                    הבחירה הפופולרית
                                </div>
                            )}

                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${plan.id === 'pro' ? 'bg-white/20 text-white' : 'bg-white text-[#2D1B14]'}`}>
                                <plan.icon className="w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-serif font-bold mb-2">{plan.name}</h3>
                            <p className="text-sm opacity-80 mb-8 h-10">{plan.description}</p>

                            <div className="text-5xl font-black mb-8 flex items-start justify-center">
                                <span className="text-2xl mt-1">₪</span>
                                <span>{plan.price}</span>
                                <span className="text-base font-normal self-end mb-1 opacity-60">/חודש</span>
                            </div>

                            <ul className="space-y-4 mb-10 w-full text-right pr-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <div className={`p-1 rounded-full ${plan.id === 'pro' ? 'bg-white/20' : 'bg-[#C37D46]/20'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleJoin(plan.id)}
                                disabled={loading !== null}
                                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg text-lg flex items-center justify-center gap-2 ${plan.buttonColor}`}
                            >
                                {loading === plan.id ? (
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : success === plan.id ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>הצטרפת בהצלחה!</span>
                                    </>
                                ) : (
                                    <span>הצטרף למועדון</span>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
