'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 🚨 THIS IS CRITICAL: Log the actual error to the server console
        console.error('🚨 PRODUCTION ERROR:', error);
    }, [error]);

    return (
        <html lang="he" dir="rtl">
            <head>
                <title>שגיאה מערכתית - Cyber Barista</title>
            </head>
            <body className="bg-[#0F0F0F] text-[#E0E0E0] font-sans selection:bg-[#C37D46] selection:text-white">
                <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
                }}></div>

                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
                    <div className="mb-12 relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-[100px] animate-pulse"></div>
                        <div className="relative bg-[#1A100C] p-8 rounded-[3rem] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
                                תקלה במערכת
                            </h2>
                            <p className="text-red-400 font-bold tracking-widest uppercase text-xs mb-8">
                                System Malfunction Detected
                            </p>

                            <div className="text-white/40 mb-10 text-lg leading-relaxed max-w-sm mx-auto">
                                נראה ששפכנו את הפולים... המערכת נתקלה בשגיאה קריטית.
                                <br />
                                העניין דווח ליחידת העילית שלנו.
                            </div>

                            <button
                                onClick={() => reset()}
                                className="w-full bg-[#C37D46] hover:bg-[#8B4513] text-white px-8 py-4 rounded-2xl font-black shadow-[0_10px_30px_rgba(195,125,70,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase tracking-wider"
                            >
                                אתחול מחדש (Try Again)
                            </button>

                            {error.digest && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                        Error Hash: {error.digest}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-white/10 text-xs font-mono">
                        Cyber Barista OS v4.0.3 - Kernel Panic
                    </div>
                </div>
            </body>
        </html>
    );
}
