import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { CheckCircle, Package, Truck, User, Mail, MapPin, Star, Coffee } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
// Note: We use a wrapper component or keep it simple since it's a server component
// To use framer-motion animations, we'd need a client component wrapper.
// Let's create a Client Confirmation component.

import OrderConfirmationClient from "./OrderConfirmationClient";

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        redirect("/auth/signin");
    }

    const order = await prisma.order.findUnique({
        where: { id: params.orderId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        notFound();
    }

    // Verify ownership
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || order.userId !== user.id) {
        redirect("/");
    }

    // Prepare data for the client component
    const orderData = {
        id: order.id,
        items: order.items.map(item => ({
            id: item.id,
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
            size: item.size
        })),
        total: order.total,
        shippingFee: order.shippingFee,
        discount: order.discount,
        vipDiscount: order.vipDiscount,
        shippingDetails: order.shippingAddress as any,
        date: new Date(order.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }),
        pointsEarned: Math.round(order.total * 10)
    };

    return (
        <OrderConfirmationClient
            order={orderData}
            userName={session.user.name || "אורח"}
        />
    );
}
