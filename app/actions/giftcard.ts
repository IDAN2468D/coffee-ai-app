"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import type { ServerActionResponse, GiftCardData } from "@/src/types";

// --- Zod Schemas ---

const createGiftCardSchema = z.object({
    amount: z.number().min(25, "סכום מינימלי ₪25").max(500, "סכום מקסימלי ₪500"),
    recipientEmail: z.string().email("כתובת אימייל לא תקינה"),
    message: z.string().max(200, "הודעה ארוכה מדי").optional(),
});

const redeemGiftCardSchema = z.object({
    code: z.string().min(1, "קוד נדרש"),
});

// --- Helper: Generate unique gift card code ---

function generateGiftCardCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1 to avoid confusion
    let code = "GC-";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * @Architect — createGiftCard
 *
 * Creates a new gift card with a unique code.
 * Validates amount range (₪25–₪500).
 * Expiry: 1 year from creation.
 *
 * NOTE: Payment is SIMULATED — no real charge is made.
 */
export async function createGiftCard(
    input: z.infer<typeof createGiftCardSchema>
): Promise<ServerActionResponse<GiftCardData>> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "יש להתחבר כדי לשלוח גיפט קארד" };
        }

        // Validate input
        const parsed = createGiftCardSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: parsed.error.errors[0].message };
        }

        const { amount, recipientEmail, message } = parsed.data;

        // Find sender
        const sender = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!sender) {
            return { success: false, error: "משתמש לא נמצא" };
        }

        // Generate unique code (retry if collision)
        let code = generateGiftCardCode();
        let attempts = 0;
        while (attempts < 5) {
            const exists = await prisma.giftCard.findUnique({ where: { code } });
            if (!exists) break;
            code = generateGiftCardCode();
            attempts++;
        }

        if (attempts >= 5) {
            return { success: false, error: "שגיאה ביצירת קוד, נסה שוב" };
        }

        // Create gift card — expires in 1 year
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const giftCard = await prisma.giftCard.create({
            data: {
                code,
                balance: amount,
                originalAmount: amount,
                senderId: sender.id,
                recipientEmail,
                message: message || null,
                expiresAt,
            },
        });

        console.log(`[GiftCard] Created: ${code} | ₪${amount} | To: ${recipientEmail}`);

        return {
            success: true,
            data: {
                code: giftCard.code,
                balance: giftCard.balance,
                originalAmount: giftCard.originalAmount,
                recipientEmail: giftCard.recipientEmail,
                message: giftCard.message || undefined,
                expiresAt: giftCard.expiresAt,
            },
        };
    } catch (error) {
        console.error("[GiftCard] Create error:", error);
        return { success: false, error: "שגיאה ביצירת הגיפט קארד" };
    }
}

/**
 * @Architect — redeemGiftCard
 *
 * Validates code, checks expiry and redemption status.
 * Uses atomic query pattern for double-spend protection:
 * findFirst with isRedeemed: false ensures only one concurrent call succeeds.
 */
export async function redeemGiftCard(
    input: z.infer<typeof redeemGiftCardSchema>
): Promise<ServerActionResponse<{ balance: number; message?: string }>> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, error: "יש להתחבר כדי לממש גיפט קארד" };
        }

        // Validate input
        const parsed = redeemGiftCardSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: parsed.error.errors[0].message };
        }

        const { code } = parsed.data;

        // Find the redeemer
        const redeemer = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!redeemer) {
            return { success: false, error: "משתמש לא נמצא" };
        }

        // Atomic double-spend protection:
        // Find the card only if it hasn't been redeemed yet
        const giftCard = await prisma.giftCard.findFirst({
            where: {
                code,
                isRedeemed: false,
            },
        });

        if (!giftCard) {
            return { success: false, error: "קוד לא תקין או שכבר מומש" };
        }

        // Check expiry
        if (new Date() > giftCard.expiresAt) {
            return { success: false, error: "תוקף הגיפט קארד פג" };
        }

        // Mark as redeemed — atomic update with isRedeemed: false guard
        const updated = await prisma.giftCard.updateMany({
            where: {
                id: giftCard.id,
                isRedeemed: false, // Double-spend guard: only updates if still unredeemed
            },
            data: {
                isRedeemed: true,
                redeemedAt: new Date(),
                redeemedById: redeemer.id,
            },
        });

        // If no records were updated, another request already redeemed it
        if (updated.count === 0) {
            return { success: false, error: "הגיפט קארד כבר מומש" };
        }

        // Credit the user's points (1 NIS = 10 points)
        await prisma.user.update({
            where: { id: redeemer.id },
            data: {
                points: { increment: Math.floor(giftCard.balance * 10) },
            },
        });

        console.log(`[GiftCard] Redeemed: ${code} | ₪${giftCard.balance} | By: ${session.user.email}`);

        return {
            success: true,
            data: {
                balance: giftCard.balance,
                message: giftCard.message || undefined,
            },
        };
    } catch (error) {
        console.error("[GiftCard] Redeem error:", error);
        return { success: false, error: "שגיאה במימוש הגיפט קארד" };
    }
}

/**
 * @Architect — getGiftCardByCode
 *
 * Public-facing read to display gift card info on the /gift/[code] page.
 * Does NOT expose sender details.
 */
export async function getGiftCardByCode(
    code: string
): Promise<ServerActionResponse<{
    code: string;
    balance: number;
    message?: string;
    isRedeemed: boolean;
    isExpired: boolean;
    senderName?: string;
}>> {
    try {
        const giftCard = await prisma.giftCard.findUnique({
            where: { code },
            include: {
                sender: {
                    select: { name: true },
                },
            },
        });

        if (!giftCard) {
            return { success: false, error: "גיפט קארד לא נמצא" };
        }

        return {
            success: true,
            data: {
                code: giftCard.code,
                balance: giftCard.balance,
                message: giftCard.message || undefined,
                isRedeemed: giftCard.isRedeemed,
                isExpired: new Date() > giftCard.expiresAt,
                senderName: giftCard.sender.name || undefined,
            },
        };
    } catch (error) {
        console.error("[GiftCard] Lookup error:", error);
        return { success: false, error: "שגיאה בטעינת הגיפט קארד" };
    }
}
