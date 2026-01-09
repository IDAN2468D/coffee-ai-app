'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

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
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-bold text-[#2D1B14]">הצטרף וקבל 15% הנחה</h2>
                    <p className="text-stone-500">הירשם לניוזלטר שלנו וקבל 15% הנחה על ההזמנה הראשונה + קוד קופון למייל!</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="הזן את כתובת המייל שלך"
                            required
                            disabled={loading}
                            className="w-full pl-12 pr-6 py-4 bg-stone-100 rounded-lg outline-none focus:ring-2 focus:ring-[#8B4513]/20 transition-all border border-transparent focus:border-[#8B4513]/20 disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#8B4513] text-white px-12 py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'שולח...' : 'הירשם'}
                    </button>
                </form>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </section>
    );
}
