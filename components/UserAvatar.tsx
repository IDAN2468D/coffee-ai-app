'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface UserAvatarProps {
    src?: string | null;
    name?: string | null;
    size?: number;
    className?: string;
}

export default function UserAvatar({ src, name, size = 40, className = "" }: UserAvatarProps) {
    const [error, setError] = useState(false);

    // Default to ui-avatars if no src is provided
    const avatarUrl = src || (name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=C37D46&size=${size}`
        : null);

    const isUiAvatar = avatarUrl?.includes('ui-avatars.com');

    if (error || !avatarUrl) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`rounded-full bg-[#1A100C] border border-white/10 flex items-center justify-center ${className}`}
            >
                <User className="text-white/40" style={{ width: size * 0.6, height: size * 0.6 }} />
            </div>
        );
    }

    return (
        <div
            style={{ width: size, height: size }}
            className={`relative rounded-full overflow-hidden border border-white/10 ${className}`}
        >
            <Image
                src={avatarUrl}
                alt={name || "User avatar"}
                width={size}
                height={size}
                className="object-cover w-full h-full"
                onError={() => setError(true)}
                // Optimization: ui-avatars is a simple service, optimization can fail or be overkill
                unoptimized={isUiAvatar}
                // Above the fold? Usually avatars in navbar are.
                priority={true}
            />
        </div>
    );
}
