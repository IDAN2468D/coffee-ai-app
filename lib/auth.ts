import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendLoginEmail } from "./mailer";

declare module "next-auth" {
    interface User {
        id: string;
        isAdmin: boolean;
        points: number;
        subscription?: {
            plan: "FREE" | "BASIC" | "PRO";
            status: string;
            nextBillingDate: Date | null;
        } | null;
    }
    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        isAdmin: boolean;
        points: number;
        subscription?: {
            plan: "FREE" | "BASIC" | "PRO";
            status: string;
            nextBillingDate: Date | null;
        } | null;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { subscription: true }
                });

                if (!user || !user.password) {
                    throw new Error("No user found with this email");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    points: user.points,
                    subscription: user.subscription ? {
                        plan: user.subscription.plan as "FREE" | "BASIC" | "PRO",
                        status: user.subscription.status,
                        nextBillingDate: user.subscription.nextBillingDate,
                    } : null,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
                token.points = user.points;
                token.subscription = (user as any).subscription;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).isAdmin = token.isAdmin as boolean;
                (session.user as any).points = token.points as number;
                (session.user as any).subscription = token.subscription as any;
            }
            return session;
        }
    },
    events: {
        async signIn({ user }) {
            if (user?.email && user?.name) {
                // Don't await the email sending to prevent blocking the login response
                sendLoginEmail(user.email, user.name).catch(err => {
                    console.error("Failed to send login email:", err);
                });
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
