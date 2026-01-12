'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Coffee, Mail, Linkedin, Github, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamClient() {
    const teamMembers = [
        {
            name: 'דניאל כהן',
            role: 'מייסד ומנכ"ל',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            bio: 'בריסטה מוסמך עם 15 שנות ניסיון בעולם הקפה. חולם על חיבור בין טכנולוגיה לאומנות הקפה.',
            email: 'daniel@thedigitalroast.co.il',
            linkedin: '#',
            specialty: 'קפה ספיישלטי'
        },
        {
            name: 'מיכל לוי',
            role: 'מנהלת פיתוח AI',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            bio: 'מומחית בתחום הבינה המלאכותית ולמידת מכונה. אחראית על פיתוח הבריסטה הדיגיטלי שלנו.',
            email: 'michal@thedigitalroast.co.il',
            linkedin: '#',
            specialty: 'AI & Machine Learning'
        },
        {
            name: 'יונתן אברהם',
            role: 'ראש צוות קליה',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
            bio: 'קלאי מנוסה שמקפיד על בחירת הפולים הטובים ביותר מכל רחבי העולם.',
            email: 'yonatan@thedigitalroast.co.il',
            linkedin: '#',
            specialty: 'קליית פולי קפה'
        },
        {
            name: 'שירה מזרחי',
            role: 'מעצבת חוויית לקוח',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
            bio: 'אחראית על יצירת חוויית המשתמש המושלמת - מהמסך ועד הספל.',
            email: 'shira@thedigitalroast.co.il',
            linkedin: '#',
            specialty: 'UX/UI Design'
        },
        {
            name: 'עומר גולן',
            role: 'מנהל שרשרת אספקה',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            bio: 'דואג שהקפה שלכם יגיע טרי ובזמן, בכל פעם מחדש.',
            email: 'omer@thedigitalroast.co.il',
            linkedin: '#',
            specialty: 'Logistics & Operations'
        },
        {
            name: 'תמר אביב',
            role: 'מנהלת שיווק ותוכן',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
            bio: 'מספרת את הסיפור של הקפה שלנו בצורה שמחממת את הלב (והכוס).',
            email: 'tamar@thedigitalroast.co.il',
            linkedin: '#',
            specialty: 'Marketing & Content'
        }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#FDFCF0] to-stone-100" dir="rtl">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#2D1B14] via-[#3E2723] to-[#2D1B14] py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/coffee-beans.png')] opacity-10" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center p-4 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6 backdrop-blur-xl">
                            <Heart className="w-8 h-8 text-amber-400" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                            הצוות שלנו
                        </h1>

                        <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
                            אנשי המקצוע שמביאים את הקפה שלך לחיים - משדה הפולים ועד לתמונת ה-AI המושלמת
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-12 shadow-2xl border border-stone-100 text-center"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-6">
                        <Award className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D1B14] mb-6">
                        החזון שלנו
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto">
                        ב-The Digital Roast, אנחנו משלבים בין אומנות הקפה המסורתית לבין הטכנולוגיה המתקדמת ביותר.
                        המטרה שלנו היא ליצור חוויית קפה ייחודית שמחברת בין איכות פרימיום, יצירתיות דיגיטלית ושירות אישי.
                        אנחנו לא רק מוכרים קפה - אנחנו יוצרים קהילה של חובבי קפה שחולקים את התשוקה שלנו.
                    </p>
                </motion.div>
            </section>

            {/* Team Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-stone-100 hover:shadow-2xl transition-shadow group"
                        >
                            {/* Image */}
                            <div className="relative h-72 overflow-hidden bg-stone-200">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Specialty Badge */}
                                <div className="absolute bottom-4 right-4">
                                    <span className="inline-block bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-[#2D1B14]">
                                        {member.specialty}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 text-right">
                                <h3 className="text-2xl font-serif font-bold text-[#2D1B14] mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-amber-600 font-bold uppercase tracking-wider mb-4">
                                    {member.role}
                                </p>
                                <p className="text-stone-600 leading-relaxed mb-6 text-sm">
                                    {member.bio}
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-end gap-3">
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="p-2 bg-stone-100 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
                                        title="שלח מייל"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        className="p-2 bg-stone-100 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                        title="LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-[#2D1B14] to-[#4A2C21] rounded-[3rem] p-12 text-center text-white shadow-2xl"
                >
                    <Coffee className="w-16 h-16 mx-auto mb-6 text-amber-400" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        רוצים להצטרף אלינו?
                    </h2>
                    <p className="text-lg text-stone-300 mb-8 max-w-2xl mx-auto">
                        אנחנו תמיד מחפשים אנשי מקצוע מוכשרים שחולקים את התשוקה שלנו לקפה ולחדשנות.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-white text-[#2D1B14] px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        צור קשר איתנו
                    </a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
