
import { User as PrismaUser } from "@prisma/client";

declare module "@prisma/client" {
    export enum UserRole {
        ADMIN = "ADMIN",
        CUSTOMER = "CUSTOMER",
        BARISTA = "BARISTA",
    }

    export enum OrderStatus {
        PENDING = "PENDING",
        BREWING = "BREWING",
        OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
        DELIVERED = "DELIVERED",
        CANCELLED = "CANCELLED",
    }

    export interface User extends PrismaUser {
        loyaltyPoints: number;
        role: UserRole;
    }
}
