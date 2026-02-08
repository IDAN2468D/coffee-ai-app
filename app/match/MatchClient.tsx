'use client';

import React, { useState } from 'react';
import Navbar from "@/components/AppNavbar";
import { Coffee, ArrowLeft, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/lib/store';
import Link from 'next/link';

const QUESTIONS = [
    {
        id: 'dessert',
        text: 'איזה קינוח היית בוחר עכשיו?',
        description: 'הבחירה שלך תגלה לנו על העדפות המתיקות והחמיצות שלך',
        options: [
            { id: 'chocolate', text: 'מוס שוקולד עשיר', value: 'bitter_sweet', image: '/quiz/chocolate.png' },
            { id: 'lemon', text: 'טארט לימון מרענן', value: 'sour_fruity', image: '/quiz/lemon.png' },
        ]
    },
    {
        id: 'style',
        text: 'איך הקפה שלך נראה?',
        description: 'נקי ומדויק או מפנק וחלבי?',
        options: [
            { id: 'black', text: 'שחור, נקי ואלגנטי', value: 'pure', image: '/quiz/black.png' },
            { id: 'latte', text: 'חלבי עם הרבה קצף', value: 'milky', image: '/quiz/latte.png' },
        ]
    },
    {
        id: 'vibe',
        text: 'מה ה-Vibe שמתאים לך?',
        description: 'אנרגיה של עיר או שקט של טבע?',
        options: [
            { id: 'energy', text: 'אנרגיה אורבנית ⚡', value: 'adventurous', image: '/quiz/energy.png' },
            { id: 'relax', text: 'רוגע ושלווה 🧘', value: 'relaxed', image: '/quiz/relax.png' },
        ]
    },
    {
        id: 'notes',
        text: 'איזה צבעים טעימים לך?',
        description: 'פירותיות רעננה או אגוזיות עמוקה?',
        options: [
            { id: 'fruity', text: 'פירותי ופרחוני', value: 'fruity', image: '/quiz/fruity.png' },
            { id: 'nutty', text: 'אגוזי ושוקולדי', value: 'nutty', image: '/quiz/nutty.png' },
        ]
    }
];

interface FlavorProfile {
    [key: string]: number;
}

interface MatchResult {
    product: typeof PRODUCTS[0];
    explanation: string;
    flavorProfile?: FlavorProfile;
}

export default function MatchClient() {
    const { addItem } = useCart();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [freeText, setFreeText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<MatchResult | null>(null);

    const handleAnswer = (value: string) => {
        const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: value };
        setAnswers(newAnswers);

        // Add a small delay for smoother transition
        setTimeout(() => {
            setCurrentStep(currentStep + 1);
        }, 300);
    };

    const calculateResult = async () => {
        setIsAnalyzing(true);
        // Simulate AI analysis delay for effect
        await new Promise(resolve => setTimeout(resolve, 2000));

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
            // Fallback
            setResult({
                product: PRODUCTS[0],
                explanation: "הבחירות שלך מצביעות על טעם ייחודי, ואנחנו בטוחים שתאהב את זה!",
                flavorProfile: {
                    fruity: 70,
                    nutty: 30,
                    body: 60,
                    acidity: 80
                }
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
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CAB3A3]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2D1B14]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] shadow-2xl border border-stone-100 relative z-10 min-h-[600px] flex flex-col justify-center">

                    {!result ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full"
                            >
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center space-y-8 py-10">
                                        <div className="relative w-32 h-32">
                                            <div className="absolute inset-0 bg-[#C37D46] rounded-full blur-xl opacity-20 animate-ping" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Coffee className="w-16 h-16 text-[#2D1B14] animate-bounce" />
                                            </div>
                                            <svg className="animate-spin w-full h-full text-[#C37D46]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                        <div className="space-y-3 text-center">
                                            <h3 className="text-3xl font-serif font-bold text-[#2D1B14]">מנתח את הטעמים שלך...</h3>
                                            <p className="text-stone-500 text-lg">ה-AI שלנו מחבר את כל הנקודות פרופיל הטעם הייחודי שלך</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-3xl mx-auto text-center">
                                        {currentStep < QUESTIONS.length ? (
                                            <>
                                                <div className="space-y-4 mb-10">
                                                    <div className="flex items-center justify-center gap-2 mb-4">
                                                        {QUESTIONS.map((_, idx) => (
                                                            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-[#C37D46]' : 'w-2 bg-stone-200'}`} />
                                                        ))}
                                                    </div>
                                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14]">{QUESTIONS[currentStep].text}</h2>
                                                    <p className="text-lg text-stone-500">{QUESTIONS[currentStep].description}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                    {QUESTIONS[currentStep].options.map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => handleAnswer(opt.value)}
                                                            className="group relative h-64 md:h-80 w-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-right"
                                                        >
                                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-10" />
                                                            <img
                                                                src={opt.image}
                                                                alt={opt.text}
                                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
                                                                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{opt.text}</h3>
                                                                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-500 ease-out" />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            /* Free Text Step */
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="space-y-4">
                                                    <span className="text-sm font-black uppercase text-[#C37D46] tracking-[0.2em]">לסיום</span>
                                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14]">יש העדפות מיוחדות?</h2>
                                                    <p className="text-stone-500 text-lg">רגישויות, שיטות חליטה מועדפות, או סתם משהו שחשוב שנדע</p>
                                                </div>

                                                <textarea
                                                    value={freeText}
                                                    onChange={(e) => setFreeText(e.target.value)}
                                                    placeholder="למשל: אני מכין במקינטה, אוהב גוף מלא, פחות חמיצות..."
                                                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-3xl p-6 text-xl min-h-[180px] focus:border-[#C37D46] focus:ring-0 transition-all outline-none resize-none shadow-inner"
                                                />

                                                <button
                                                    onClick={() => calculateResult()}
                                                    className="w-full bg-[#2D1B14] text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                                    <Sparkles className="w-6 h-6" />
                                                    <span>הצג את התוצאות שלי</span>
                                                </button>
                                            </div>
                                        )}

                                        {currentStep > 0 && (
                                            <button
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="text-stone-400 hover:text-[#2D1B14] text-sm font-bold flex items-center gap-2 mx-auto mt-12 transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                חזרה לשאלה הקודמת
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl overflow-hidden"
                        >
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8 order-2 md:order-1">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 bg-[#FDFCF0] px-4 py-2 rounded-full border border-[#C37D46]/20 shadow-sm">
                                            <Sparkles className="w-4 h-4 text-[#C37D46]" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-[#2D1B14]">Match אישי : 94%</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14] leading-tight">
                                            הבחירה המושלמת: <br />
                                            <span className="text-[#C37D46]">{result.product.name}</span>
                                        </h2>
                                    </div>

                                    {/* Flavor Graph */}
                                    <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">פרופיל הטעם שלך</h4>
                                        <div className="space-y-4">
                                            {result.flavorProfile && Object.entries(result.flavorProfile).map(([key, value]) => (
                                                <div key={key} className="flex items-center gap-4">
                                                    <div className="w-20 text-sm font-bold text-[#2D1B14] capitalize">{key}</div>
                                                    <div className="flex-grow h-3 bg-stone-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#C37D46] rounded-full"
                                                            style={{ width: `${value}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs font-bold text-stone-400 w-8">{value}%</div>
                                                </div>
                                            ))}
                                            {!result.flavorProfile && (
                                                <div className="text-stone-400 text-sm italic">גרף טעמים לא זמין כרגע</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Explanation Bubble */}
                                    <div className="bg-[#2D1B14] p-6 rounded-2xl relative text-white/90">
                                        <div className="absolute -top-2 right-8 w-4 h-4 bg-[#2D1B14] rotate-45" />
                                        <p className="text-lg font-medium leading-relaxed italic">
                                            "{result.explanation}"
                                        </p>
                                    </div>

                                    {/* Discount Offer */}
                                    <div className="bg-[#FFE5D9] border-2 border-[#C37D46] border-dashed p-4 rounded-xl flex items-center gap-4 justify-between animate-pulse">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#C37D46] text-white font-bold px-3 py-1 rounded text-sm">-15%</div>
                                            <div className="font-bold text-[#2D1B14]">מתנת היכרות ללקוחות חדשים!</div>
                                        </div>
                                        <div className="text-xs font-mono text-[#C37D46]">קוד: MYMATCH15</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={() => {
                                                addItem(result.product);
                                                // Could add toast here
                                            }}
                                            className="flex-1 bg-[#2D1B14] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a0f0a] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                                        >
                                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>להזמנה חכמה</span>
                                        </button>
                                        <button
                                            onClick={reset}
                                            className="px-6 py-4 rounded-xl font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all"
                                        >
                                            התחל מחדש
                                        </button>
                                    </div>
                                </div>

                                <div className="order-1 md:order-2 flex justify-center py-8 md:py-0 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF0] to-transparent w-full h-1/2 bottom-0 z-0 pointer-events-none md:hidden" />
                                    <div className="relative w-64 h-64 md:w-96 md:h-96">
                                        <div className="absolute inset-0 bg-[#C37D46] rounded-full blur-3xl opacity-20 animate-pulse" />
                                        <img
                                            src={result.product.image}
                                            alt={result.product.name}
                                            className="w-full h-full object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
