import React from 'react';
import dynamic from 'next/dynamic';
import { IProcessedBranch } from './page';
import { MapPin, Phone, Compass, Coffee, Sparkles, Navigation, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import StoreMap only on the client
const StoreMap = dynamic(() => import('@/components/StoreMap'), {
    loading: () => (
        <div className="h-[500px] w-full bg-stone-900 rounded-3xl flex items-center justify-center border border-white/5">
            <div className="flex flex-col items-center gap-4">
                <Coffee className="w-10 h-10 text-amber-600 animate-bounce" />
                <div className="text-white/40 font-medium tracking-widest text-xs uppercase">הופך סניפים למפה...</div>
            </div>
        </div>
    ),
    ssr: false
});

interface StoresClientProps {
    branches: IProcessedBranch[];
}

export default function StoresClient({ branches }: StoresClientProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0503]" dir="rtl">
            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0503]/50 via-[#0A0503]/80 to-[#0A0503]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-500/30 text-amber-500 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                        <MapPin className="w-3 h-3" />
                        <span>המיקומים שלנו</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-serif tracking-tight">
                        חפשו את <span className="text-amber-500 italic">החוויה</span>
                    </h1>
                    <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Cyber Barista מגיעה לכל מקום בארץ. מצאו את הסניף הקרוב אליכם ותיהנו מקפה שעוצב על ידי בינה מלאכותית.
                    </p>
                </motion.div>
            </section>

            {/* Map Section */}
            <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="p-2 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/50"
                >
                    {branches && branches.length > 0 ? (
                        <StoreMap branches={branches} />
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-stone-500">
                            <div className="text-center">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>לא נמצאו סניפים לעדכון...</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Branches Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <Compass className="text-amber-500 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-serif">רשימת סניפים</h2>
                            <p className="text-stone-500 text-sm">פריסה ארצית מדן ועד אילת</p>
                        </div>
                    </div>
                    <div className="text-stone-600 text-sm font-medium">
                        סה"כ: {branches.length} מיקומים
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {branches.map((branch) => (
                        <motion.div
                            key={branch._id}
                            variants={itemVariants}
                            className="group relative bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-amber-500/50 hover:bg-white/10 transition-all duration-500"
                        >
                            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-900/40">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>

                            <div className="flex flex-col h-full">
                                <h3 className="text-2xl font-bold text-white mb-3 font-serif group-hover:text-amber-500 transition-colors">
                                    {branch.name}
                                </h3>

                                <div className="space-y-4 mb-8 flex-grow">
                                    <div className="flex items-start gap-3 text-stone-400">
                                        <MapPin className="w-4 h-4 mt-1 text-amber-500 flex-shrink-0" />
                                        <span className="text-sm leading-relaxed">{branch.address}</span>
                                    </div>
                                    {branch.phoneNumber && (
                                        <div className="flex items-center gap-3 text-stone-400">
                                            <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                            <span className="text-sm tracking-widest">{branch.phoneNumber}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <a
                                        href={`https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-grow flex items-center justify-center gap-2 py-4 px-6 bg-white text-black font-black text-xs uppercase tracking-tighter rounded-2xl hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl shadow-black/20"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        ניווט למיקום
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Footer Call to Action */}
            <section className="bg-amber-900/20 py-20 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <Coffee className="w-12 h-12 text-amber-500 mx-auto mb-6 opacity-50" />
                    <h2 className="text-3xl font-serif text-white mb-4">רוצים לפתוח סניף Cyber Barista משלכם?</h2>
                    <p className="text-stone-500 mb-8">הצטרפו למהפכה הדיגיטלית של עולם הקפה והביאו את העתיד לעיר שלכם.</p>
                    <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
                        צרו איתנו קשר
                    </button>
                </div>
            </section>
        </div>
    );
}
