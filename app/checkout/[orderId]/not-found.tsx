import Link from "next/link";
import { Coffee, ArrowRight } from "lucide-react";

export default function CheckoutNotFound() {
    return (
        <main className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-8 text-center" dir="rtl">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-stone-100 max-w-md w-full relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D1B14]/5 rounded-bl-[100px] -mr-8 -mt-8" />

                <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
                    <Coffee className="w-10 h-10 text-stone-300" />
                </div>

                <h2 className="text-3xl font-serif font-bold text-[#2D1B14] mb-4 relative z-10">
                    ההזמנה לא נמצאה...
                </h2>

                <p className="text-stone-500 mb-10 text-lg leading-relaxed relative z-10">
                    נראה שההזמנה שחיפשת הלכה לאיבוד בדרך לבית הקלייה.
                    אל דאגה, אנחנו כאן כדי לעזור לך למצוא את הדרך חזרה.
                </p>

                <div className="space-y-4 relative z-10">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-[#2D1B14] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-black hover:scale-[1.02] transition-all w-full"
                    >
                        <span>חזרה לתפריט הקפה</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>

                    <Link
                        href="/orders"
                        className="block text-stone-400 hover:text-[#2D1B14] font-bold text-sm uppercase tracking-widest transition-colors"
                    >
                        לרשימת ההזמנות שלי
                    </Link>
                </div>
            </div>
        </main>
    );
}
