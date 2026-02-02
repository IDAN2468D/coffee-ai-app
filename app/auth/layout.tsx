import React from 'react';
import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/coffee-beans.png')]" dir="rtl">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(45,27,20,0.1)] overflow-hidden border border-stone-100 min-h-[600px]">

                {/* Decorative Side - Shared across all auth pages */}
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

                        {/* This area can be dynamic or static depending on design preference. 
                            For now, we'll keep it static or rely on the page to project content here if we used a slot, 
                            but for simplicity we'll keep generic welcoming text here or just the visual branding. 
                        */}
                        <div className="space-y-6">
                            <h2 className="text-5xl font-serif font-bold leading-tight">
                                חווית קפה<br />מהעתיד
                            </h2>
                            <p className="text-white/60 text-lg font-light leading-relaxed">
                                הצטרפו לקהילת חובבי הקפה שלנו ותיהנו מקלייה טרייה, התאמה אישית ב-AI ומשלוחים עד הבית.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/10">
                        <p className="text-sm font-bold uppercase tracking-widest opacity-40">נוסד ב-2026 - Digital Roast</p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="p-10 lg:p-20 flex flex-col justify-center text-right relative">
                    {children}
                </div>
            </div>
        </main>
    );
}
