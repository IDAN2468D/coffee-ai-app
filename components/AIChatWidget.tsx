'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Coffee, Sparkles, User, Bot } from 'lucide-react';

type Message = {
    role: 'user' | 'model';
    text: string;
};

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            // Convert history to Gemini format if needed, simplistic here
            const historyForApi = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: historyForApi,
                    message: userMsg
                })
            });

            const data = await res.json();

            if (data.text) {
                setMessages(prev => [...prev, { role: 'model', text: data.text }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: 'סליחה, המוח הדיגיטלי שלי קצת עמוס כרגע. נסה שוב?' }]);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'model', text: 'אופס, הייתה שגיאת תקשורת.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 z-50 bg-[#2D1B14] text-[#FDFCF0] p-4 rounded-full shadow-xl border-2 border-[#C37D46] flex items-center gap-2 group"
            >
                {isOpen ? <X /> : <MessageSquare className="group-hover:animate-bounce" />}
                {!isOpen && <span className="hidden md:inline font-bold">הבריסטה החכם</span>}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-[400px] h-[60vh] md:h-[500px] bg-[#FDFCF0] rounded-2xl shadow-2xl border border-[#E8CBAD] flex flex-col overflow-hidden font-sans z-[60]"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="bg-[#2D1B14] p-4 flex items-center gap-3 shadow-md">
                            <div className="w-10 h-10 bg-[#C37D46] rounded-full flex items-center justify-center border-2 border-white">
                                <Bot className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-[#FDFCF0] font-bold text-lg">דורון | AI Barista</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[#E8CBAD] text-xs">מחובר עכשיו</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, opacity: 0.9 }}>
                            {messages.length === 0 && (
                                <div className="text-center mt-10 opacity-60">
                                    <Coffee className="w-12 h-12 mx-auto mb-2 text-[#C37D46]" />
                                    <p>היי! אני דורון ואני כאן כדי לעזור לך לבחור את הקפה המושלם. מה בא לך היום?</p>
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-stone-200' : 'bg-[#C37D46] text-white'}`}>
                                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-white text-stone-800 rounded-tr-none border border-stone-100'
                                        : 'bg-[#2D1B14] text-[#FDFCF0] rounded-tl-none'
                                        }`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex items-center gap-2 text-stone-400 text-xs">
                                    <Sparkles className="w-3 h-3 animate-spin" />
                                    דורון מקליד...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-stone-100">
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="שאל אותי על קפה..."
                                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C37D46] focus:ring-1 focus:ring-[#C37D46] transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-[#C37D46] hover:bg-[#a86535] disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
