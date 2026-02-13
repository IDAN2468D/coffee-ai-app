export type UserTier = 'SILVER' | 'GOLD' | 'PLATINUM';

export interface TierBenefits {
    aiAccess: boolean | 'BASIC' | 'FULL';
    happyHourDiscount: number;
    shippingFee: number;
    vipDiscount: number;
    freeShipping?: boolean;
}

export const TIER_BENEFITS: Record<UserTier, TierBenefits> = {
    SILVER: {
        aiAccess: false,
        happyHourDiscount: 0.05,
        shippingFee: 29.90,
        vipDiscount: 0
    },
    GOLD: {
        aiAccess: 'BASIC',
        happyHourDiscount: 0.10,
        shippingFee: 29.90,
        vipDiscount: 0.05
    },
    PLATINUM: {
        aiAccess: 'FULL',
        happyHourDiscount: 0.15,
        shippingFee: 0,
        vipDiscount: 0.10,
        freeShipping: true
    }
};
