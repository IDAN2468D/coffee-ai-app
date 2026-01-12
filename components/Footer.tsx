'use client';

import React from 'react';
import { Coffee, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#2D1B14] text-white/80 py-20">
            <div className="max-w-7xl mx-auto px-6" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-20">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3 space-x-reverse text-white">
                            <Coffee className="w-8 h-8" />
                            <span className="text-2xl font-serif font-bold">The Digital Roast</span>
                        </div>
                        <p className="text-lg font-light leading-relaxed">
                            יוצרים שלמות בכל כוס מאז 2026. הצטרפו אלינו לחוויית קפה ייחודית המשלבת מסורת וטכנולוגיה.
                        </p>
                        <div className="flex space-x-4 space-x-reverse pt-4">
                            <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                            <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                            <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest pt-2">שירותים</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><a href="#" className="hover:text-white transition-colors">חנות</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">הזמנות</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">תפריט</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">בלוג</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest pt-2">אודות</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><a href="#" className="hover:text-white transition-colors">בית</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">הצוות שלנו</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">צור קשר</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">פרטיות</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white uppercase tracking-widest pt-2">צור קשר</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li>054-123-4567</li>
                            <li>03-123-4567</li>
                            <li>hello@digitalroast.co.il</li>
                            <li>רחוב הברזל 1, תל אביב, ישראל</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 text-center text-xs font-bold uppercase tracking-[0.3em] opacity-40">
                    כל הזכויות שמורות © 2026, The Digital Roast
                </div>
            </div>
        </footer>
    );
}
