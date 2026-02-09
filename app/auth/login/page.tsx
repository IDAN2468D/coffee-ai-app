'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import CoffeeLoginAnimation from '@/components/CoffeeLoginAnimation';

const loginSchema = z.object({
    email: z.string().email('כתובת אימייל לא תקינה'),
    password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
});

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [showCoffeeAnimation, setShowCoffeeAnimation] = useState(false);

    // Handle feedback from redirects (e.g. after register)
    useEffect(() => {
        if (searchParams?.get('registered') === 'true') {
            setFeedback({ type: 'success', message: 'החשבון נוצר בהצלחה! אנא התחבר.' });
        }

        // Handle Google Login Return
        if (searchParams?.get('google_auth') === 'true') {
            setFeedback({ type: 'success', message: 'התחברת בהצלחה! מעביר אותך...' });
            setShowCoffeeAnimation(true);
        }
    }, [searchParams]);

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setFeedback({ type: null, message: '' });

        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false
            });

            if (res?.error) {
                setFeedback({ type: 'error', message: "פרטי התחברות שגויים. אנא נסה שוב." });
            } else {
                setFeedback({ type: 'success', message: 'התחברת בהצלחה! מעביר אותך...' });
                // Show coffee animation before redirect
                setShowCoffeeAnimation(true);
            }
        } catch (err: any) {
            console.error("Login error:", err);
            const errorMessage = err?.message || "משהו השתבש. אנא נסה שוב מאוחר יותר.";
            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnimationComplete = () => {
        router.push('/');
    };

    return (
        <>
            <CoffeeLoginAnimation
                isVisible={showCoffeeAnimation}
                onComplete={handleAnimationComplete}
            />
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-[#2D1B14] mb-2">התחברות</h1>
                    <p className="text-stone-400">ברוכים השבים לבית הקלייה הדיגיטלי</p>
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

                    <div className="space-y-2">
                        <div className="flex justify-between items-center pl-1">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-1">סיסמה</label>
                            <Link href="/auth/forgot-password" className="text-[10px] font-bold text-[#8B4513] hover:underline">
                                שכחתם?
                            </Link>
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#2D1B14] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 space-x-reverse ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span className="text-lg">{isLoading ? 'מעבד...' : 'התחברות'}</span>
                        {!isLoading && <ArrowRight className="w-5 h-5 rotate-180" />}
                    </button>

                    <p className="text-center text-stone-400 font-light text-sm pt-4">
                        עדיין אין לכם חשבון?{' '}
                        <Link href="/auth/register" className="font-bold text-[#8B4513] hover:text-black transition-colors underline decoration-[#8B4513]/20 hover:decoration-[#8B4513]">
                            הרשמו עכשיו
                        </Link>
                    </p>
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-stone-400">או המשך באמצעות</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/auth/login?google_auth=true' })}
                        className="w-full bg-white border-2 border-stone-100 text-[#2D1B14] py-4 rounded-2xl font-bold hover:bg-stone-50 hover:border-stone-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden group mb-6"
                    >
                        <div className="w-6 h-6 relative flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        </div>
                        <span>Google</span>
                    </button>
                </form>
            </motion.div>
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#2D1B14] animate-spin opacity-20" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
