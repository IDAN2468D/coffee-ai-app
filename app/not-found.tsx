import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center text-center p-6" dir="rtl">
            <Coffee className="w-16 h-16 text-[#2D1B14] mb-6 opacity-20" />
            <h2 className="text-4xl font-serif font-bold text-[#2D1B14] mb-4">העמוד לא נמצא</h2>
            <p className="text-stone-500 mb-8 max-w-md">
                נראה שהקפה שחיפשת כבר נשתה. בוא נחזור לדף הבית.
            </p>
            <Link
                href="/"
                className="bg-[#2D1B14] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
                חזרה לדף הבית
            </Link>
        </div>
    );
}
