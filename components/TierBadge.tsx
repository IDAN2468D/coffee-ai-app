import React from 'react';
import { UserTier } from '@/lib/tiers';
import { ShieldCheck, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TierBadgeProps {
    tier: UserTier;
    className?: string;
    showIcon?: boolean;
}

const TIER_CONFIG: Record<UserTier, { label: string; color: string; icon: any }> = {
    SILVER: {
        label: 'Silver',
        color: 'bg-slate-200 text-slate-700 border-slate-300',
        icon: ShieldCheck
    },
    GOLD: {
        label: 'Gold',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Award
    },
    PLATINUM: {
        label: 'Platinum',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Zap
    }
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className, showIcon = true }) => {
    const config = TIER_CONFIG[tier];
    const Icon = config.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            config.color,
            className
        )}>
            {showIcon && <Icon size={12} />}
            {config.label}
        </div>
    );
};
