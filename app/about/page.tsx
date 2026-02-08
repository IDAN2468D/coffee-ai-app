'use client';

import React from 'react';
import Navbar from '@/components/AppNavbar';
import Footer from '@/components/AppFooter';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-sans text-right" dir="rtl">
            <Navbar />

            <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto space-y-16">

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center md:text-right"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-[#2D1B14] mb-6 tracking-tight">
                        הסיפור של <span className="text-[#C37D46]">סייבר בריסטה</span>
                    </h1>
                    <p className="text-2xl text-stone-500 font-light leading-relaxed max-w-3xl mr-auto ml-0">
                        איפה שמסורת הקלייה העתיקה פוגשת את עתיד הבינה המלאכותית.
                    </p>
                </motion.div>

                {/* Main Content Split */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-3xl font-serif font-bold text-[#2D1B14] mb-3">החזון שלנו</h2>
                            <p className="text-lg text-stone-600 leading-loose">
                                הכל התחיל משאלה פשוטה: מה אם המכונה לא רק תכין את הקפה, אלא גם תבין אותו?
                                בסייבר בריסטה, אנחנו מחברים בין אהבה עמוקה לפולי הקפה לבין טכנולוגיית AI, כדי ליצור חוויה אישית, מדויקת ומרגשת לכל לגימה.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-3xl font-serif font-bold text-[#2D1B14] mb-3">איכות ללא פשרות</h2>
                            <p className="text-lg text-stone-600 leading-loose">
                                האלגוריתמים שלנו יודעים לנתח פרופילי טעם, אבל הטעם עצמו מגיע מהאדמה. אנחנו עובדים עם מגדלים נבחרים בשיטות סחר הוגן, ומבטיחים שכל פול שנכנס למכונה שלכם עבר את המבחנים המחמירים ביותר - האנושיים והדיגיטליים כאחד.
                            </p>
                        </section>
                    </div>

                    {/* Visuals */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600"
                            className="rounded-3xl shadow-xl w-full h-64 object-cover transform md:translate-y-8"
                            alt="Coffee Shop Vibe"
                        />
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600"
                            className="rounded-3xl shadow-xl w-full h-64 object-cover"
                            alt="Barista Pouring"
                        />
                    </div>
                </div>

                {/* Values Banner */}
                <div className="bg-[#F9F5F1] rounded-[3rem] p-12 text-center md:text-right grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="text-4xl mb-4">🌱</div>
                        <h3 className="text-xl font-bold text-[#2D1B14] mb-2">קיימות</h3>
                        <p className="text-stone-500">אריזות מתכלות ותמיכה בחקלאות ירוקה.</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold text-[#2D1B14] mb-2">חדשנות</h3>
                        <p className="text-stone-500">בינה מלאכותית שמתאימה לכם את הבלנד המושלם.</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">☕</div>
                        <h3 className="text-xl font-bold text-[#2D1B14] mb-2">אהבה</h3>
                        <p className="text-stone-500">כי בסוף, הכל מתחיל ונגמר בטעם.</p>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
