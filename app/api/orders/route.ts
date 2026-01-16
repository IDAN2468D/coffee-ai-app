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

        // Pre-process items to ensure valid Product IDs
        const finalItems = [];

        for (const item of items) {
            // Check if ID is a valid MongoDB ObjectID (24 hex characters)
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.id);

            if (isValidObjectId) {
                // It's a real product, verify it exists (optional but good practice)
                finalItems.push(item);
            } else {
                // It's a custom item (e.g. "custom-mug-..." or "blend-...")
                // We need to map this to a real product in the DB to satisfy the foreign key constraint

                let fallbackName = "מוצר מותאם אישית";
                let fallbackCategory = "Equipment";

                if (item.id.includes('mug') || item.name.includes('ספל')) {
                    fallbackName = "ספל בעיצוב אישי";
                    fallbackCategory = "Equipment";
                } else if (item.id.includes('blend') || item.name.includes('בלנד')) {
                    fallbackName = "בלנד אישי";
                    fallbackCategory = "Beans";
                }

                // Try to find an existing generic product for this type
                let realProduct = await prisma.product.findFirst({
                    where: { name: fallbackName }
                });

                // If not found, create it on the fly
                if (!realProduct) {
                    console.log(`[ORDER] Creating generic product for: ${fallbackName}`);
                    realProduct = await prisma.product.create({
                        data: {
                            name: fallbackName,
                            description: "מוצר מותאם אישית שנוצר על ידי הלקוח",
                            price: item.price, // Use changes from the item if needed, though usually fixed
                            image: item.image,
                            category: {
                                connectOrCreate: {
                                    where: { id: "65a000000000000000000000" }, // Use a dummy ID for lookup if needed, or better:
                                    create: { name: fallbackCategory }
                                }
                            }
                        }
                    });
                }

                // Push the item with the REAL database ID
                finalItems.push({
                    ...item,
                    id: realProduct.id
                });
            }
        }

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
                userId: (session.user as any).id,
                total: total,
                status: 'pending',
                shippingAddress: shippingDetails || {},
                items: {
                    create: finalItems.map((item: any) => ({
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
        return NextResponse.json({ error: "Failed to create order", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
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
