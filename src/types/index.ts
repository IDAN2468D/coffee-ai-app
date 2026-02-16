
export type UserTier = 'SILVER' | 'GOLD' | 'PLATINUM';

export enum Plan {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PRO = 'PRO'
}

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin: boolean;
    points: number;
    totalSpent: number;
    orderCount: number;
    tier: UserTier;
    subscriptionId?: string | null;
    isSubscriptionActive?: boolean;
    currentPeriodEnd?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Subscription {
    id: string;
    userId: string;
    plan: Plan;
    status: string;
    nextBillingDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface TasteProfile {
    id: string;
    userId: string;
    roastLevel: 'LIGHT' | 'MEDIUM' | 'DARK';
    flavorNotes: 'FRUITY' | 'NUTTY' | 'CHOCOLATY';
    brewMethod?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type RoastLevel = TasteProfile['roastLevel'];
export type FlavorNote = TasteProfile['flavorNotes'];

// --- Cart & Product Types ---

export type CoffeeSize = 'S' | 'M' | 'L';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null; // Nullable in schema
    category?: { name: string } | string | null; // Allow string for backward compatibility
    categoryId?: string | null;
    roast?: string | null;
    flavor?: string[];
    tags?: string[];
    origin?: string | null;
    slug?: string | null;
    isArchived?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
    size?: CoffeeSize;
}

export interface CartStore {
    items: CartItem[];
    addItem: (product: Product, size?: CoffeeSize) => void;
    removeItem: (productId: string, size?: CoffeeSize) => void;
    clearCart: () => void;
    total: number;
    recentlyAddedItem: CartItem | null;
    clearRecentlyAdded: () => void;
}

// --- Order Types ---

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product?: Product;
    quantity: number;
    size?: string | null;
}

export interface Order {
    id: string;
    userId: string;
    user?: User;
    items: OrderItem[];
    shippingAddress: any; // Using any for Json? type compatibility or define a stricter Address type
    total: number;
    discount: number;
    vipDiscount: number;
    shippingFee: number;
    appliedCoupon?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp?: number; // Added for protocol compliance
}

export interface ReOrderResponse {
    success: boolean;
    data?: string; // orderId
    error?: string;
    timestamp: number;
}

// --- Gift Card Types ---

export interface GiftCardData {
    code: string;
    balance: number;
    originalAmount: number;
    recipientEmail: string;
    message?: string;
    expiresAt: Date;
}

// --- AI Brewmaster Types ---

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';
export type WeatherCondition = 'Sunny' | 'Rainy' | 'Cold';

export interface ContextData {
    timeOfDay: TimeOfDay;
    weather: WeatherCondition;
    greeting: string;
    recommendedTags: string[];
    recommendedProduct?: string;
}

// --- Dynamic Pricing Types ---

export interface DynamicPriceResult {
    originalPrice: number;
    finalPrice: number;
    discountPercent: number;
    isHappyHour: boolean;
}

// --- Alchemy & Odyssey Types ---

export interface AlchemyStats {
    acidity: number;
    body: number;
    sweetness: number;
    bitterness: number;
}

export interface AlchemyResult {
    id: string;
    name: string;
    base: string;
    milk: string;
    flavor: string;
    acidity: number;
    body: number;
    sweetness: number;
    bitterness: number;
    userId: string;
    createdAt: Date;
}

export interface OdysseyResponse {
    success: boolean;
    origins: string[];
    error?: string;
}

export type OriginCoordinates = Record<string, [number, number]>;


