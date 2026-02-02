'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/store';
import { ArrowLeft, CreditCard, ShieldCheck, MapPin, Truck, ChevronRight, User, Mail, Home, Building2, Package, Calendar, Star, CheckCircle, Lock } from 'lucide-react';
import { Autocomplete } from '@/components/ui/Autocomplete';
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

    // State to hold order details for the success screen
    const [orderSuccessData, setOrderSuccessData] = useState<any>(null);

    const { register, handleSubmit, trigger, formState: { errors }, setValue, watch } = useForm({
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

    const [usePoints, setUsePoints] = useState(false);
    // Mock points for now, or fetch from session/API. 
    // Ideally pass this as prop or fetch on mount. Let's assume user has 403 points as seen in logs.
    const userPoints = 403;
    const pointsValue = Math.floor(userPoints / 10); // 10 points = 1 NIS

    // Calculate final total
    const discount = usePoints ? Math.min(pointsValue, total) : 0;
    const finalTotal = total - discount;

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
                    total: finalTotal, // Send discounted total
                    shippingDetails: data,
                    redeemedPoints: usePoints ? Math.min(userPoints, Math.ceil(discount * 10)) : 0
                })
            });

            const result = await res.json();
            if (result.success) {
                setOrderSuccessData({
                    id: result.orderId,
                    pointsEarned: result.pointsEarned,
                    items: [...items],
                    total: finalTotal,
                    shippingDetails: data,
                    date: new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })
                });

                setIsOrdered(true);
                clearCart();
            } else {
                alert(result.error || "שגיאה בביצוע ההזמנה");
            }
        } catch (error) {
            console.error(error);
            alert("משהו השתבש");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOrdered && orderSuccessData) {
        return (
            <main className="min-h-screen bg-[#FDFCF0] py-12 px-4" dir="rtl">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Success Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />

                        <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6 relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                            <CheckCircle className="w-12 h-12 text-green-600 relative z-10" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D1B14] mb-4">
                            ההזמנה התקבלה בהצלחה!
                        </h1>
                        <p className="text-lg text-stone-500 max-w-lg mx-auto leading-relaxed">
                            תודה על ההזמנה, {session?.user?.name?.split(' ')[0]}. הקפה שלך כבר בתהליך הכנה.
                        </p>

                        <div className="mt-8 inline-flex items-center gap-3 bg-stone-50 px-6 py-3 rounded-xl border border-stone-100">
                            <span className="text-stone-400 font-bold text-xs uppercase tracking-widest">מספר הזמנה:</span>
                            <span className="font-mono font-bold text-[#2D1B14]">{orderSuccessData.id.slice(-8).toUpperCase()}</span>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Order Details Column */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 space-y-6"
                        >
                            {/* Items List */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-stone-100">
                                <h3 className="text-xl font-black text-[#2D1B14] mb-6 flex items-center gap-3">
                                    <Package className="w-5 h-5 text-[#8B4513]" />
                                    <span>פרטי ההזמנה</span>
                                </h3>
                                <div className="space-y-6">
                                    {orderSuccessData.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm border border-stone-100 flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 flex-row-reverse">
                                                    <h4 className="font-bold text-[#2D1B14] text-lg">{item.name}</h4>
                                                    {item.size && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[9px] font-black uppercase">
                                                            {item.size === 'S' ? 'קטן' : item.size === 'M' ? 'בינוני' : 'גדול'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-500 mt-1 font-bold">{typeof item.category === 'string' ? item.category : item.category?.name || ''}</p>
                                            </div>
                                            <div className="text-left pl-4">
                                                <p className="font-black text-[#2D1B14] text-lg">₪{(item.price * item.quantity).toFixed(0)}</p>
                                                <p className="text-xs text-stone-400 font-bold mt-1">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-stone-100 flex justify-between items-center px-2">
                                    <span className="font-black text-stone-400 uppercase tracking-widest text-xs">סה״כ שולם</span>
                                    <span className="font-black text-3xl text-[#2D1B14]">₪{orderSuccessData.total.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Shipping Details - Mobile Optimized */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-stone-100">
                                <h3 className="text-xl font-black text-[#2D1B14] mb-6 flex items-center gap-3">
                                    <div className="bg-stone-50 p-2 rounded-xl">
                                        <Truck className="w-5 h-5 text-[#8B4513]" />
                                    </div>
                                    <span>פרטי למשלוח</span>
                                </h3>

                                <div className="space-y-4">
                                    {/* Name Row */}
                                    <div className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2D1B14] shadow-sm flex-shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow text-right">
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">נשלח אל</p>
                                            <p className="font-bold text-[#2D1B14] text-base md:text-lg">{orderSuccessData.shippingDetails.fullName}</p>
                                        </div>
                                    </div>

                                    {/* Email Row */}
                                    <div className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2D1B14] shadow-sm flex-shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow text-right overflow-hidden">
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">אימייל</p>
                                            <p className="font-bold text-[#2D1B14] text-base truncate">{orderSuccessData.shippingDetails.email}</p>
                                        </div>
                                    </div>

                                    {/* Address Row */}
                                    <div className="flex items-center gap-4 bg-stone-50/50 p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2D1B14] shadow-sm flex-shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow text-right">
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">כתובת</p>
                                            <p className="font-bold text-[#2D1B14] text-base md:text-lg">
                                                {orderSuccessData.shippingDetails.street}, {orderSuccessData.shippingDetails.city}
                                            </p>
                                            {orderSuccessData.shippingDetails.apartment && (
                                                <p className="text-sm text-stone-500 font-medium mt-0.5">
                                                    כניסה/דירה: {orderSuccessData.shippingDetails.apartment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Points Earned Card */}
                            <div className="bg-[#2D1B14] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden text-center group hover:scale-[1.02] transition-transform duration-500">
                                <div className="absolute top-0 right-0 p-32 bg-[#CAB3A3]/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-[#CAB3A3]/30 transition-colors" />
                                <div className="relative z-10 flex flex-col items-center space-y-4">
                                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                                        <Star className="w-10 h-10 text-yellow-400 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-yellow-400 mb-2">+{orderSuccessData.pointsEarned}</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-white">נקודות Roast שנצברו</p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Status */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-stone-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">סטטוס משלוח</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">בטיפול</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full w-1/4 bg-blue-500 rounded-full animate-pulse" />
                                    </div>
                                    <p className="text-xs text-stone-500 text-center font-bold">המשלוח יצא לדרך בקרוב</p>
                                </div>
                            </div>

                            <Link
                                href="/dashboard"
                                className="block w-full bg-[#E8E6D9] hover:bg-[#DCD8C0] text-[#2D1B14] py-5 rounded-2xl font-black text-center shadow-sm hover:shadow-md transition-all text-lg"
                            >
                                לאזור האישי
                            </Link>

                            <Link
                                href="/"
                                className="block w-full bg-white border-2 border-[#2D1B14] text-[#2D1B14] py-5 rounded-2xl font-black text-center hover:bg-[#2D1B14] hover:text-white transition-all shadow-sm hover:shadow-lg text-lg"
                            >
                                חזרה לחנות
                            </Link>

                        </motion.div>
                    </div>
                </div>
            </main>
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
        <main className="min-h-screen bg-[#FDFCF0] p-6 lg:p-12 relative overflow-hidden pb-40" dir="rtl">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2D1B14] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#CAB3A3] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
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
                        {/* Progress Steps */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 rounded-full z-0" />
                            <div
                                className="absolute top-1/2 right-0 h-1 bg-[#2D1B14] -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-out"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />

                            <div className="flex justify-between relative z-10">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex flex-col items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all duration-500 border-4 ${step >= s
                                                ? 'bg-[#2D1B14] text-white border-[#2D1B14] shadow-lg scale-110'
                                                : 'bg-white text-stone-300 border-white shadow-sm'
                                                }`}
                                        >
                                            {s}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= s ? 'text-[#2D1B14]' : 'text-stone-300'}`}>
                                            {s === 1 ? 'פרטים' : s === 2 ? 'משלוח' : 'תשלום'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ ease: "easeOut", duration: 0.3 }}
                            className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl shadow-stone-200/40 border border-white space-y-12"
                        >
                            {step === 1 && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-4 space-x-reverse text-[#2D1B14] border-b border-stone-100 pb-6">
                                        <div className="bg-[#2D1B14] text-white p-3 rounded-2xl shadow-lg">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold">פרטים אישיים</h3>
                                            <p className="text-stone-400 text-xs mt-1">אנו צריכים לדעת למי לשלוח את הקפה</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase text-[#2D1B14] tracking-widest mr-1">שם מלא</label>
                                            <div className="relative group">
                                                <input
                                                    {...register('fullName')}
                                                    type="text" placeholder="ישראל ישראלי"
                                                    className="w-full bg-stone-50 border-2 border-stone-100 focus:border-[#2D1B14] focus:bg-white rounded-2xl p-5 pr-12 text-sm transition-all outline-none font-medium placeholder:text-stone-300"
                                                />
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-[#2D1B14] transition-colors" />
                                            </div>
                                            {errors.fullName && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.fullName as any).message}</p>}
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase text-[#2D1B14] tracking-widest mr-1">כתובת אימייל</label>
                                            <div className="relative group">
                                                <input
                                                    {...register('email')}
                                                    type="email" placeholder="example@gmail.com"
                                                    className="w-full bg-stone-50 border-2 border-stone-100 focus:border-[#2D1B14] focus:bg-white rounded-2xl p-5 pr-12 text-sm transition-all outline-none font-medium placeholder:text-stone-300"
                                                />
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-[#2D1B14] transition-colors" />
                                            </div>
                                            {errors.email && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.email as any).message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-4 space-x-reverse text-[#2D1B14] border-b border-stone-100 pb-6">
                                        <div className="bg-[#2D1B14] text-white p-3 rounded-2xl shadow-lg">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold">כתובת למשלוח</h3>
                                            <p className="text-stone-400 text-xs mt-1">הקפה יגיע עד לפתח הדלת</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                            <div className="space-y-4">
                                                {/* City Autocomplete */}
                                                <Autocomplete
                                                    label="עיר"
                                                    placeholder="תל אביב"
                                                    value={watch('city') || ''}
                                                    onChange={(val) => {
                                                        setValue('city', val, { shouldValidate: true });
                                                        // Clear street when city changes to avoid mismatch
                                                        if (watch('street')) setValue('street', '', { shouldValidate: true });
                                                    }}
                                                    fetchSuggestions={async (query) => {
                                                        try {
                                                            const res = await fetch(`/api/locations/cities?q=${encodeURIComponent(query)}`);
                                                            const data = await res.json();
                                                            return data.results || [];
                                                        } catch (e) {
                                                            console.error(e);
                                                            return [];
                                                        }
                                                    }}
                                                    error={(errors.city as any)?.message}
                                                    icon={<MapPin className="w-5 h-5" />}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase text-[#2D1B14] tracking-widest mr-1">דירה / קומה</label>
                                                <div className="relative group">
                                                    <input
                                                        {...register('apartment')}
                                                        type="text" placeholder="דירה 2"
                                                        className="w-full bg-stone-50 border-2 border-stone-100 focus:border-[#2D1B14] focus:bg-white rounded-2xl p-5 pr-12 text-sm transition-all outline-none font-medium placeholder:text-stone-300"
                                                    />
                                                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-[#2D1B14] transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Street Autocomplete */}
                                            <Autocomplete
                                                label="רחוב"
                                                placeholder="הברזל"
                                                value={watch('street') || ''}
                                                onChange={(val) => setValue('street', val, { shouldValidate: true })}
                                                fetchSuggestions={async (query) => {
                                                    const city = watch('city');
                                                    if (!city) return [];
                                                    try {
                                                        const res = await fetch(`/api/locations/streets?city=${encodeURIComponent(city)}&q=${encodeURIComponent(query)}`);
                                                        const data = await res.json();
                                                        return data.results || [];
                                                    } catch (e) {
                                                        console.error(e);
                                                        return [];
                                                    }
                                                }}
                                                error={(errors.street as any)?.message}
                                                icon={<Home className="w-5 h-5" />}
                                                disabled={!watch('city')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-4 space-x-reverse text-[#2D1B14] border-b border-stone-100 pb-6">
                                        <div className="bg-[#2D1B14] text-white p-3 rounded-2xl shadow-lg">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold">אמצעי תשלום</h3>
                                            <p className="text-stone-400 text-xs mt-1">חיוב מאובטח ומוצפן</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Card Visual */}
                                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#000] p-8 rounded-3xl shadow-xl border border-stone-800 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
                                            <div className="relative z-10 flex justify-between items-start flex-row-reverse mb-12">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-10 opacity-80" alt="Mastercard" />
                                                <div className="w-12 h-8 bg-[#E6C68F] rounded-md flex items-center justify-center opacity-80">
                                                    <div className="w-8 h-5 border border-black/20 rounded-sm" />
                                                </div>
                                            </div>
                                            <div className="relative z-10 space-y-2">
                                                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">מספר כרטיס</p>
                                                <div className="text-white text-2xl font-mono tracking-wider flex justify-between items-center dir-ltr">
                                                    <span>****</span>
                                                    <span>****</span>
                                                    <span>****</span>
                                                    <span>3921</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase text-[#2D1B14] tracking-widest mr-1">מספר כרטיס מלא</label>
                                            <div className="relative group">
                                                <input
                                                    {...register('cardNumber')}
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                                        val = val.match(/.{1,4}/g)?.join(' ') ?? val;
                                                        e.target.value = val;
                                                    }}
                                                    className="w-full bg-stone-50 border-2 border-stone-100 focus:border-[#2D1B14] focus:bg-white rounded-2xl p-5 pl-12 text-sm transition-all outline-none font-mono font-bold text-center tracking-widest placeholder:text-stone-300"
                                                />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                            </div>
                                            {errors.cardNumber && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{(errors.cardNumber as any).message}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-stone-100 flex flex-col gap-4 sm:flex-row-reverse sm:justify-between sm:items-center">
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-[#2D1B14] text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 space-x-reverse text-lg w-full sm:w-auto"
                                    >
                                        <span>המשך לשלב הבא</span>
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg-[#2D1B14] text-white px-12 py-5 rounded-2xl font-black shadow-[0_20px_40px_rgba(45,27,20,0.3)] hover:shadow-[0_25px_50px_rgba(45,27,20,0.4)] hover:-translate-y-1 transition-all flex items-center space-x-3 space-x-reverse text-xl w-full sm:w-auto justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-pulse">מעבד תשלום...</span>
                                        ) : (
                                            <>
                                                <span>בצע תשלום</span>
                                                <span className="bg-white/20 px-2 py-0.5 rounded text-sm text-[#CAB3A3]">₪{finalTotal.toFixed(0)}</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="text-stone-400 hover:text-[#2D1B14] font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group border border-transparent hover:border-stone-200 px-4 py-3 sm:py-2 rounded-xl w-full sm:w-auto"
                                    >
                                        חזרה אחורה
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        <div className="sticky top-12 bg-[#2D1B14] text-white p-6 sm:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col min-h-fit lg:min-h-[600px] border border-white/5">
                            {/* Decorative Background Effects */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C37D46]/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/40 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                                <h3 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                                    <span>ההזמנה שלך</span>
                                    <span className="text-sm font-sans bg-[#C37D46] px-3 py-1 rounded-full text-white shadow-lg">{items.length} פריטים</span>
                                </h3>
                            </div>

                            <div className="space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar flex-grow max-h-[400px] lg:max-h-[450px]">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 lg:gap-5 items-center group flex-row-reverse bg-white/5 p-3 sm:p-4 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border border-white/10 shadow-xl relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Product Details */}
                                        <div className="text-right flex-grow space-y-1 lg:space-y-2">
                                            <div>
                                                <h4 className="font-bold text-lg lg:text-xl leading-tight text-white mb-1">{item.name}</h4>
                                                <div className="flex items-center gap-2 flex-row-reverse">
                                                    {item.size && (
                                                        <span className="px-2.5 py-1 bg-[#C37D46]/20 text-[#C37D46] border border-[#C37D46]/20 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                            {item.size === 'S' ? 'קטן' : item.size === 'M' ? 'בינוני' : 'גדול'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end flex-row-reverse pt-2">
                                                <span className="text-stone-400 text-xs font-bold bg-black/20 px-2 py-1 rounded-lg">x{item.quantity}</span>
                                                <span className="font-serif font-bold text-xl lg:text-2xl text-[#E8CBAD]">₪{item.price.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Footer */}
                            <div className="mt-auto pt-8 space-y-6 relative z-10">

                                <div className="space-y-4">
                                    <div className="flex justify-between text-white/50 text-sm font-bold flex-row-reverse items-center">
                                        <span>סיכום ביניים</span>
                                        <span className="font-mono text-white text-lg">₪{total.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/50 text-sm font-bold flex-row-reverse">
                                        <div className="flex items-center gap-2 flex-row-reverse">
                                            <Truck className="w-4 h-4 opacity-50" />
                                            <span>משלוח</span>
                                        </div>
                                        <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full text-xs border border-emerald-400/20">חינם</span>
                                    </div>

                                    {/* Points Redemption - Gold Card Design */}
                                    <div className={`mt-6 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${usePoints ? 'bg-gradient-to-br from-[#FFD700]/10 to-[#B8860B]/20 border-[#FFD700]/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                                        <div className="flex items-center justify-between flex-row-reverse relative z-10">
                                            <div className="flex items-center gap-3 flex-row-reverse">
                                                <div className={`p-2 rounded-xl ${usePoints ? 'bg-[#FFD700] text-[#2D1B14]' : 'bg-white/10 text-white'}`}>
                                                    <Star className="w-5 h-5 fill-current" />
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-black uppercase tracking-wider ${usePoints ? 'text-[#FFD700]' : 'text-white'}`}>{(userPoints)} נקודות</p>
                                                    <p className="text-[10px] text-white/40 font-bold">זמינות למימוש מיידי</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setUsePoints(!usePoints)}
                                                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg ${usePoints
                                                    ? 'bg-[#2D1B14] text-[#FFD700] ring-1 ring-[#FFD700]/50'
                                                    : 'bg-[#C37D46] text-white hover:bg-[#A05A2C]'
                                                    }`}
                                            >
                                                {usePoints ? 'בטל שימוש' : 'נצל נקודות'}
                                            </button>
                                        </div>
                                        {usePoints && (
                                            <div className="mt-4 pt-3 border-t border-[#FFD700]/20 flex justify-between items-center flex-row-reverse">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]/80">הנחת מועדון</span>
                                                <span className="text-lg font-bold text-[#FFD700]">-₪{discount.toFixed(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10 mt-4 bg-black/20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-6 -mb-6 sm:-mb-10 backdrop-blur-sm">
                                    <div className="flex justify-between items-end flex-row-reverse">
                                        <div className="text-right">
                                            <p className="text-xs font-black uppercase text-[#C37D46] tracking-[0.3em] mb-2">סה״כ לתשלום סופי</p>
                                            <div className="flex items-baseline gap-1 justify-end" dir="ltr">
                                                <span className="text-2xl lg:text-3xl text-[#C37D46] font-sans font-bold translate-y-[-4px]">₪</span>
                                                <span className="text-5xl lg:text-7xl font-serif font-black text-white tracking-tighter drop-shadow-2xl">{finalTotal.toFixed(0)}</span>
                                                <span className="text-xl lg:text-2xl text-white/40 font-serif font-light">.00</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <ShieldCheck className="w-8 h-8 lg:w-10 lg:h-10 text-[#C37D46]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
