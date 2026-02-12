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
    const validated = MatchSchema.parse(data)
    const session = await getServerSession(authOptions)

    // 1. Identify best product match
    let matchedProduct = await prisma.product.findFirst({
        where: {
            roast: validated.roastLevel,
            flavor: { has: validated.flavorNotes },
            isArchived: false,
        },
    })

    // 2. Fallback to House Blend if no exact match
    if (!matchedProduct) {
        matchedProduct = await prisma.product.findFirst({
            where: {
                name: { contains: "House Blend", mode: "insensitive" },
                isArchived: false,
            },
        })
    }

    // 3. Fallback to any product if House Blend is also missing
    if (!matchedProduct) {
        matchedProduct = await prisma.product.findFirst({
            where: { isArchived: false },
        })
    }

    // 4. Save to TasteProfile if user is logged in
    if (session?.user?.email && matchedProduct) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (user) {
            await prisma.tasteProfile.upsert({
                where: { userId: user.id },
                update: {
                    roastLevel: validated.roastLevel,
                    flavorNotes: validated.flavorNotes,
                },
                create: {
                    userId: user.id,
                    roastLevel: validated.roastLevel,
                    flavorNotes: validated.flavorNotes,
                },
            })

            // Send Email
            await sendMatchmakerEmail(
                user.email!,
                user.name || "אורח",
                matchedProduct.name,
                matchedProduct.price,
                matchedProduct.image || ""
            )
        }
    }

    revalidatePath("/match")
    return { success: true, data: matchedProduct }
}
