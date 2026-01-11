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
    fullName: z.string().min(2, 'השם קצר מדי'),
    email: z.string().email('כתובת אימייל לא תקינה'),
    street: z.string().min(5, 'מלא כתובת רחוב מלאה'),
    city: z.string().min(2, 'שם עיר חובה'),
    apartment: z.string().optional(),
    cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'פורמט כרטיס לא תקין (#### #### #### ####)'),
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
            alert("אנא התחבר כדי להשלים את ההזמנה");
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
                    shippingDetails: data
                })
            });

            const result = await res.json();
            if (result.success) {
                setIsOrdered(true);
                clearCart();
            } else {
                alert(result.error || "שגיאה בביצוע ההזמנה");
            }
        } catch (error) {
            alert("משהו השתבש");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOrdered) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-8 text-center space-y-8" dir="rtl">
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
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2D1B14]">ההזמנה התקבלה!</h2>
                    <p className="text-xl text-stone-500 font-light max-w-md mx-auto leading-relaxed">
                        הקפה שלך כבר בתהליך הכנה ויהיה אצלך תוך כ-15 דקות.
                    </p>
                </div>
                <Link
                    href="/"
                    className="bg-[#2D1B14] text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all text-xl"
                >
                    חזרה לחנות הקפה
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-8 text-center space-y-8" dir="rtl">
                <div className="bg-stone-100 p-8 rounded-[2rem]">
                    <CreditCard className="w-16 h-16 text-stone-300" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-bold text-[#2D1B14]">סל הקניות ריק</h2>
                    <p className="text-stone-500 text-lg">הוסף קפה משובח לתפריט לפני סיום ההזמנה.</p>
                </div>
                <Link
                    href="/"
                    className="bg-[#2D1B14] text-white px-10 py-5 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
                >
                    חזרה לתפריט
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCF0] p-6 lg:p-12" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 flex items-center justify-between flex-row-reverse">
                    <Link href="/" className="flex items-center space-x-3 space-x-reverse text-stone-500 hover:text-[#2D1B14] transition-colors group">
                        <div className="bg-white p-3 rounded-2xl border border-stone-100 group-hover:bg-stone-50 shadow-sm transition-all">
                            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">חזרה לתפריט</span>
                    </Link>
                    <div className="text-right">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14]">סיום הזמנה</h1>
                        <p className="text-stone-400 text-xs font-black uppercase tracking-[0.3em] mt-2">The Digital Roast Coffee House</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-10">
                        <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-50">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center space-x-4 space-x-reverse">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all text-lg shadow-inner ${step >= s ? 'bg-[#2D1B14] text-white shadow-xl scale-110' : 'bg-stone-100 text-stone-300'}`}>
                                        {s}
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest hidden sm:block ${step >= s ? 'text-[#2D1B14]' : 'text-stone-300'}`}>
                                        {s === 1 ? 'פרטים' : s === 2 ? 'משלוח' : 'תשלום'}
                                    </span>
                                    {s < 3 && <ChevronRight className="w-5 h-5 text-stone-100 rotate-180" />}
                                </div>
                            ))}
                        </div>

                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-stone-200/40 border border-stone-50 space-y-12"
                        >
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-4 space-x-reverse text-[#2D1B14]">
                                        <div className="bg-[#2D1B14]/5 p-3 rounded-2xl">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold">פרטים אישיים</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-2">שם מלא</label>
                                            <div className="relative group">
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#CAB3A3] transition-colors" />
                                                <input
                                                    {...register('fullName')}
                                                    type="text" placeholder="ישראל ישראלי"
                                                    className={`w-full bg-stone-50/50 border-2 ${errors.fullName ? 'border-red-100' : 'border-stone-50 focus:border-[#CAB3A3]/50'} focus:bg-white rounded-[1.5rem] p-5 pr-12 text-sm transition-all outline-none font-bold`}
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.fullName as any).message}</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-2">כתובת אימייל</label>
                                            <div className="relative group">
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#CAB3A3] transition-colors" />
                                                <input
                                                    {...register('email')}
                                                    type="email" placeholder="example@gmail.com"
                                                    className={`w-full bg-stone-50/50 border-2 ${errors.email ? 'border-red-100' : 'border-stone-50 focus:border-[#CAB3A3]/50'} focus:bg-white rounded-[1.5rem] p-5 pr-12 text-sm transition-all outline-none font-bold`}
                                                />
                                            </div>
                                            {errors.email && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.email as any).message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-4 space-x-reverse text-[#2D1B14]">
                                        <div className="bg-[#2D1B14]/5 p-3 rounded-2xl">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold">כתובת למשלוח</h3>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-2">כתובת רחוב ומספר</label>
                                            <div className="relative group">
                                                <Home className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#CAB3A3] transition-colors" />
                                                <input
                                                    {...register('street')}
                                                    type="text" placeholder="רחוב הברזל 1"
                                                    className={`w-full bg-stone-50/50 border-2 ${errors.street ? 'border-red-100' : 'border-stone-50 focus:border-[#CAB3A3]/50'} focus:bg-white rounded-[1.5rem] p-5 pr-12 text-sm transition-all outline-none font-bold`}
                                                />
                                            </div>
                                            {errors.street && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.street as any).message}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-2">עיר</label>
                                                <input
                                                    {...register('city')}
                                                    type="text" placeholder="תל אביב"
                                                    className={`w-full bg-stone-50/50 border-2 ${errors.city ? 'border-red-100' : 'border-stone-50 focus:border-[#CAB3A3]/50'} focus:bg-white rounded-[1.5rem] p-5 text-sm transition-all outline-none font-bold`}
                                                />
                                                {errors.city && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.city as any).message}</p>}
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-2">קומה / דירה</label>
                                                <div className="relative group">
                                                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-[#CAB3A3] transition-colors" />
                                                    <input
                                                        {...register('apartment')}
                                                        type="text" placeholder="דירה 4, קומה 2"
                                                        className="w-full bg-stone-50/50 border-2 border-stone-50 focus:border-[#CAB3A3]/50 focus:bg-white rounded-[1.5rem] p-5 pr-12 text-sm transition-all outline-none font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-4 space-x-reverse text-[#2D1B14]">
                                        <div className="bg-[#2D1B14]/5 p-3 rounded-2xl">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold">אמצעי תשלום</h3>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="bg-stone-50/50 border-2 border-[#2D1B14] rounded-3xl p-8 flex justify-between items-center group shadow-inner">
                                            <div className="flex items-center space-x-5 space-x-reverse">
                                                <div className="bg-white p-4 rounded-2xl shadow-md border border-stone-100">
                                                    <CreditCard className="w-8 h-8 text-[#2D1B14]" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-xl text-[#2D1B14]">כרטיס אשראי</p>
                                                    <p className="text-sm text-stone-400 font-bold">Visa, Mastercard, AMEX</p>
                                                </div>
                                            </div>
                                            <div className="w-7 h-7 rounded-full border-8 border-[#2D1B14] bg-white shadow-xl" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mr-2">מספר כרטיס</label>
                                            <input
                                                {...register('cardNumber')}
                                                type="text" placeholder="#### #### #### ####"
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                                    val = val.match(/.{1,4}/g)?.join(' ') ?? val;
                                                    e.target.value = val;
                                                }}
                                                className={`w-full bg-stone-50/50 border-2 ${errors.cardNumber ? 'border-red-100' : 'border-stone-50 focus:border-[#CAB3A3]/50'} focus:bg-white rounded-[1.5rem] p-5 text-sm transition-all outline-none font-serif font-black tracking-widest text-center`}
                                            />
                                            {errors.cardNumber && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.cardNumber as any).message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-10 border-t border-stone-100 flex justify-between items-center flex-row-reverse">
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-[#2D1B14] text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-black hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-3 space-x-reverse text-lg"
                                    >
                                        <span>המשך ל{step === 1 ? 'כתובת משלוח' : 'אמצעי תשלום'}</span>
                                        <ChevronRight className="w-6 h-6 rotate-180" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg-[#2D1B14] text-white px-14 py-5 rounded-2xl font-black shadow-[0_20px_40px_rgba(45,27,20,0.3)] hover:bg-black hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-3 space-x-reverse text-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span>{isSubmitting ? 'מעבד תשלום...' : `אשר ושלם ₪${total.toFixed(0)}`}</span>
                                    </button>
                                )}
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(step - 1)} className="text-stone-400 hover:text-[#2D1B14] font-black text-sm uppercase tracking-widest transition-colors flex items-center">
                                        שלב הקודם
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-[#2D1B14] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#CAB3A3]/5 rounded-full blur-[100px]" />
                            <h3 className="text-3xl font-serif font-bold mb-10 relative z-10 text-right">סיכום הזמנה</h3>
                            <div className="space-y-8 relative z-10 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group flex-row-reverse">
                                        <div className="flex items-center space-x-5 space-x-reverse">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-xl mb-1">{item.name}</p>
                                                <p className="text-[#CAB3A3] text-[10px] uppercase font-black tracking-[0.2em]">{item.quantity} × ₪{item.price.toFixed(0)}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-xl">₪{(item.price * item.quantity).toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/10 space-y-6 relative z-10">
                                <div className="flex justify-between text-white/50 text-xs font-black uppercase tracking-[0.2em] flex-row-reverse">
                                    <span>סיכום פריטים</span>
                                    <span>₪{total.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/50 text-xs font-black uppercase tracking-[0.2em] flex-row-reverse">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Truck className="w-4 h-4" />
                                        <span>דמי משלוח</span>
                                    </div>
                                    <span className="text-green-400 font-black">חינם</span>
                                </div>
                                <div className="pt-8 flex justify-between items-end flex-row-reverse border-t border-white/5">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-2">סה״כ לתשלום</p>
                                        <p className="text-5xl font-black text-[#CAB3A3]">₪{total.toFixed(0)}</p>
                                    </div>
                                    <ShieldCheck className="w-10 h-10 opacity-30 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
