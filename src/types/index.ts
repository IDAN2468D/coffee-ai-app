import { Plan } from "@prisma/client";

export { Plan };


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

export interface ServerActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
