import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FavoritesClient from "./FavoritesClient";
import { redirect } from "next/navigation";
import { Product } from "@/src/types";

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { favoriteIds: true }
    });

    if (!user) {
        return <div>User not found</div>;
    }

    // Fetch the actual products
    const favoritesResult = await prisma.product.findMany({
        where: {
            id: {
                in: user.favoriteIds
            }
        },
        include: {
            category: true
        }
    });

    const favorites: Product[] = favoritesResult.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image || '/placeholder.png',
        category: (p.category?.name as any) || 'Hot',
        roast: p.roast,
        flavor: p.flavor,
        tags: p.tags
    }));

    return (
        <main className="min-h-screen bg-[#FDFCF0]">
            <FavoritesClient initialFavorites={favorites} />
        </main>
    );
}
