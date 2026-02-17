
'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists, if not I'll just use template literals or install clsx/tailwind-merge

interface StarRatingProps {
    totalStars?: number;
    initialRating?: number;
    rating?: number; // Controlled prop
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean; // React standard camelCase
    size?: number;
}

export default function StarRating({
    totalStars = 5,
    initialRating = 0,
    rating: controlledRating,
    onRatingChange,
    readOnly = false,
    size = 24
}: StarRatingProps) {
    const [internalRating, setInternalRating] = useState(initialRating);

    // Use controlled rating if provided, otherwise internal state
    const currentRating = controlledRating !== undefined ? controlledRating : internalRating;
    const [hover, setHover] = useState(0);

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) {
            setInternalRating(index);
            onRatingChange(index);
        } else if (!readOnly) {
            setInternalRating(index);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: totalStars }).map((_, index) => {
                const starIndex = index + 1;
                const isFilled = starIndex <= (hover || currentRating);

                return (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "transition-colors duration-200 focus:outline-none",
                            readOnly ? "cursor-default" : "cursor-pointer"
                        )}
                        onClick={() => handleClick(starIndex)}
                        onMouseEnter={() => !readOnly && setHover(starIndex)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        disabled={readOnly}
                    >
                        <Star
                            size={size}
                            className={cn(
                                "transition-all",
                                isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-transparent text-stone-300"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
