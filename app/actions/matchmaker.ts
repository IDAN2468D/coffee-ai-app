"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { sendMatchmakerEmail } from "@/lib/mailer"

const MatchSchema = z.object({
    roastLevel: z.enum(["LIGHT", "MEDIUM", "DARK"]),
    flavorNotes: z.enum(["FRUITY", "NUTTY", "CHOCOLATY"]),
})

export async function matchCoffee(data: z.infer<typeof MatchSchema>) {
    // אימות קלט בטוח
    const result = MatchSchema.safeParse(data)
    if (!result.success) {
        return { success: false, error: "נתונים לא תקינים" }
    }

    const { roastLevel, flavorNotes } = result.data
    const session = await getServerSession(authOptions)

    // 1. חיפוש מוצר מותאם (שימוש בשדות החדשים)
    let matchedProduct = await prisma.product.findFirst({
        where: {
            roast: roastLevel,          // וודא שב-DB שמרת את זה באותיות גדולות כמו ב-Enum
            flavor: { has: flavorNotes },
            isArchived: false,
        },
    })

    // 2. Fallback: House Blend (תיקון ל-MongoDB: הורדנו את mode: insensitive)
    if (!matchedProduct) {
        matchedProduct = await prisma.product.findFirst({
            where: {
                name: { contains: "House Blend" },
                isArchived: false,
            },
        })
    }

    // 3. Fallback: כל מוצר זמין
    if (!matchedProduct) {
        matchedProduct = await prisma.product.findFirst({
            where: { isArchived: false },
        })
    }

    if (!matchedProduct) {
        return { success: false, error: "לא נמצאו מוצרים במלאי" }
    }

    // 4. שמירה לפרופיל ושליחת מייל (רק למשתמשים רשומים)
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (user) {
            try {
                // שימוש ב-TasteProfile החדש
                await prisma.tasteProfile.upsert({
                    where: { userId: user.id },
                    update: {
                        roastLevel: roastLevel,
                        flavorNotes: flavorNotes,
                    },
                    create: {
                        userId: user.id,
                        roastLevel: roastLevel,
                        flavorNotes: flavorNotes,
                    },
                })

                // שליחת מייל (עטוף ב-try כדי לא להכשיל את הפעולה כולה אם המייל נכשל)
                await sendMatchmakerEmail(
                    user.email!,
                    user.name || "חובב קפה",
                    matchedProduct.name,
                    matchedProduct.price,
                    matchedProduct.image || "/images/placeholder.png"
                )
            } catch (error) {
                console.error("Error updating profile or sending email:", error)
            }
        }
    }

    revalidatePath("/match")
    return { success: true, data: matchedProduct }
}