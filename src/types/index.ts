export type UserTier = 'SILVER' | 'GOLD' | 'PLATINUM';

export enum Plan {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PRO = 'PRO'
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
    image: string;
    category: 'Hot' | 'Cold' | 'Pastry' | 'Beans' | 'Equipment' | 'Capsules';
    roast?: string | null;
    flavor?: string[];
    tags?: string[];
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

export interface ServerActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
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
