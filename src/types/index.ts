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
