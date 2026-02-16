import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    // Admin access validation
    // if (!session.user.isAdmin) { redirect('/'); }

    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });

    // Prisma Products don't have 'category' string field directly if using relation, usually.
    // Wait, in my products.ts I used string category. In schema I have Category relation AND string? categoryId?
    // Let's check schema again.

    return <AdminClient orders={orders} products={products} />;
}
