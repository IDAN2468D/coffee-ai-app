'use client';

import { SessionProvider } from "next-auth/react";
import { UserTierProvider } from "@/context/UserTierContext";


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UserTierProvider>
                {children}
            </UserTierProvider>
        </SessionProvider>
    );
}
