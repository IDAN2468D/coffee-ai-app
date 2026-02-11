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
