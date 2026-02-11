'use client';

import React, { useState } from 'react';
import Navbar from "@/components/TempNavbar";
import Footer from "@/components/AppFooter";
import { Check, Sparkles, Star, Crown, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SubscriptionPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loadingTier, setLoadingTier] = useState<string | null>(null);

    const handleSubscribe = async (tier: string) => {
        if (!session) {
            router.push('/auth/login?callbackUrl=/subscription');
            return;
        }

        setLoadingTier(tier);
        try {
            const res = await fetch('/api/subscription/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: tier.toUpperCase() === 'SILVER' ? 'BASIC' : 'PRO' })
            });

            if (!res.ok) throw new Error('Subscription failed');

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error(error);
            // innovative error handling could go here
        } finally {
            setLoadingTier(null);
        }
    };

    const tiers = [
        {
            name: 'Silver',
            price: 59,
            icon: Star,
            color: 'text-stone-400',
            bgColor: 'bg-stone-400/10',
            borderColor: 'border-stone-400/20',
            features: [
                'משלוח חינם בהזמנות מעל 200₪',
                '5% הנחה קבועה על כל האתר',
                'גישה לבלוג המומחים',
                'גישה למיקסר הסאונד (AI Ambience)'
            ]
        },
        {
            name: 'Gold',
            price: 99,
            popular: true,
            icon: Zap,
            color: 'text-[#C37D46]',
            bgColor: 'bg-[#C37D46]/10',
            borderColor: 'border-[#C37D46]/40',
            features: [
                'משלוח חינם ללא מינימום',
                '10% הנחה קבועה על כל האתר',
                'קדימות במשלוח (משלוח מהיר)',
                'מתנה קטנה בכל הזמנה חודשית',
                'גישה לאורקל המזל (Fortune Oracle)'
            ]
        },
        {
            name: 'Platinum',
            price: 149,
            icon: Crown,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            features: [
                'כל הטבות ה-Gold',
                '15% הנחה קבועה על כל האתר',
                'ייעוץ אישי עם בריסטה מומחה',
                'גישה מוקדמת למוצרים חדשים',
                'מארז טעימות חודשי חינם',
                'גישה ליומן הקפאין החכם (Tracker)',
                'גישה לדרכון הקפה (Coffee Passport)'
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-24">

                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#C37D46]/10 px-4 py-2 rounded-full border border-[#C37D46]/20 text-[#C37D46]">
                        <Sparkles size={18} />
                        <span className="text-sm font-bold tracking-widest uppercase">מועדון החברים</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-black text-[#2D1B14] tracking-tight">
                        שדרג את חווית ה<span className="text-[#C37D46]">קפה</span> שלך
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
                        בחר את המסלול המתאים לך ותהנה מהטבות בלעדיות, הנחות קבועות ופינוקים מיוחדים לחברי המועדון.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative bg-white rounded-[2.5rem] p-8 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl border ${tier.popular ? 'border-[#C37D46] shadow-xl scale-105 z-10' : 'border-stone-100 shadow-lg'}`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C37D46] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg">
                                    הכי משתלם
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tier.bgColor} ${tier.color}`}>
                                <tier.icon size={28} />
                            </div>

                            <h3 className="text-2xl font-black text-[#2D1B14] mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-[#2D1B14]">₪{tier.price}</span>
                                <span className="text-stone-400 text-sm">/חודש</span>
                            </div>

                            <button
                                onClick={() => handleSubscribe(tier.name)}
                                disabled={loadingTier !== null}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tier.popular
                                    ? 'bg-[#2D1B14] text-white hover:bg-black'
                                    : 'bg-stone-100 text-[#2D1B14] hover:bg-stone-200'
                                    }`}
                            >
                                {loadingTier === tier.name ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        הצטרף ל-{tier.name}
                                        <Check size={18} />
                                    </>
                                )}
                            </button>

                            <div className="mt-8 space-y-4">
                                {tier.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-stone-600">
                                        <div className={`mt-1 min-w-[1.25rem] h-5 rounded-full flex items-center justify-center ${tier.bgColor}`}>
                                            <Check size={12} className={tier.color} />
                                        </div>
                                        <span className="text-sm leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
