export enum Plan {
    FREE = "FREE",
    BASIC = "BASIC",
    PRO = "PRO",
}

export interface Subscription {
    id: string;
    userId: string;
    plan: Plan;
    status: "active" | "cancelled";
    nextBillingDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
