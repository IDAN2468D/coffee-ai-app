'use client';

import React, { useState } from 'react';
import { Coffee, Sparkles, Wand2, Download, Share2, Loader2, ArrowRight, Heart, Mail, RefreshCw, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import CoffeeQuiz from '@/components/CoffeeQuiz';

const SUGGESTIONS = [
    "לאטה בסגנון גלקסיה עם ערפילית סגולה וכחולה",
    "ספל אספרסו מהביל על פסגת הר מושלג בזריחה",
    "מאצ'ה ירוק ניאון בסגנון סייברפאנק בכוס הולוגרפית",
    "מאג אבן עתיק של קפה שחור מוקף בכתב סתרים מיסטי",
    "קפוצ'ינו סתווי נעים עם עלה מייפל קטן מקינמון",
    "כוס קפה קלד-ברו עם קוביות קרח שנראות כמו יהלומים",
    "קפה בסגנון שיקוי קסמים במאג זוהר",
    "ספל לבן מינימליסטי על דלפק שיש עם לאטה ארט מושלם"
];

export default function AIBaristaPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'art' | 'matcher'>('matcher');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [numImages, setNumImages] = useState(3);
    const [size, setSize] = useState('M');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setResults([]);

        try {
            const promises = [];
            for (let i = 0; i < numImages; i++) {
                promises.push(
                    fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: `${prompt} (${size} size cup)`, variant: i })
                    }).then(r => r.json())
                );
            }

            const responses = await Promise.all(promises);
            setResults(responses.map(data => data.url));
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMagic = () => {
        const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
        setPrompt(random);
    };

    const handleAISuggestion = async () => {
        if (!prompt.trim()) return;
        setLoadingAI(true);
        try {
            const res = await fetch('/api/ai-enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            setAiSuggestion(data.suggestion);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSendToEmail = async (imageUrl: string) => {
        if (!session?.user?.email) {
            alert('אנא התחבר כדי לשלוח למייל');
            return;
        }

        try {
            await fetch('/api/send-image-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl, prompt, email: session.user.email })
            });
            alert('התמונה נשלחה למייל שלך! 📧');
        } catch (error) {
            console.error(error);
            alert('שגיאה בשליחה');
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#FDFCF0] via-[#F5F1E8] to-[#FDFCF0]" dir="rtl">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#6B3410] text-white rounded-full shadow-lg">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-black uppercase tracking-widest text-sm">AI Powered Barista 2.0</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2D1B14] leading-tight">
                        הבריסטה <span className="text-[#8B4513]">החכם</span> שלכם
                    </h1>
                    <p className="text-stone-500 text-xl max-w-3xl mx-auto font-medium">
                        בחרו בין יצירת אמנות קפה לבין התאמת המשקה המושלם עבורכם
                    </p>
                </div>

                {/* Tabs Selector */}
                <div className="flex justify-center">
                    <div className="flex p-2 bg-stone-100/50 backdrop-blur-md rounded-[2rem] border border-stone-200">
                        <button
                            onClick={() => setActiveTab('matcher')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'matcher' ? 'bg-[#2D1B14] text-white shadow-xl' : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            <Target className="w-5 h-5" />
                            <span>התאמת קפה</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('art')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'art' ? 'bg-[#2D1B14] text-white shadow-xl' : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            <Wand2 className="w-5 h-5" />
                            <span>יצירת אמנות</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'matcher' ? (
                        <motion.div
                            key="matcher"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <CoffeeQuiz />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="art"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Control Panel */}
                            <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 space-y-10 border border-stone-100">
                                <div className="space-y-8">
                                    <div className="relative group">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="תארו את חלום הקפה שלכם... (לדוגמה: לאטה זהוב בכוס קריסטל מרחפת)"
                                            className="w-full bg-stone-50/50 border-2 border-stone-100 rounded-[2.5rem] p-8 text-xl focus:border-[#8B4513]/30 focus:bg-white focus:ring-0 transition-all outline-none min-h-[200px] resize-none font-medium"
                                        />
                                        <button
                                            onClick={handleMagic}
                                            className="absolute left-8 bottom-8 p-4 bg-[#2D1B14] text-white rounded-2xl hover:bg-[#8B4513] hover:scale-110 transition-all shadow-xl flex items-center space-x-2 space-x-reverse group-hover:shadow-[#8B4513]/20"
                                            title="הצעה קסומה"
                                        >
                                            <Wand2 className="w-5 h-5" />
                                            <span className="text-sm font-bold">קסם</span>
                                        </button>
                                    </div>

                                    {/* AI Enhancement */}
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        <button
                                            onClick={handleAISuggestion}
                                            disabled={loadingAI || !prompt.trim()}
                                            className="flex-1 bg-[#8B4513]/5 text-[#8B4513] border-2 border-[#8B4513]/10 py-5 rounded-2xl font-black flex items-center justify-center space-x-3 space-x-reverse hover:bg-[#8B4513]/10 transition-all disabled:opacity-50 text-sm tracking-widest uppercase"
                                        >
                                            {loadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                            <span>שפרו את התיאור עם AI</span>
                                        </button>

                                        <div className="flex items-center space-x-6 space-x-reverse bg-stone-50 px-8 py-5 rounded-2xl border border-stone-100">
                                            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">מספר תמונות:</span>
                                            <div className="flex items-center space-x-3 space-x-reverse">
                                                {[1, 2, 3, 4].map(num => (
                                                    <button
                                                        key={num}
                                                        onClick={() => setNumImages(num)}
                                                        className={`w-10 h-10 rounded-xl font-black transition-all text-sm ${numImages === num
                                                            ? 'bg-[#2D1B14] text-white shadow-lg scale-110'
                                                            : 'bg-white text-stone-400 hover:bg-stone-100'
                                                            }`}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6 space-x-reverse bg-stone-50 px-8 py-5 rounded-2xl border border-stone-100">
                                            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">גודל:</span>
                                            <div className="flex items-center space-x-3 space-x-reverse">
                                                {['S', 'M', 'L'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setSize(s)}
                                                        className={`w-10 h-10 rounded-xl font-black transition-all text-sm ${size === s
                                                            ? 'bg-[#2D1B14] text-white shadow-lg scale-110'
                                                            : 'bg-white text-stone-400 hover:bg-stone-100'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {aiSuggestion && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-[#8B4513]/5 border border-[#8B4513]/10 rounded-[2rem] p-8 space-y-4"
                                        >
                                            <div className="flex items-center space-x-2 space-x-reverse text-[#8B4513]">
                                                <Sparkles className="w-5 h-5" />
                                                <span className="font-black text-xs uppercase tracking-widest">הצעת השדרוג של הבריסטה:</span>
                                            </div>
                                            <p className="text-stone-700 text-lg italic leading-relaxed">"{aiSuggestion}"</p>
                                            <button
                                                onClick={() => setPrompt(aiSuggestion)}
                                                className="text-[#8B4513] font-black text-xs uppercase tracking-widest hover:underline pt-2"
                                            >
                                                השתמשו בהצעה זו
                                            </button>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !prompt.trim()}
                                        className="w-full bg-[#2D1B14] text-white py-8 rounded-[2rem] font-black text-2xl shadow-[0_25px_50px_rgba(45,27,20,0.3)] hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-4 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                                <span>מכין את הפלאות שלכם...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>צורו את יצירת המופת שלי</span>
                                                <ArrowRight className="w-6 h-6 rotate-180" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Results Gallery */}
                            {(results.length > 0 || isGenerating) && (
                                <div className="space-y-10 pt-10">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-4xl font-serif font-bold text-[#2D1B14]">
                                            הקפה שלכם מוכן! ☕
                                        </h2>
                                        <p className="text-stone-400 font-medium">יצירות ה-AI הייחודיות שלכם הגיעו לשולחן</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {isGenerating ? (
                                            Array.from({ length: numImages }).map((_, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="aspect-square rounded-[3rem] bg-stone-100 flex items-center justify-center border-4 border-white shadow-xl"
                                                >
                                                    <Loader2 className="w-12 h-12 text-[#8B4513] animate-spin opacity-20" />
                                                </motion.div>
                                            ))
                                        ) : (
                                            results.map((url, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="group relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_rgba(45,27,20,0.2)] transition-all border-4 border-white"
                                                >
                                                    <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`AI Coffee ${idx + 1}`} />
                                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => handleSendToEmail(url)}
                                                                className="flex-1 bg-white text-[#2D1B14] py-4 rounded-2xl font-black flex items-center justify-center space-x-2 space-x-reverse hover:bg-[#8B4513] hover:text-white transition-all text-sm"
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                                <span>שלחו למייל</span>
                                                            </button>
                                                            <a
                                                                href={url}
                                                                download
                                                                className="w-16 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"
                                                            >
                                                                <Download className="w-5 h-5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
