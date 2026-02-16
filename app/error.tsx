'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 🚨 Log the error for production troubleshooting
        console.error('🚨 PAGE RENDER ERROR:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FDFCF0]/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-[#C37D46]/20 m-6" dir="rtl">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 p-6 bg-white rounded-full shadow-xl shadow-[#C37D46]/10"
            >
                <Coffee className="w-16 h-16 text-[#C37D46]" />
            </motion.div>

            <h2 className="text-3xl font-serif font-black text-[#2D1B14] mb-4">
                משהו השתבש בהכנת הקפה...
            </h2>

            <p className="text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                אירעה שגיאה בטעינת הדף. ייתכן שישנה בעיה זמנית בתקשורת עם השרת שלנו.
                <br />
                <span className="text-xs text-red-400 font-mono mt-2 block">{error.message.substring(0, 100)}...</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-[#2D1B14] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                    <RefreshCw className="w-4 h-4" />
                    נסה שוב
                </button>
                <a
                    href="/"
                    className="bg-white text-[#2D1B14] border border-stone-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-50 transition-all shadow-sm"
                >
                    חזרה לדף הבית
                </a>
            </div>

            {error.digest && (
                <div className="mt-12 text-[10px] font-mono text-stone-400 uppercase tracking-widest opacity-30">
                    Trace ID: {error.digest}
                </div>
            )}
        </div>
    );
}
