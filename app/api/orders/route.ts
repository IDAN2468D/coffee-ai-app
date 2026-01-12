import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/mailer';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "You must be signed in to place an order" }, { status: 401 });
        }

        const { items, total, shippingDetails } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
                userId: (session.user as any).id,
                total: total,
                status: 'pending',
                shippingAddress: shippingDetails || {},
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        size: item.size || 'M', // Save selected size, default to M
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Update User Loyalty Points
        const pointsEarned = Math.round(total * 10);
        console.log('[POINTS] User ID:', (session.user as any).id, 'Points earned:', pointsEarned);

        // Fetch current points
        const currentUser = await prisma.user.findUnique({
            where: { id: (session.user as any).id }
        });

        // @ts-ignore - points field exists in schema but Prisma client needs regeneration
        const newPoints = (currentUser?.points || 0) + pointsEarned;

        // Update with new total
        // @ts-ignore - points field exists in schema but Prisma client needs regeneration
        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: { points: newPoints }
        });

        console.log('[POINTS] Points updated successfully. New total:', newPoints);

        // Send confirmation email with receipt
        if (session.user.email && session.user.name) {
            sendOrderConfirmationEmail(session.user.email, session.user.name, order).catch(console.error);
        }

        return NextResponse.json({ success: true, orderId: order.id, pointsEarned });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: (session.user as any).id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
