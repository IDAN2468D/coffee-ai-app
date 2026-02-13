'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection() {
    return (
        <section id="about" className="py-24 bg-[#F8F8F8] relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Images Collage - Will appear on Right in RTL if first child */}
                <div className="relative h-[600px] w-full hidden lg:block">
                    {/* Main Image */}
                    <div className="absolute top-10 right-10 w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl z-20">
                        <Image
                            src="https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&q=80&w=800"
                            fill
                            className="object-cover"
                            alt="Latte Art"
                        />
                    </div>
                    {/* Secondary Image */}
                    <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-xl z-10">
                        <Image
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"
                            fill
                            className="object-cover"
                            alt="Coffee Beans"
                        />
                    </div>
                    {/* Splash Effect (Simplified as blob) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C37D46]/10 rounded-full blur-[100px] -z-10" />
                </div>

                {/* Content */}
                <div className="space-y-8 text-center lg:text-right">
                    <h2 className="text-5xl font-serif font-bold text-[#2D1B14]">אודותינו</h2>
                    <p className="text-stone-500 leading-loose text-lg font-light">
                        בסייבר בריסטה (Cyber Barista), אנו מאמינים שקפה הוא יותר מסתם משקה - הוא טקס יומי, רגע של נחת וחוויה חושית מלאה. המומחים שלנו בוחרים בקפידה את הפולים האיכותיים ביותר מחוות בנות קיימא ברחבי העולם, כדי להבטיח שכל לגימה תהיה מושלמת.
                    </p>
                    <p className="text-stone-500 leading-loose text-lg font-light hidden md:block">
                        בין אם אתם חושקים באספרסו עוצמתי או בחליטה עדינה, הבריסטות הדיגיטליים שלנו כאן כדי ליצור עבורכם את הכוס המדויקת. הצטרפו אלינו למסע של טעם, ארומה וחדשנות.
                    </p>

                    <div className="pt-4">
                        <Link href="/about" className="inline-block bg-[#2D1B14] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#C37D46] transition-colors shadow-lg">
                            קרא עוד
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Image for smaller screens */}
            <div className="lg:hidden mt-12 px-6 relative aspect-square">
                <Image
                    src="https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&q=80&w=800"
                    fill
                    className="object-cover rounded-[3rem] shadow-xl"
                    alt="Latte Art"
                />
            </div>

        </section>
    );
}
