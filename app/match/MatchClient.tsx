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
    const [freeText, setFreeText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnswer = (value: string) => {
        const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: value };
        setAnswers(newAnswers);
        setCurrentStep(currentStep + 1);
    };

    const calculateResult = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/sommelier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers, freeText })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error fetching AI recommendation:', error);
            // Fallback (optional)
            setResult({
                product: PRODUCTS[0],
                explanation: "הייתה בעיה קטנה, אבל האספרסו הזה תמיד מומלץ!"
            });
        } finally {
            setIsAnalyzing(false);
        }
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
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center space-y-6 py-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#C37D46] rounded-full blur-xl opacity-20 animate-ping" />
                                            <Coffee className="w-16 h-16 text-[#2D1B14] animate-bounce" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-serif font-bold text-[#2D1B14]">הבריסטה החכם חושב...</h3>
                                            <p className="text-stone-500">מחפש את ההתאמה המושלמת לטעמים שלך</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {currentStep < QUESTIONS.length ? (
                                            <>
                                                <div className="space-y-4">
                                                    <span className="text-xs font-black uppercase text-[#C37D46] tracking-[0.2em]">שאלה {currentStep + 1} מתוך {QUESTIONS.length + 1}</span>
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
                                            </>
                                        ) : (
                                            /* Free Text Step */
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <span className="text-xs font-black uppercase text-[#C37D46] tracking-[0.2em]">צעד אחרון</span>
                                                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2D1B14]">משהו נוסף?</h2>
                                                    <p className="text-stone-500 text-lg">ספר לנו עוד קצת על מה שמתחשק לך (אופציונלי)</p>
                                                </div>

                                                <textarea
                                                    value={freeText}
                                                    onChange={(e) => setFreeText(e.target.value)}
                                                    placeholder="בא לי משהו שמזכיר שוקולד ממש, או אולי משהו שיתאים לעוגה שאני אוכל..."
                                                    className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 text-xl min-h-[150px] focus:border-[#2D1B14] focus:ring-0 transition-all outline-none resize-none"
                                                />

                                                <button
                                                    onClick={() => calculateResult()}
                                                    className="w-full bg-[#2D1B14] text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                                >
                                                    <Sparkles className="w-5 h-5" />
                                                    <span>מצא את הקפה שלי</span>
                                                </button>
                                            </div>
                                        )}

                                        {currentStep > 0 && (
                                            <button
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="text-stone-400 hover:text-[#2D1B14] text-sm font-bold flex items-center gap-2 mx-auto mt-8"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                חזרה
                                            </button>
                                        )}
                                    </>
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
                                    src={result.product.image}
                                    alt={result.product.name}
                                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white relative z-10"
                                />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D1B14]">{result.product.name}</h2>

                                {/* AI Explanation Bubble */}
                                <div className="bg-[#2D1B14]/5 p-6 rounded-2xl relative mt-6 mx-auto max-w-lg">
                                    <div className="absolute -top-3 right-8 w-6 h-6 bg-[#F5F1E8] rotate-45 border-t border-l border-[#2D1B14]/10" />
                                    <p className="text-[#2D1B14] text-lg font-medium leading-relaxed italic">
                                        "{result.explanation}"
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        addItem(result.product);
                                        // Optional: Toast or navigate
                                    }}
                                    className="bg-[#2D1B14] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a0f0a] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>הוסף לסל - ₪{result.product.price.toFixed(2)}</span>
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
