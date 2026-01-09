'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Coffee, ArrowRight, Mail, Lock, User, Github } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.confirmPassword === undefined || data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function AuthPage() {
    const { data: session, status } = useSession();
    const [isLogin, setIsLogin] = useState(true);
    const [isReset, setIsReset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/');
        }
    }, [status, router]);


    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: zodResolver(isReset ? z.object({ email: z.string().email() }) : (isLogin ? loginSchema : registerSchema)),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            if (isReset) {
                const res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({ email: data.email }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await res.json();
                alert(result.message || result.error);
                setIsReset(false);
            } else if (isLogin) {
                const res = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false
                });
                if (res?.error) alert(res.error);
                else router.push('/');
            } else {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await res.json();
                if (result.error) alert(result.error);
                else {
                    alert("Account created! Please sign in.");
                    setIsLogin(true);
                }
            }
        } catch (err) {
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/coffee-beans.png')]">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(45,27,20,0.1)] overflow-hidden border border-stone-100">

                {/* Decorative Side */}
                <div className="hidden lg:block relative bg-[#2D1B14] p-16 text-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Coffee" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <Link href="/" className="flex items-center space-x-3 text-white mb-12">
                                <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                                    <Coffee className="w-8 h-8" />
                                </div>
                                <span className="text-3xl font-serif font-bold tracking-tight">Coffee</span>
                            </Link>
                            <h2 className="text-5xl font-serif font-bold leading-tight mb-6">
                                {isReset ? 'Regain Access' : isLogin ? 'Welcome Back to Our Roastery' : 'Join the Digital Roast Culture'}
                            </h2>
                            <p className="text-white/60 text-lg font-light leading-relaxed">
                                {isReset
                                    ? "Don't worry, even the best baristas forget things sometimes. We'll help you get back in."
                                    : isLogin
                                        ? 'We missed your morning ritual. Sign in to access your favorite blends and orders.'
                                        : 'Become a member and enjoy 15% off your first order plus exclusive coffee insights.'}
                            </p>
                        </div>
                        <div className="pt-12 border-t border-white/10">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-40">Est. 2026 - Digital Roast</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 lg:p-20 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-serif font-bold text-[#2D1B14] mb-2">
                            {isReset ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Account'}
                        </h1>
                        <p className="text-stone-400 font-light underline decoration-[#8B4513]/20">
                            {isReset ? "Remembered it?" : isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => {
                                    if (isReset) setIsReset(false);
                                    else setIsLogin(!isLogin);
                                }}
                                className="ml-2 font-bold text-[#8B4513] hover:text-black transition-colors"
                            >
                                {isReset ? 'Back to Login' : isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {!isLogin && !isReset && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                        <input
                                            {...register('name')}
                                            type="text"
                                            className={`w-full bg-stone-50 border-2 ${errors.name ? 'border-red-200' : 'border-stone-50 focus:border-[#8B4513]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{(errors.name as any).message}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full bg-stone-50 border-2 ${errors.email ? 'border-red-200' : 'border-stone-50 focus:border-[#8B4513]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{(errors.email as any).message}</p>}
                        </div>

                        {!isReset && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Password</label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => setIsReset(true)}
                                            className="text-[10px] font-bold text-[#8B4513] hover:underline"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className={`w-full bg-stone-50 border-2 ${errors.password ? 'border-red-200' : 'border-stone-50 focus:border-[#8B4513]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{(errors.password as any).message}</p>}
                            </div>
                        )}

                        <AnimatePresence>
                            {!isLogin && !isReset && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513] transition-colors" />
                                        <input
                                            {...register('confirmPassword')}
                                            type="password"
                                            className={`w-full bg-stone-50 border-2 ${errors.confirmPassword ? 'border-red-200' : 'border-stone-50 focus:border-[#8B4513]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{(errors.confirmPassword as any).message}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#2D1B14] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span>
                                {isLoading ? 'Processing...' : isReset ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                            </span>
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
