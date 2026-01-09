'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Subscription() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setEmail('');
            } else {
                setError(data.error || 'שגיאה בהרשמה');
            }
        } catch (err) {
            setError('שגיאה בחיבור לשרת');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-12" dir="rtl">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 bg-[#8B4513]/5 rounded-full text-[#8B4513] text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                    >
                        חברי מועדון ה-Roast
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14]">הצטרפו וקבלו 15% הנחה</h2>
                    <p className="text-stone-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        הירשמו לניוזלטר שלנו וקבלו 15% הנחה על ההזמנה הראשונה וקוד קופון בלעדי ישירות למייל!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <div className="relative flex-grow group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#8B4513] transition-colors w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="הזינו את כתובת המייל שלכם..."
                            required
                            disabled={loading}
                            className="w-full pr-12 pl-6 py-5 bg-stone-50 border-2 border-stone-50 focus:border-[#8B4513]/20 focus:bg-white rounded-[1.2rem] outline-none transition-all text-sm font-bold text-right ring-0"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#2D1B14] text-white px-10 py-5 rounded-[1.2rem] font-black uppercase tracking-widest text-xs hover:bg-[#8B4513] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-stone-200/50 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'מעבד...' : 'שלחו לי את הקופון'}
                    </button>
                </form>

                <div className="pt-4">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl font-bold text-sm"
                        >
                            {message}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl font-bold text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
