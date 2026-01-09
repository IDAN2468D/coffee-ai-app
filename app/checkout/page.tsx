'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/store';
import { ArrowLeft, CreditCard, ShieldCheck, MapPin, Truck, ChevronRight, User, Mail, Home, Building2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const checkoutSchema = z.object({
    fullName: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    street: z.string().min(5, 'Please enter full street address'),
    city: z.string().min(2, 'City is required'),
    apartment: z.string().optional(),
    cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid card format (#### #### #### ####)'),
});

import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { data: session } = useSession();
    const { items, total, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isOrdered, setIsOrdered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { register, handleSubmit, trigger, formState: { errors } } = useForm({
        resolver: zodResolver(checkoutSchema),
        mode: 'onChange'
    });

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (step === 1) fieldsToValidate = ['fullName', 'email'];
        if (step === 2) fieldsToValidate = ['street', 'city'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep(step + 1);
    };

    const onSubmit = async (data: any) => {
        if (!session) {
            alert("Please sign in to complete your order");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items,
                    total: total,
                })
            });

            const result = await res.json();
            if (result.success) {
                setIsOrdered(true);
                clearCart();
            } else {
                alert(result.error || "Failed to place order");
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOrdered) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-8 text-center space-y-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-100 p-10 rounded-full"
                >
                    <div className="bg-green-500 p-6 rounded-full text-white shadow-xl">
                        <ShieldCheck className="w-20 h-20" />
                    </div>
                </motion.div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-serif font-bold text-[#2D1B14]">Order Placed!</h2>
                    <p className="text-xl text-stone-500 font-light max-w-md mx-auto">
                        Your coffee is being brewed and will be at your door in approximately 15 minutes.
                    </p>
                </div>
                <Link
                    href="/"
                    className="bg-[#2D1B14] text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all"
                >
                    Back to Coffee Shop
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className="bg-stone-100 p-8 rounded-full">
                    <CreditCard className="w-16 h-16 text-stone-300" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-bold text-[#2D1B14]">Your Cart is Empty</h2>
                    <p className="text-stone-500 font-light">Add some delicious coffee before checking out.</p>
                </div>
                <Link
                    href="/"
                    className="bg-[#2D1B14] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
                >
                    Return to Menu
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-stone-500 hover:text-[#2D1B14] transition-colors group">
                        <div className="bg-white p-2 rounded-xl border border-stone-200 group-hover:bg-stone-50 shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">Back to menu</span>
                    </Link>
                    <div className="text-right hidden md:block">
                        <h1 className="text-3xl font-serif font-bold text-[#2D1B14]">Complete Your Order</h1>
                        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">The Digital Roast Coffee House</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-[#2D1B14] text-white shadow-lg' : 'bg-stone-100 text-stone-300'}`}>
                                        {s}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${step >= s ? 'text-[#2D1B14]' : 'text-stone-300'}`}>
                                        {s === 1 ? 'Details' : s === 2 ? 'Delivery' : 'Payment'}
                                    </span>
                                    {s < 3 && <ChevronRight className="w-4 h-4 text-stone-200" />}
                                </div>
                            ))}
                        </div>

                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 space-y-10"
                        >
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3 text-[#2D1B14] mb-2">
                                        <ShieldCheck className="w-6 h-6" />
                                        <h3 className="text-xl font-serif font-bold">Personal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513]" />
                                                <input
                                                    {...register('fullName')}
                                                    type="text" placeholder="John Doe"
                                                    className={`w-full bg-stone-50 border-2 ${errors.fullName ? 'border-red-100' : 'border-stone-50 focus:border-[#2D1B14]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{(errors.fullName as any).message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513]" />
                                                <input
                                                    {...register('email')}
                                                    type="email" placeholder="john@example.com"
                                                    className={`w-full bg-stone-50 border-2 ${errors.email ? 'border-red-100' : 'border-stone-50 focus:border-[#2D1B14]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                                />
                                            </div>
                                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{(errors.email as any).message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3 text-[#2D1B14] mb-2">
                                        <MapPin className="w-6 h-6" />
                                        <h3 className="text-xl font-serif font-bold">Delivery Address</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Street Address</label>
                                            <div className="relative group">
                                                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513]" />
                                                <input
                                                    {...register('street')}
                                                    type="text" placeholder="123 Coffee Street"
                                                    className={`w-full bg-stone-50 border-2 ${errors.street ? 'border-red-100' : 'border-stone-50 focus:border-[#2D1B14]/20'} focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none`}
                                                />
                                            </div>
                                            {errors.street && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{(errors.street as any).message}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">City</label>
                                                <input
                                                    {...register('city')}
                                                    type="text" placeholder="Brewville"
                                                    className={`w-full bg-stone-50 border-2 ${errors.city ? 'border-red-100' : 'border-stone-50 focus:border-[#2D1B14]/20'} focus:bg-white rounded-2xl p-4 text-sm transition-all outline-none`}
                                                />
                                                {errors.city && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{(errors.city as any).message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Floor / Apartment</label>
                                                <div className="relative group">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#8B4513]" />
                                                    <input
                                                        {...register('apartment')}
                                                        type="text" placeholder="2nd Floor"
                                                        className="w-full bg-stone-50 border-2 border-stone-50 focus:border-[#2D1B14]/20 focus:bg-white rounded-2xl p-4 pl-12 text-sm transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3 text-[#2D1B14] mb-2">
                                        <CreditCard className="w-6 h-6" />
                                        <h3 className="text-xl font-serif font-bold">Payment Method</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-stone-50 border-2 border-[#2D1B14] rounded-2xl p-6 flex justify-between items-center group">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                                    <CreditCard className="w-6 h-6 text-[#2D1B14]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#2D1B14]">Credit Card</p>
                                                    <p className="text-xs text-stone-400">Visa, Mastercard, AMEX</p>
                                                </div>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-4 border-[#2D1B14] bg-[#2D1B14]/10 shadow-[0_0_0_2px_white_inset]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Card Number</label>
                                            <input
                                                {...register('cardNumber')}
                                                type="text" placeholder="1234 5678 9101 1121"
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                                    val = val.match(/.{1,4}/g)?.join(' ') ?? val;
                                                    e.target.value = val;
                                                }}
                                                className={`w-full bg-stone-50 border-2 ${errors.cardNumber ? 'border-red-100' : 'border-stone-50 focus:border-[#2D1B14]/20'} focus:bg-white rounded-2xl p-4 text-sm transition-all outline-none`}
                                            />
                                            {errors.cardNumber && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{(errors.cardNumber as any).message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-stone-100 flex justify-between items-center">
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(step - 1)} className="text-stone-400 hover:text-[#2D1B14] font-bold text-sm uppercase tracking-widest transition-colors">
                                        Previous Step
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="ml-auto bg-[#2D1B14] text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-3"
                                    >
                                        <span>Continue to {step === 1 ? 'Delivery' : 'Payment'}</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`ml-auto bg-[#2D1B14] text-white px-12 py-5 rounded-2xl font-black shadow-[0_20px_40px_rgba(45,27,20,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span>{isSubmitting ? 'Processing...' : `Confirm and Pay $${total.toFixed(2)}`}</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-[#2D1B14] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                            <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Order Summary</h3>
                            <div className="space-y-6 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{item.name}</p>
                                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{item.quantity} × ${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/10 space-y-4 relative z-10">
                                <div className="flex justify-between text-white/60 text-sm font-bold uppercase tracking-widest">
                                    <span>Items Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/60 text-sm font-bold uppercase tracking-widest">
                                    <div className="flex items-center space-x-2">
                                        <Truck className="w-4 h-4" />
                                        <span>Brew-Delivery Fee</span>
                                    </div>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="pt-6 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-1">Total to pay</p>
                                        <p className="text-4xl font-black">${total.toFixed(2)}</p>
                                    </div>
                                    <ShieldCheck className="w-8 h-8 opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
