'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Thermometer, Zap, Droplets, Sparkles, ShoppingBag, ArrowRight, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, Product } from '@/lib/products';
import { useCart } from '@/lib/store';

type QuizStep = 'welcome' | 'temp' | 'intensity' | 'milk' | 'result';

interface QuizAnswers {
    temp: 'Hot' | 'Cold' | null;
    intensity: 'Sweet' | 'Strong' | 'Balanced' | null;
    milk: 'Yes' | 'No' | null;
}

export default function CoffeeQuiz() {
    const { addItem } = useCart();
    const [step, setStep] = useState<QuizStep>('welcome');
    const [answers, setAnswers] = useState<QuizAnswers>({
        temp: null,
        intensity: null,
        milk: null
    });

    const resetQuiz = () => {
        setStep('welcome');
        setAnswers({ temp: null, intensity: null, milk: null });
    };

    const handleAnswer = (key: keyof QuizAnswers, value: string) => {
        setAnswers(prev => ({ ...prev, [key]: value }));

        // Progress to next step
        if (key === 'temp') setStep('intensity');
        else if (key === 'intensity') setStep('milk');
        else if (key === 'milk') setStep('result');
    };

    const recommendedProduct = useMemo(() => {
        if (step !== 'result') return null;

        // Scoring logic
        const scoredProducts = PRODUCTS.filter(p => p.category === 'Hot' || p.category === 'Cold').map(product => {
            let score = 0;
            const desc = product.description.toLowerCase();
            const name = product.name.toLowerCase();

            // Temp match
            if (product.category === answers.temp) score += 5;

            // Intensity match
            if (answers.intensity === 'Strong') {
                if (desc.includes('strong') || desc.includes('intense') || desc.includes('bold') || desc.includes('power') || name.includes('espresso')) score += 5;
            } else if (answers.intensity === 'Sweet') {
                if (desc.includes('sweet') || desc.includes('honey') || desc.includes('vanilla') || desc.includes('cream')) score += 5;
            } else if (answers.intensity === 'Balanced') {
                if (desc.includes('balanced') || desc.includes('smooth') || desc.includes('pure')) score += 5;
            }

            // Milk match
            if (answers.milk === 'Yes') {
                if (desc.includes('milk') || desc.includes('latte') || desc.includes('foam') || desc.includes('cortado')) score += 5;
            } else {
                if (desc.includes('pure') || desc.includes('espresso') || desc.includes('black') || desc.includes('ristretto')) score += 5;
            }

            return { product, score };
        });

        // Return the highest score
        return scoredProducts.sort((a, b) => b.score - a.score)[0]?.product || PRODUCTS[0];
    }, [step, answers]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[500px] flex items-center justify-center py-10">
            <AnimatePresence mode="wait">
                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-center space-y-8"
                    >
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
                            <Coffee className="w-20 h-20 text-amber-600 mx-auto relative z-10" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 leading-tight">
                                בואו נמצא את <span className="text-amber-600 italic">הקפה המושלם</span> עבורכם
                            </h2>
                            <p className="text-stone-500 text-lg max-w-md mx-auto font-medium">
                                ענו על 3 שאלות קצרות וה-AI שלנו יתאים לכם את המשקה האידיאלי מהתפריט שלנו.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep('temp')}
                            className="group flex items-center gap-3 px-10 py-5 bg-[#2D1B14] text-white rounded-full font-black text-xl hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            <span>בואו נתחיל</span>
                            <ArrowRight className="w-6 h-6 rotate-180 group-hover:translate-x-[-4px] transition-transform" />
                        </button>
                    </motion.div>
                )}

                {step === 'temp' && (
                    <motion.div key="temp" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-10">
                        <div className="text-center">
                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full">שאלה 1 מתוך 3</span>
                            <h3 className="text-3xl font-serif font-black text-stone-900 mt-6 md:text-4xl">איך אתם אוהבים את הקפה שלכם?</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: 'Hot', label: 'חם ומנחם', icon: <Thermometer className="w-8 h-8" />, desc: 'קפה קלאסי שמרגיש כמו חיבוק' },
                                { id: 'Cold', label: 'קר ומרענן', icon: <Droplets className="w-8 h-8" />, desc: 'התפרצות של אנרגיה קרירה' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer('temp', opt.id)}
                                    className="group p-8 rounded-[2.5rem] bg-white border-2 border-stone-100 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-right space-y-4 shadow-sm hover:shadow-xl"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#2D1B14] group-hover:text-white transition-all shadow-inner">
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-stone-900">{opt.label}</div>
                                        <div className="text-stone-400 font-medium text-sm mt-1">{opt.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'intensity' && (
                    <motion.div key="intensity" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-10">
                        <div className="text-center">
                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full">שאלה 2 מתוך 3</span>
                            <h3 className="text-3xl font-serif font-black text-stone-900 mt-6 md:text-4xl">מה הטעם שאתם מחפשים היום?</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: 'Sweet', label: 'מתוק ומפנק', icon: <Sparkles className="w-6 h-6" />, desc: 'קינוח בכוס' },
                                { id: 'Strong', label: 'חזק ומעורר', icon: <Zap className="w-6 h-6" />, desc: 'בעיטה של אנרגיה' },
                                { id: 'Balanced', label: 'עדין ומאוזן', icon: <CheckCircle2 className="w-6 h-6" />, desc: 'טעם של מומחים' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer('intensity', opt.id)}
                                    className="group p-8 rounded-[2rem] bg-white border-2 border-stone-100 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-center space-y-4 shadow-sm hover:shadow-xl"
                                >
                                    <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#2D1B14] group-hover:text-white mx-auto transition-all shadow-inner">
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-stone-900">{opt.label}</div>
                                        <div className="text-stone-400 font-medium text-xs mt-1">{opt.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'milk' && (
                    <motion.div key="milk" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full space-y-10">
                        <div className="text-center">
                            <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full">שאלה 3 מתוך 3</span>
                            <h3 className="text-3xl font-serif font-black text-stone-900 mt-6 md:text-4xl">איך אתם עם חלב?</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: 'Yes', label: 'עם חלב (מוקצף)', icon: <div className="text-2xl font-bold">🥛</div>, desc: 'מרקם קרמי ועשיר' },
                                { id: 'No', label: 'בלי חלב (שחור)', icon: <div className="text-2xl font-bold">☕</div>, desc: 'הטעם הטהור של הפולים' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer('milk', opt.id)}
                                    className="group p-8 rounded-[2.5rem] bg-white border-2 border-stone-100 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-right space-y-4 shadow-sm hover:shadow-xl"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#2D1B14] group-hover:text-white transition-all shadow-inner">
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-stone-900">{opt.label}</div>
                                        <div className="text-stone-400 font-medium text-sm mt-1">{opt.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'result' && recommendedProduct && (
                    <motion.div key="result" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(45,27,20,0.1)] border border-stone-100 overflow-hidden lg:flex items-stretch min-h-[500px]">
                            {/* Image Side */}
                            <div className="lg:w-2/5 relative">
                                <img src={recommendedProduct.image} alt={recommendedProduct.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14]/80 to-transparent flex items-end p-8">
                                    <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full font-black text-sm shadow-xl animate-pulse">
                                        <Heart className="w-4 h-4 fill-white" />
                                        <span>98% התאמה!</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="lg:w-3/5 p-10 md:p-14 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="space-y-2 text-right">
                                        <span className="text-xs font-black text-stone-400 uppercase tracking-widest">הבריסטה ממליץ על:</span>
                                        <h2 className="text-4xl md:text-5xl font-serif font-black text-[#2D1B14]">{recommendedProduct.name}</h2>
                                    </div>
                                    <p className="text-stone-500 text-lg leading-relaxed text-right font-medium">
                                        {recommendedProduct.description}
                                    </p>
                                    <div className="flex items-center justify-end gap-2 text-amber-600 font-black text-3xl">
                                        <span className="text-sm">₪</span>
                                        {recommendedProduct.price}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                    <button
                                        onClick={() => {
                                            addItem(recommendedProduct);
                                            // Optional: Add notification or redirect
                                        }}
                                        className="flex-grow flex items-center justify-center gap-3 bg-[#2D1B14] text-white h-16 rounded-2xl font-black text-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>הוסיפו להזמנה</span>
                                    </button>
                                    <button
                                        onClick={resetQuiz}
                                        className="h-16 px-8 rounded-2xl border-2 border-stone-100 text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        <span className="font-black text-sm uppercase">מחדש</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
