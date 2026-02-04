import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { tier } = body;

        if (!tier) {
            return new NextResponse("Tier is required", { status: 400 });
        }

        // Set expiry to 30 days from now
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email
            },
            data: {
                subscriptionTier: tier,
                subscriptionStatus: "active",
                subscriptionExpiry: expiry,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[SUBSCRIPTION_JOIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
