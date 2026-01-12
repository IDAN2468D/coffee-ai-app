'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, UserCheck, Cookie, Mail, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyClient() {
    const sections = [
        {
            icon: UserCheck,
            title: 'איסוף מידע',
            content: `אנחנו אוספים מידע אישי שאתם מספקים לנו בעת יצירת חשבון, ביצוע הזמנה או שימוש בשירותי ה-AI שלנו. המידע כולל: שם, כתובת אימייל, כתובת למשלוח, ופרטי תשלום. בנוסף, אנחנו אוספים מידע טכני כמו כתובת IP, סוג דפדפן והתנהגות באתר כדי לשפר את החוויה שלכם.`
        },
        {
            icon: Lock,
            title: 'שימוש במידע',
            content: `המידע שאנו אוספים משמש אותנו לעיבוד הזמנות, שיפור השירות, התאמה אישית של חוויית המשתמש, ושליחת עדכונים רלוונטיים. אנחנו משתמשים בבינה מלאכותית כדי לספק לכם המלצות מותאמות אישית ולשפר את יצירות ה-AI שלכם. המידע שלכם לעולם לא ימכר לצדדים שלישיים למטרות שיווק.`
        },
        {
            icon: Shield,
            title: 'אבטחת מידע',
            content: `אנחנו נוקטים באמצעי אבטחה מתקדמים כדי להגן על המידע האישי שלכם. זה כולל הצפנת SSL/TLS, אחסון מאובטח במסדי נתונים מוגנים, והגבלת גישה למידע רק לעובדים מורשים. פרטי התשלום שלכם מעובדים דרך ספקי תשלום מאובטחים ואינם נשמרים בשרתים שלנו.`
        },
        {
            icon: Cookie,
            title: 'קובצי Cookie',
            content: `האתר שלנו משתמש בקובצי Cookie כדי לשפר את חוויית הגלישה, לזכור העדפות משתמש ולנתח תנועה באתר. אתם יכולים לנהל את העדפות ה-Cookie דרך הדפדפן שלכם. חלק מהשירותים עשויים לא לעבוד כראוי ללא Cookie מסוימים.`
        },
        {
            icon: Eye,
            title: 'שיתוף מידע',
            content: `אנחנו עשויים לשתף מידע עם ספקי שירות חיצוניים הנחוצים לתפעול העסק (כמו עיבוד תשלומים, משלוחים ושירותי דואר אלקטרוני). כל הספקים חתומים על הסכמי סודיות ומחויבים להגן על המידע שלכם. במקרים הנדרשים על פי חוק, אנו עשויים למסור מידע לרשויות.`
        },
        {
            icon: FileText,
            title: 'הזכויות שלכם',
            content: `יש לכם זכות לגשת למידע האישי שלכם, לעדכן אותו, למחוק אותו או להגביל את השימוש בו. אתם יכולים גם לבקש העתק של המידע שלכם בפורמט נגיש. ליצירת קשר בנושא זכויות אלו, פנו אלינו דרך דף "צור קשר". אנו מתחייבים לענות לבקשות תוך 30 יום.`
        },
        {
            icon: AlertCircle,
            title: 'שינויים במדיניות',
            content: `אנחנו עשויים לעדכן את מדיניות הפרטיות מעת לעת כדי לשקף שינויים בשירותים או בדרישות החוקיות. כל שינוי מהותי יפורסם באתר ויישלח אליכם הודעה באימייל. המשך השימוש באתר לאחר פרסום השינויים מהווה הסכמה למדיניות המעודכנת.`
        },
        {
            icon: Mail,
            title: 'יצירת קשר',
            content: `אם יש לכם שאלות או חששות לגבי מדיניות הפרטיות שלנו, אנחנו כאן כדי לעזור. צרו איתנו קשר בכתובת privacy@thedigitalroast.co.il או דרך טופס יצירת הקשר באתר. אנו מחויבים לשקיפות מלאה ונשמח לענות על כל שאלה.`
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
                        <div className="inline-flex items-center justify-center p-4 bg-green-500/20 border border-green-500/30 rounded-full mb-6 backdrop-blur-xl">
                            <Shield className="w-8 h-8 text-green-400" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                            מדיניות פרטיות
                        </h1>

                        <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
                            אנחנו מחויבים להגן על הפרטיות שלך ולשמור על המידע האישי שלך בצורה מאובטחת
                        </p>

                        <p className="text-sm text-stone-400 mt-4">
                            עדכון אחרון: 12 בינואר 2026
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Summary */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem] p-10 border-2 border-blue-200"
                >
                    <div className="flex items-start gap-4 flex-row-reverse">
                        <div className="p-3 bg-blue-500 rounded-2xl flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-serif font-bold text-[#2D1B14] mb-3">
                                בקצרה
                            </h2>
                            <p className="text-stone-700 leading-relaxed">
                                אנחנו אוספים מידע כדי לספק לך שירות טוב יותר, להגן על המידע שלך באמצעי אבטחה מתקדמים,
                                ולעולם לא נמכור את הפרטים שלך לצדדים שלישיים. יש לך שליטה מלאה על המידע שלך ואתה יכול
                                לבקש לעדכן או למחוק אותו בכל עת.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Main Content */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] p-8 shadow-lg border border-stone-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-start gap-4 flex-row-reverse mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex-shrink-0">
                                    <section.icon className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-[#2D1B14] text-right flex-grow">
                                    {section.title}
                                </h2>
                            </div>
                            <p className="text-stone-600 leading-relaxed text-right">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* GDPR Notice */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-[#2D1B14] to-[#4A2C21] rounded-[3rem] p-10 text-white shadow-2xl"
                >
                    <div className="text-center">
                        <Lock className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                            תאימות ל-GDPR ולחוק הגנת הפרטיות הישראלי
                        </h3>
                        <p className="text-stone-300 leading-relaxed max-w-3xl mx-auto">
                            אנחנו מחויבים לעמוד בתקנות הגנת המידע האירופיות (GDPR) ובחוק הגנת הפרטיות הישראלי.
                            המידע שלך מעובד בהתאם לעקרונות השקיפות, המינימליזציה והאבטחה.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Contact CTA */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <div className="text-center">
                    <p className="text-lg text-stone-600 mb-6">
                        יש לך שאלות נוספות לגבי מדיניות הפרטיות שלנו?
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-[#2D1B14] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        צור קשר איתנו
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
