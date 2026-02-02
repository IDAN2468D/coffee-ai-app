'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Mail, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const forgotPasswordSchema = z.object({
    email: z.string().email('כתובת אימייל לא תקינה'),
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setFeedback({ type: null, message: '' });

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email: data.email }),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();

            if (res.ok) {
                setFeedback({ type: 'success', message: 'קישור לאיפוס סיסמה נשלח לאימייל שלך.' });
            } else {
                setFeedback({ type: 'error', message: result.error || 'שגיאה בשליחת הבקשה.' });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: "משהו השתבש. אנא נסה שוב מאוחר יותר." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
        >
            <div className="mb-8">
                <Link href="/auth/login" className="mb-4 flex items-center text-stone-400 hover:text-[#2D1B14] transition-colors text-sm font-bold gap-1 w-fit">
                    <ChevronLeft className="w-4 h-4" />
                    חזרה להתחברות
                </Link>
                <h1 className="text-4xl font-serif font-bold text-[#2D1B14] mb-2">איפוס סיסמה</h1>
                <p className="text-stone-400">הזינו את המייל לשחזור הגישה</p>
            </div>

            <AnimatePresence>
                {feedback.type && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${feedback.type === 'error' ? 'bg-red-50 text-red-900 border border-red-100' : 'bg-green-50 text-green-900 border border-green-100'}`}
                    >
                        {feedback.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                        <p className="text-sm font-medium pt-0.5">{feedback.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-1">כתובת אימייל</label>
                    <div className="relative group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full bg-stone-50 border-2 border-stone-50 focus:border-[#8B4513]/20 focus:bg-white rounded-2xl p-4 pr-12 text-sm transition-all outline-none font-bold text-[#2D1B14]"
                            placeholder="you@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mr-1">{(errors.email as any).message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-[#2D1B14] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 space-x-reverse ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    <span className="text-lg">{isLoading ? 'מעבד...' : 'שלח קישור לשחזור'}</span>
                    {!isLoading && <ArrowRight className="w-5 h-5 rotate-180" />}
                </button>
            </form>
        </motion.div>
    );
}
