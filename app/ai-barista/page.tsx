'use client';

import React, { useState } from 'react';
import { Coffee, Sparkles, Wand2, Download, Share2, Loader2, ArrowRight, Heart, Mail, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

const SUGGESTIONS = [
    "A galaxy-themed latte with swirling purple and blue nebula art",
    "A steaming cup of espresso on a misty mountain top at sunrise",
    "Cyberpunk style neon green matcha in a holographic glass",
    "An ancient stone mug of dark coffee surrounded by mystical runes",
    "A cozy autumn cappuccino with a tiny maple leaf made of cinnamon",
    "A glass of cold brew coffee with ice cubes that look like diamonds",
    "A magical potion-style coffee in a glowing ember mug",
    "A minimalist white cup on a marble counter with perfect latte art"
];

export default function AIBaristaPage() {
    const { data: session } = useSession();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [numImages, setNumImages] = useState(3);

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
                        body: JSON.stringify({ prompt, variant: i })
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
            alert('נא להתחבר כדי לשלוח למייל');
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
        <main className="min-h-screen bg-gradient-to-br from-[#FDFCF0] via-[#F5F1E8] to-[#FDFCF0]">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#6B3410] text-white rounded-full shadow-lg">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-black uppercase tracking-widest text-sm">AI Powered Barista</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2D1B14] leading-tight">
                        יצירת <span className="text-[#8B4513]">אמנות קפה</span> בעזרת AI
                    </h1>
                    <p className="text-stone-500 text-xl max-w-3xl mx-auto">
                        הבריסטה הדיגיטלי שלנו משתמש ב-AI מתקדם כדי ליצור עבורך תמונות קפה ייחודיות
                    </p>
                </div>

                {/* Control Panel */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
                    <div className="space-y-6">
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="תאר את חלום הקפה שלך... (לדוגמה: לאטה זהוב בכוס קריסטל מרחפת)"
                                className="w-full bg-stone-50 border-2 border-stone-100 rounded-3xl p-8 text-lg focus:border-[#8B4513]/30 focus:ring-0 transition-all outline-none min-h-[160px] resize-none"
                                dir="rtl"
                            />
                            <button
                                onClick={handleMagic}
                                className="absolute left-6 bottom-6 p-4 bg-gradient-to-br from-[#8B4513] to-[#6B3410] text-white rounded-2xl hover:scale-105 transition-transform shadow-lg flex items-center space-x-2"
                                title="הצעה קסומה"
                            >
                                <Wand2 className="w-5 h-5" />
                                <span className="text-sm font-bold">קסם</span>
                            </button>
                        </div>

                        {/* AI Enhancement */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAISuggestion}
                                disabled={loadingAI || !prompt.trim()}
                                className="flex-1 bg-purple-50 text-purple-700 border-2 border-purple-200 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-100 transition-all disabled:opacity-50"
                            >
                                {loadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                <span>שפר את התיאור עם AI</span>
                            </button>

                            <div className="flex items-center space-x-4 bg-stone-50 px-6 py-4 rounded-2xl">
                                <span className="text-sm font-bold text-stone-600">מספר תמונות:</span>
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setNumImages(num)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all ${numImages === num
                                                ? 'bg-[#8B4513] text-white'
                                                : 'bg-white text-stone-600 hover:bg-stone-100'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {aiSuggestion && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 space-y-3"
                            >
                                <div className="flex items-center space-x-2 text-purple-700">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="font-bold">הצעת AI:</span>
                                </div>
                                <p className="text-stone-700" dir="rtl">{aiSuggestion}</p>
                                <button
                                    onClick={() => setPrompt(aiSuggestion)}
                                    className="text-purple-700 font-bold text-sm hover:underline"
                                >
                                    השתמש בהצעה זו
                                </button>
                            </motion.div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="w-full bg-gradient-to-r from-[#2D1B14] to-[#8B4513] text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>מכין את הקפה שלך...</span>
                                </>
                            ) : (
                                <>
                                    <span>צור יצירות אמנות</span>
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Gallery */}
                {(results.length > 0 || isGenerating) && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-[#2D1B14] text-center">
                            הקפה שלך מוכן! ☕
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {isGenerating ? (
                                Array.from({ length: numImages }).map((_, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="aspect-square rounded-3xl bg-stone-100 flex items-center justify-center"
                                    >
                                        <Loader2 className="w-12 h-12 text-[#8B4513] animate-spin" />
                                    </motion.div>
                                ))
                            ) : (
                                results.map((url, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative aspect-square rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                                    >
                                        <img src={url} className="w-full h-full object-cover" alt={`AI Coffee ${idx + 1}`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-6 left-6 right-6 flex space-x-3">
                                                <button
                                                    onClick={() => handleSendToEmail(url)}
                                                    className="flex-1 bg-white text-[#2D1B14] py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-stone-100 transition-colors"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    <span className="text-sm">שלח למייל</span>
                                                </button>
                                                <a
                                                    href={url}
                                                    download
                                                    className="flex-1 bg-white/20 backdrop-blur-md text-white border border-white/30 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-white/30 transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span className="text-sm">הורד</span>
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
