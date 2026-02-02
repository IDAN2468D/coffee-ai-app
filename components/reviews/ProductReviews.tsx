"use client";

import { useState } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

export default function ProductReviews({ productId }: { productId: string }) {
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const handleReviewSubmitted = () => {
        setReloadTrigger(prev => prev + 1);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-24 border-t border-stone-200 pt-16">
            <div>
                <ReviewList productId={productId} reloadTrigger={reloadTrigger} />
            </div>
            <div>
                <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
            </div>
        </div>
    );
}
