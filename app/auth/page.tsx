'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Coffee, ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AuthView = 'login' | 'register' | 'forgot-password';

const loginSchema = z.object({
    email: z.string().email('כתובת אימייל לא תקינה'),
    password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'השם חייב להכיל לפחות 2 תווים'),
    email: z.string().email('כתובת אימייל לא תקינה'),
    password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
    confirmPassword: z.string()
}).refine((data) => data.confirmPassword === undefined || data.password === data.confirmPassword, {
    message: "הסיסמאות לא תואמות",
    path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
    email: z.string().email('כתובת אימייל לא תקינה'),
});

export default function AuthPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // UI State
    const [view, setView] = useState<AuthView>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    // Clear feedback when view changes
    useEffect(() => {
        setFeedback({ type: null, message: '' });
        reset();
    }, [view]);

    const activeSchema = view === 'login'
        ? loginSchema
        : view === 'register'
            ? registerSchema
            : forgotPasswordSchema;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
        resolver: zodResolver(activeSchema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setFeedback({ type: null, message: '' });

        try {
            if (view === 'forgot-password') {
                const res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({ email: data.email }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await res.json();

                if (res.ok) {
                    setFeedback({ type: 'success', message: 'קישור לאיפוס סיסמה נשלח לאימייל שלך.' });
                    setTimeout(() => setView('login'), 3000);
                } else {
                    setFeedback({ type: 'error', message: result.error || 'שגיאה בשליחת הבקשה.' });
                }

            } else if (view === 'login') {
                const res = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false
                });

                if (res?.error) {
                    setFeedback({ type: 'error', message: "פרטי התחברות שגויים. אנא נסה שוב." });
                } else {
                    // Success is handled by the useEffect redirect, but we can show a spinner or success briefly
                    setFeedback({ type: 'success', message: 'התחברת בהצלחה! מעביר אותך...' });
                    router.push('/dashboard');
                }

            } else if (view === 'register') {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await res.json();

                if (res.ok) {
                    setFeedback({ type: 'success', message: 'החשבון נוצר בהצלחה! מתחבר...' });
                    // Auto login after register
                    await signIn('credentials', {
                        email: data.email,
                        password: data.password,
                        redirect: false
                    });
                    router.push('/dashboard');
                } else {
                    setFeedback({ type: 'error', message: result.error || 'שגיאה ביצירת החשבון.' });
                }
            }
        } catch (err) {
            setFeedback({ type: 'error', message: "משהו השתבש. אנא נסה שוב מאוחר יותר." });
        } finally {
            setIsLoading(false);
        }
    };

    const getTitle = () => {
        switch (view) {
            case 'login': return 'התחברות';
            case 'register': return 'יצירת חשבון';
            case 'forgot-password': return 'איפוס סיסמה';
        }
    };

    const getSubtitle = () => {
        switch (view) {
            case 'login': return 'ברוכים השבים לבית הקלייה הדיגיטלי';
            case 'register': return 'הצטרפו למהפכת הקפה ותיהנו מהטבות';
            case 'forgot-password': return 'הזינו את המייל לשחזור הגישה';
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/coffee-beans.png')]" dir="rtl">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(45,27,20,0.1)] overflow-hidden border border-stone-100 min-h-[600px]">

                {/* Decorative Side */}
                <div className="hidden lg:relative lg:flex bg-[#2D1B14] p-16 text-white overflow-hidden flex-col justify-between">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 select-none pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Coffee" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center space-x-3 space-x-reverse text-white mb-12 hover:opacity-80 transition-opacity w-fit">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                                <Coffee className="w-8 h-8" />
                            </div>
                            <span className="text-3xl font-serif font-bold tracking-tight">The Digital Roast</span>
                        </Link>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={view === 'forgot-password' ? 'forgot' : 'main'} // Group login/register potentially
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-5xl font-serif font-bold leading-tight mb-6">
                                    {view === 'forgot-password' ? 'שחזור גישה' : view === 'login' ? 'ברוכים השבים' : 'הצטרפו אלינו'}
                                </h2>
                                <p className="text-white/60 text-lg font-light leading-relaxed">
                                    {view === 'forgot-password'
                                        ? "לכולנו יש רגעים של שכחה. הזינו את המייל ונשלח לכם קישור לאיפוס הסיסמה מיד."
                                        : view === 'login'
                                            ? 'הקפה שלכם כבר מתחמם. התחברו כדי לראות מה חדש בבריסטה האישי שלכם.'
                                            : 'פתחו חשבון בחינם וקבלו גישה לקלייה בהתאמה אישית, צבירת נקודות והזמנות מהירות.'}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/10">
                        <p className="text-sm font-bold uppercase tracking-widest opacity-40">נוסד ב-2026 - Digital Roast</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 lg:p-20 flex flex-col justify-center text-right relative">
                    <div className="mb-8">
                        {view === 'forgot-password' && (
                            <button
                                onClick={() => setView('login')}
                                className="mb-4 flex items-center text-stone-400 hover:text-[#2D1B14] transition-colors text-sm font-bold gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                חזרה להתחברות
                            </button>
                        )}
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-2"
                        >
                            <h1 className="text-4xl font-serif font-bold text-[#2D1B14]">
                                {getTitle()}
                            </h1>
                            <p className="text-stone-400">
                                {getSubtitle()}
                            </p>
                        </motion.div>
                    </div>

                    {/* Feedback Alert */}
                    <AnimatePresence>
                        {feedback.type && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${feedback.type === 'error' ? 'bg-red-50 text-red-900 border border-red-100' : 'bg-green-50 text-green-900 border border-green-100'
                                    }`}
                            >
                                {feedback.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm font-medium pt-0.5">{feedback.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {view === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-1">שם מלא</label>
                                    <div className="relative group">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                        <input
                                            {...register('name')}
                                            type="text"
                                            className="w-full bg-stone-50 border-2 border-stone-50 focus:border-[#8B4513]/20 focus:bg-white rounded-2xl p-4 pr-12 text-sm transition-all outline-none font-bold text-[#2D1B14]"
                                            placeholder="ישראל ישראלי"
                                        />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mr-1">{(errors.name as any).message}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>

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

                        {view !== 'forgot-password' && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center pl-1">
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-1">סיסמה</label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot-password')}
                                            className="text-[10px] font-bold text-[#8B4513] hover:underline"
                                        >
                                            שכחתם?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className="w-full bg-stone-50 border-2 border-stone-50 focus:border-[#8B4513]/20 focus:bg-white rounded-2xl p-4 pr-12 text-sm transition-all outline-none font-bold text-[#2D1B14]"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mr-1">{(errors.password as any).message}</p>}
                            </div>
                        )}

                        <AnimatePresence>
                            {view === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-1">אימות סיסמה</label>
                                    <div className="relative group">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                        <input
                                            {...register('confirmPassword')}
                                            type="password"
                                            className="w-full bg-stone-50 border-2 border-stone-50 focus:border-[#8B4513]/20 focus:bg-white rounded-2xl p-4 pr-12 text-sm transition-all outline-none font-bold text-[#2D1B14]"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mr-1">{(errors.confirmPassword as any).message}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#2D1B14] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 space-x-reverse ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="text-lg">
                                {isLoading ? 'מעבד...' : view === 'forgot-password' ? 'שלח קישור לשחזור' : view === 'login' ? 'התחברות' : 'צור חשבון'}
                            </span>
                            {!isLoading && <ArrowRight className="w-5 h-5 rotate-180" />}
                        </button>

                        {view !== 'forgot-password' && (
                            <p className="text-center text-stone-400 font-light text-sm pt-4">
                                {view === 'login' ? "עדיין אין לכם חשבון?" : "כבר יש לכם חשבון?"}
                                <button
                                    type="button"
                                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                    className="mr-2 font-bold text-[#8B4513] hover:text-black transition-colors underline decoration-[#8B4513]/20 hover:decoration-[#8B4513]"
                                >
                                    {view === 'login' ? 'הרשמו עכשיו' : 'התחברו כאן'}
                                </button>
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
