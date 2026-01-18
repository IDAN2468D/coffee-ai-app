'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Coffee, ShoppingBag, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "@/components/Navbar";
import { useCart } from '@/lib/store';
import { PRODUCTS } from '@/lib/products';

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ExpertClient() {
    const { addItem } = useCart();
    const [actionToast, setActionToast] = useState<{ show: boolean, item?: string }>({ show: false });

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'שלום! אני בריסטה ג׳י, מומחה הקפה האישי שלכם. איך אוכל לעזור לכם היום? שאלו אותי על פולים, שיטות חליטה, או המלצות לקפה מושלם. ☕️',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = 'he-IL';
                recognition.interimResults = false;

                recognition.onstart = () => setIsListening(true);

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    // Safe auto-submit after short delay to allow state update
                    setTimeout(() => {
                        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                        if (submitButton) submitButton.click();
                    }, 500);
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech error", event.error);
                    setIsListening(false);

                    let msg = "שגיאה במיקרופון.";
                    if (event.error === 'not-allowed') msg = "הגישה למיקרופון נחסמה. אנא אשרו בהגדרות הדפדפן.";
                    if (event.error === 'no-speech') return; // Ignore if just silence

                    alert(msg); // Using alert for immediate visibility on mobile
                };

                recognition.onend = () => setIsListening(false);

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        // Security Check for Mobile/IP access
        if (typeof window !== 'undefined' && window.isSecureContext === false) {
            alert('שים לב: דפדפנים חוסמים גישה למיקרופון בכתובות לא מאובטחות (HTTP). נסה להתחבר דרך localhost או העבר את האתר ל-HTTPS.');
            return;
        }

        if (!recognitionRef.current) {
            alert('הדפדפן שלך לא תומך בפקודות קוליות. נסה להשתמש ב-Chrome.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error("Speech start error:", error);
                // If it crashes on start, it might be busy. Resetting.
                recognitionRef.current.stop();
                setIsListening(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content })
            });

            const data = await response.json();

            if (data.reply) {
                let aiText = data.reply;

                // Parse Action Protocol
                // Format: [ACTION: JSON]
                const actionRegex = /\[ACTION:\s*({.*})\]/;
                const match = aiText.match(actionRegex);

                if (match) {
                    try {
                        const actionJson = JSON.parse(match[1]);
                        if (actionJson.type === 'ADD_TO_CART') {
                            const product = PRODUCTS.find(p => p.name.includes(actionJson.item) || actionJson.item.includes(p.name));
                            if (product) {
                                for (let i = 0; i < (actionJson.quantity || 1); i++) {
                                    addItem(product);
                                }
                                setActionToast({ show: true, item: product.name });
                                setTimeout(() => setActionToast({ show: false }), 3000);
                            }
                        }
                        // Remove the action block from display text
                        aiText = aiText.replace(match[0], '').trim();
                    } catch (e) {
                        console.error("Failed to parse AI action", e);
                    }
                }

                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: aiText,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error("No reply");
            }

        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "מתנצל, יש לי קושי להתחבר למאגר הידע כרגע. אנא נסה שוב בעוד רגע.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#1a120e] font-sans flex flex-col" dir="rtl">
            <Navbar />

            <div className="flex-grow pt-32 pb-12 px-4 sm:px-6 flex flex-col items-center justify-center relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#2D1B14] to-transparent pointer-events-none" />
                <div className="absolute top-40 right-10 w-64 h-64 bg-[#C37D46] rounded-full blur-[120px] opacity-20 pointer-events-none" />

                <div className="w-full max-w-4xl bg-[#2D1B14]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col h-[75vh] relative z-10">

                    {/* Header */}
                    <div className="bg-[#1a100c] p-6 sm:p-8 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#C37D46] to-[#8B4513] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a100c]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-white">הבריסטה החכם</h1>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">מופעל על ידי Gemini AI</p>
                            </div>
                        </div>
                        <Coffee className="w-8 h-8 text-white/10 hidden sm:block" />
                    </div>

                    {/* Chat Area */}
                    <div className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex items-end gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user'
                                    ? 'bg-white/10 text-white'
                                    : 'bg-[#C37D46] text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>

                                <div className={`max-w-[80%] p-6 rounded-2xl text-base leading-relaxed shadow-lg ${msg.role === 'user'
                                    ? 'bg-white/5 text-white border border-white/10 rounded-br-sm'
                                    : 'bg-[#1a100c] text-stone-200 border border-white/5 rounded-bl-sm'
                                    }`}>
                                    <p className="whitespace-pre-line">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-end gap-4 flex-row"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-[#C37D46] flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-[#1a100c] p-6 rounded-2xl rounded-bl-sm border border-white/5 shadow-lg flex items-center space-x-2 space-x-reverse">
                                    <span className="w-2 h-2 bg-[#C37D46] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-[#C37D46] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-[#C37D46] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    <span className="text-xs text-stone-500 mr-2 animate-pulse font-medium">מקליד...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-[#1a100c] border-t border-white/5">
                        <form onSubmit={handleSubmit} className="relative flex items-center gap-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isListening ? "מקשיב..." : "שאלות על קפה, מתכונים, או המלצות..."}
                                    className={`w-full bg-white/5 border border-white/10 focus:border-[#C37D46]/50 focus:bg-white/10 rounded-xl py-5 pl-14 pr-6 text-white placeholder-white/30 font-medium transition-all outline-none ${isListening ? 'ring-2 ring-red-500/50' : ''}`}
                                />
                                <button
                                    type="button" // Important so it doesn't submit form
                                    onClick={toggleListening}
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-stone-400 hover:text-[#C37D46]'}`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-5 bg-[#C37D46] text-white rounded-xl hover:bg-[#A66330] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#C37D46]/20 active:scale-95"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 rotate-180" />}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-6 text-white/30 text-xs text-center max-w-lg">
                    הבריסטה החכם מבוסס על בינה מלאכותית ועשוי לטעות. תמיד סמכו על בלוטות הטעם שלכם.
                </p>

                {/* Action Toast */}
                <AnimatePresence>
                    {actionToast.show && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#2D1B14] text-white px-8 py-4 rounded-full shadow-2xl border border-[#C37D46] flex items-center gap-4 z-50"
                        >
                            <div className="bg-[#C37D46] p-2 rounded-full">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">המשימה בוצעה!</p>
                                <p className="text-xs text-white/70">הוספתי {actionToast.item} לסל הקניות שלך.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
