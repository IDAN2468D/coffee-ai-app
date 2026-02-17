
export const UserRole = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    BARISTA: 'BARISTA',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OrderStatus = {
    PENDING: 'PENDING',
    BREWING: 'BREWING',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
