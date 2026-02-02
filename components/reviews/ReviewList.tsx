"use client";

import { useEffect, useState } from 'react';
import StarRating from './StarRating';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        image: string | null;
    };
}

export default function ReviewList({ productId, reloadTrigger }: { productId: string, reloadTrigger: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, reloadTrigger]);

    if (loading) return <div className="text-stone-500 text-center py-4">טוען ביקורות...</div>;

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-stone-500">אין עדיין ביקורות למוצר זה. היו הראשונים לדרג! ⭐</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-[#2D1B14] mb-6">ביקורות לקוחות ({reviews.length})</h3>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                    {review.user.image ? (
                                        <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-sm">
                                            {review.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D1B14]">{review.user.name}</h4>
                                    <span className="text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString('he-IL')}</span>
                                </div>
                            </div>
                            <StarRating rating={review.rating} readOnly size={16} />
                        </div>
                        <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl text-sm">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
