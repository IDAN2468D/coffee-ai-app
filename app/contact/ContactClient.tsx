'use client';

import React, { useState } from 'react';
import Navbar from '../../components/AppNavbar';
import { Phone, Mail, MapPin, Clock, Send, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactClient() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            alert('הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: Phone,
            title: 'טלפון',
            details: ['054-123-4567', '03-123-4567'],
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: Mail,
            title: 'דוא״ל',
            details: ['info@thedigitalroast.co.il', 'support@thedigitalroast.co.il'],
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: MapPin,
            title: 'כתובת',
            details: ['רחוב הברזל 1', 'תל אביב, ישראל'],
            color: 'from-red-500 to-rose-600'
        },
        {
            icon: Clock,
            title: 'שעות פעילות',
            details: ['א׳-ה׳: 08:00-20:00', 'ו׳: 08:00-15:00', 'שבת: סגור'],
            color: 'from-purple-500 to-violet-600'
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
                            <Coffee className="w-8 h-8 text-amber-400" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                            צור קשר
                        </h1>

                        <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
                            יש לך שאלה? רעיון? או סתם רוצה לדבר על קפה? נשמח לשמוע ממך! ☕
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100 hover:shadow-2xl transition-shadow"
                        >
                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${info.color} mb-4`}>
                                <info.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-[#2D1B14] mb-3">
                                {info.title}
                            </h3>

                            <div className="space-y-2">
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-stone-600 text-sm">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-stone-100"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D1B14] mb-3 text-center">
                        שלח לנו הודעה
                    </h2>

                    <p className="text-stone-600 text-center mb-10">
                        מלא את הטופס ונחזור אליך בהקדם האפשרי
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#2D1B14] mb-2">
                                שם מלא *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-amber-500 focus:bg-white outline-none transition-all"
                                placeholder="הכנס את שמך המלא"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#2D1B14] mb-2">
                                    אימייל *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-amber-500 focus:bg-white outline-none transition-all"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#2D1B14] mb-2">
                                    טלפון
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-amber-500 focus:bg-white outline-none transition-all"
                                    placeholder="054-123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#2D1B14] mb-2">
                                הודעה *
                            </label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={6}
                                className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-amber-500 focus:bg-white outline-none transition-all resize-none"
                                placeholder="כתוב את ההודעה שלך כאן..."
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    שולח...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    שלח הודעה
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </section>

            {/* Map Section (Optional) */}
            <section className="bg-gradient-to-br from-stone-100 to-stone-200 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-[#2D1B14] mb-4">
                            בואו לבקר אותנו
                        </h2>
                        <p className="text-stone-600 text-lg">
                            נשמח לראותכם בבית הקלייה שלנו
                        </p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-4 shadow-2xl">
                        <div className="bg-stone-200 rounded-[2.5rem] h-96 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                                <p className="text-stone-600 font-medium">
                                    מפה תוצג כאן
                                </p>
                                <p className="text-sm text-stone-400 mt-2">
                                    (ניתן להוסיף אינטגרציה עם Google Maps)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
