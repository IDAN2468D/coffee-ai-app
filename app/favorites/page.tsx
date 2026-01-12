import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FavoritesClient from "./FavoritesClient";
import { redirect } from "next/navigation";

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
    const favorites = await prisma.product.findMany({
        where: {
            id: {
                in: user.favoriteIds
            }
        },
        include: {
            category: true
        }
    });

    return (
        <main className="min-h-screen bg-[#FDFCF0]">
            <FavoritesClient initialFavorites={favorites} />
        </main>
    );
}
