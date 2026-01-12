'use client';

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { Coffee, ArrowLeft, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/lib/store';
import Link from 'next/link';

const QUESTIONS = [
    {
        id: 'vibe',
        text: 'מה ה-Vibe שלך כרגע?',
        options: [
            { id: 'energy', text: 'צריך אנרגיה עכשיו! ⚡', value: 'strong' },
            { id: 'chill', text: 'רוגע ושלווה 🧘', value: 'mild' },
            { id: 'treat', text: 'בא לי פינוק מתוק 🍰', value: 'sweet' },
        ]
    },
    {
        id: 'temperature',
        text: 'חם או קר?',
        options: [
            { id: 'hot', text: 'חם ומנחם ☕', value: 'hot' },
            { id: 'cold', text: 'קר ומרענן 🧊', value: 'cold' },
        ]
    },
    {
        id: 'flavor',
        text: 'איזה טעמים מדברים אליך?',
        options: [
            { id: 'classic', text: 'קלאסי ועמוק (קפה נטו)', value: 'classic' },
            { id: 'fun', text: 'הרפתקני ומיוחד (פרחים/תבלינים)', value: 'adventurous' },
            { id: 'creamy', text: 'חלבי וקטיפתי', value: 'creamy' },
        ]
    }
];

export default function MatchClient() {
    const { addItem } = useCart();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);

    const handleAnswer = (value: string) => {
        const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: value };
        setAnswers(newAnswers);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: Record<string, string>) => {
        // Simple logic engine
        let matchedProductId = '1'; // Default: Espresso

        if (finalAnswers.vibe === 'energy') matchedProductId = '1'; // Espresso
        if (finalAnswers.vibe === 'treat') {
            matchedProductId = Math.random() > 0.5 ? '15' : '14'; // Cloud Foam or Lavender
        }

        if (finalAnswers.temperature === 'cold') {
            matchedProductId = '4'; // Cold Brew
            if (finalAnswers.vibe === 'treat') matchedProductId = '15'; // Cloud Foam
        } else {
            // Hot
            if (finalAnswers.flavor === 'creamy') matchedProductId = '13'; // Cortado
            if (finalAnswers.flavor === 'adventurous') matchedProductId = '14'; // Lavender
        }

        // Specific override
        if (finalAnswers.vibe === 'chill' && finalAnswers.temperature === 'hot') matchedProductId = '13';

        const product = PRODUCTS.find(p => p.id === matchedProductId) || PRODUCTS[0];
        setResult(product);
    };

    const reset = () => {
        setCurrentStep(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans flex flex-col" dir="rtl">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#CAB3A3]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D1B14]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-stone-100 relative z-10 min-h-[500px] flex flex-col justify-center">

                    {!result ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-10 text-center"
                            >
                                <div className="space-y-4">
                                    <span className="text-xs font-black uppercase text-[#C37D46] tracking-[0.2em]">שאלה {currentStep + 1} מתוך {QUESTIONS.length}</span>
                                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2D1B14]">{QUESTIONS[currentStep].text}</h2>
                                </div>

                                <div className="grid gap-4">
                                    {QUESTIONS[currentStep].options.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleAnswer(opt.value)}
                                            className="group relative overflow-hidden bg-stone-50 hover:bg-[#2D1B14] text-[#2D1B14] hover:text-white p-6 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-[#2D1B14] shadow-sm hover:shadow-xl text-right"
                                        >
                                            <span className="text-xl font-bold relative z-10">{opt.text}</span>
                                        </button>
                                    ))}
                                </div>

                                {currentStep > 0 && (
                                    <button
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="text-stone-400 hover:text-[#2D1B14] text-sm font-bold flex items-center gap-2 mx-auto mt-8"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        חזרה
                                    </button>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 bg-[#FDFCF0] px-4 py-2 rounded-full border border-stone-200 shadow-sm">
                                <Sparkles className="w-4 h-4 text-[#C37D46]" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#2D1B14]">ההתאמה המושלמת שלך</span>
                            </div>

                            <div className="relative w-48 h-48 mx-auto">
                                <div className="absolute inset-0 bg-[#C37D46] rounded-full blur-2xl opacity-20 animate-pulse" />
                                <img
                                    src={result.image}
                                    alt={result.name}
                                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white relative z-10"
                                />
                            </div>

                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D1B14] mb-4">{result.name}</h2>
                                <p className="text-stone-500 text-lg max-w-md mx-auto leading-relaxed">{result.description}</p>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        addItem(result);
                                        // Optional: Toast or navigate
                                    }}
                                    className="bg-[#2D1B14] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a0f0a] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>הוסף לסל - ₪{result.price.toFixed(2)}</span>
                                </button>
                                <button
                                    onClick={reset}
                                    className="px-8 py-4 rounded-xl font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all"
                                >
                                    נסה שוב
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </main>
    );
}
