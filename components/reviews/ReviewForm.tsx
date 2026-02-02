"use client";

import { useState } from 'react';
import StarRating from './StarRating';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ReviewForm({ productId, onReviewSubmitted }: { productId: string, onReviewSubmitted: () => void }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('נא לבחור דירוג');
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating, comment }),
            });

            if (!res.ok) {
                const data = await res.text();
                throw new Error(data || 'Something went wrong');
            }

            setRating(0);
            setComment('');
            onReviewSubmitted();
        } catch (err: any) {
            console.error(err);
            setError('אירעה שגיאה בשליחת הביקורת. נסה שוב מאוחר יותר.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="bg-stone-50 p-6 rounded-2xl text-center border border-dashed border-stone-300">
                <p className="text-stone-600 mb-2">רוצה לכתוב ביקורת?</p>
                <button
                    onClick={() => router.push(`/auth/login?callbackUrl=/shop/${productId}`)}
                    className="text-[#C37D46] font-bold underline hover:text-[#a06338]"
                >
                    התחבר לחשבון
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-4">
            <h3 className="text-xl font-bold text-[#2D1B14] mb-2">כתוב ביקורת</h3>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-600">הדירוג שלך</label>
                <StarRating rating={rating} setRating={setRating} size={32} />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-stone-600">התגובה שלך</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-[#C37D46] focus:border-transparent outline-none transition-all"
                    placeholder="ספר לנו מה חשבת על הקפה..."
                    required
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2D1B14] text-white py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'שלח ביקורת'}
            </button>
        </form>
    );
}
