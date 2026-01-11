'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <section id="about" className="py-24 bg-[#F8F8F8] relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center" dir="ltr">
                {/* Images Collage */}
                <div className="relative h-[600px] w-full hidden lg:block">
                    {/* Main Image */}
                    <div className="absolute top-10 left-10 w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl z-20">
                        <img
                            src="https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover"
                            alt="Latte Art"
                        />
                    </div>
                    {/* Secondary Image */}
                    <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-xl z-10">
                        <img
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"
                            className="w-full h-full object-cover"
                            alt="Coffee Beans"
                        />
                    </div>
                    {/* Splash Effect (Simplified as blob) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C37D46]/10 rounded-full blur-[100px] -z-10" />
                </div>

                {/* Content */}
                <div className="space-y-8 text-center lg:text-left">
                    <h2 className="text-5xl font-serif font-bold text-[#2D1B14]">About Us</h2>
                    <p className="text-stone-500 leading-loose text-lg font-light">
                        At Latte Lane, we believe that coffee is more than just a drink - it's a daily ritual, a moment of pause, and a sensory experience. Our master roasters carefully select the finest beans from sustainable farms around the globe, ensuring that every sip supports both your morning and the planet.
                    </p>
                    <p className="text-stone-500 leading-loose text-lg font-light hidden md:block">
                        Whether you crave a robust espresso or a delicate pour-over, our baristas are artists dedicated to crafting your perfect cup. Join us on a journey of flavor, aroma, and community.
                    </p>

                    <div className="pt-4">
                        <button className="bg-[#2D1B14] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#C37D46] transition-colors shadow-lg">
                            Read More
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Image for smaller screens */}
            <div className="lg:hidden mt-12 px-6">
                <img
                    src="https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&q=80&w=800"
                    className="w-full aspect-square object-cover rounded-[3rem] shadow-xl"
                    alt="Latte Art"
                />
            </div>

        </section>
    );
}
