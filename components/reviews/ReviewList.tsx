"use client";

import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { BadgeCheck, Trash2, Filter } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    isVerified: boolean;
    userId: string;
    user: {
        name: string;
        image: string | null;
    };
}

export default function ReviewList({ productId, reloadTrigger }: { productId: string, reloadTrigger: number }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/reviews?productId=${productId}&sort=${sortBy}`);
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
    }, [productId, reloadTrigger, sortBy]);

    const handleDelete = async (reviewId: string) => {
        if (!confirm('האם אתה בטוח שברצונך למחוק את הביקורת?')) return;

        setDeletingId(reviewId);
        try {
            const res = await fetch(`/api/reviews?id=${reviewId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== reviewId));
            } else {
                alert('שגיאה במחיקת הביקורת');
            }
        } catch (error) {
            console.error('Failed to delete review', error);
        } finally {
            setDeletingId(null);
        }
    };

    // Calculate Rating Breakdown
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    reviews.forEach(r => {
        const rating = Math.round(r.rating);
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating]++;
        }
    });

    if (loading && reviews.length === 0) return <div className="text-stone-500 text-center py-4">טוען ביקורות...</div>;

    if (reviews.length === 0 && !loading) {
        return (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-stone-500">אין עדיין ביקורות למוצר זה. היו הראשונים לדרג! ⭐</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-serif font-bold text-[#2D1B14]">ביקורות לקוחות</h3>

            {/* Rating Breakdown */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 grid md:grid-cols-3 gap-8 items-center" dir="rtl">
                <div className="text-center md:text-right">
                    <div className="text-5xl font-black text-[#2D1B14] mb-1">{averageRating}</div>
                    <StarRating rating={Number(averageRating)} readOnly size={20} />
                    <p className="text-stone-500 text-sm mt-2">{totalReviews} חוות דעת</p>
                </div>

                <div className="col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3 text-sm">
                            <span className="w-3 font-bold text-stone-400">{star}</span>
                            <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#C37D46] rounded-full"
                                    style={{ width: `${totalReviews ? (ratingCounts[star] / totalReviews) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="w-8 text-stone-400 text-xs">{ratingCounts[star]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sorting */}
            <div className="flex justify-end">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-stone-200">
                    <Filter className="w-4 h-4 text-stone-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium text-stone-600 focus:outline-none cursor-pointer"
                    >
                        <option value="newest">הכי חדש</option>
                        <option value="oldest">הכי ישן</option>
                        <option value="highest">דירוג גבוה</option>
                        <option value="lowest">דירוג נמוך</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative group">
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
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-[#2D1B14]">{review.user.name}</h4>
                                        {review.isVerified && (
                                            <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 font-bold uppercase tracking-wider">
                                                <BadgeCheck className="w-3 h-3" />
                                                קניה מאומתת
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString('he-IL')}</span>
                                </div>
                            </div>
                            <StarRating rating={review.rating} readOnly size={16} />
                        </div>
                        <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl text-sm">
                            {review.comment}
                        </p>

                        {/* Delete Button (Only visible to owner) */}
                        {session?.user?.id === review.userId && (
                            <button
                                onClick={() => handleDelete(review.id)}
                                disabled={deletingId === review.id}
                                className="absolute top-4 left-4 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                title="מחק ביקורת"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
