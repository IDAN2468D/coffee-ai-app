"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ServerActionResponse, AlchemyStats } from "@/src/types";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const AlchemySchema = z.object({
    acidity: z.number().min(0).max(100),
    body: z.number().min(0).max(100),
    sweetness: z.number().min(0).max(100),
    bitterness: z.number().min(0).max(100),
});

export async function craftBlend(rawStats: AlchemyStats): Promise<ServerActionResponse> {
    console.log("Alchemy Action Started:", rawStats);

    try {
        const stats = AlchemySchema.parse(rawStats);

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            console.error("Alchemy: No Session");
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            console.error("Alchemy: User not found");
            return { success: false, error: "User not found" };
        }

        // Check API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error("Alchemy: Missing API Key");
            return { success: false, error: "מפתח ה-API חסר. אנא פנה לתמיכה." };
        }

        // AI Generation (Instantiate safely inside function)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Act as a world-class coffee roaster. Create a unique, creative, and luxurious name and a short sensory description (max 20 words) for a coffee blend with the following characteristics (0-100 scale):
        - Acidity: ${stats.acidity}
        - Body: ${stats.body}
        - Sweetness: ${stats.sweetness}
        - Bitterness: ${stats.bitterness}
        
        The description should be professional and evocative (in Hebrew). Return JSON format: { "name": "...", "description": "..." }`;

        console.log("Alchemy: Generating content...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log("Alchemy: AI Response:", text);

        // Robust JSON extraction
        let aiData;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                aiData = JSON.parse(jsonMatch[0]);
            } else {
                aiData = JSON.parse(text);
            }
        } catch (parseError) {
            console.error("JSON Parse Error. Raw Text:", text);
            return { success: false, error: "ה-AI הפיק תשובה בפורמט לא תקין. נסה שוב." };
        }

        // Save to DB
        const blend = await prisma.blend.create({
            data: {
                name: aiData.name || "תערובת מסתורית",
                base: "Alchemy Custom",
                milk: "None",
                flavor: aiData.description || "טעם גנרי של קפה",
                acidity: stats.acidity,
                body: stats.body,
                sweetness: stats.sweetness,
                bitterness: stats.bitterness,
                userId: user.id
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/alchemy");

        return { success: true, data: blend };

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            console.error("Alchemy Validation Error:", error.errors);
            return { success: false, error: "ערכי הקלט אינם תקינים." };
        }

        const isQuotaError = error instanceof Error && (error.message.includes("429") || error.message.includes("quota"));

        if (isQuotaError) {
            console.warn("Alchemy: AI Quota Exceeded (Swapping to Fallback logic).");
        } else {
            console.error("Crafting Error (Full):", error);
        }

        // --- Fallback Mechanism ---
        // If AI fails (network, quota, etc.), we provide a "Mystery Blend" so the user experience isn't broken.
        try {
            // 1. Get User (Redundant check but needed for types if we reach here early)
            const session = await getServerSession(authOptions);
            const user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;

            if (user) {
                const FALLBACK_NAMES = ["סוד האלכימאי", "תערובת הבית", "צללי הלילה", "תעוררות", "זהב שחור"];
                const FALLBACK_DESCRIPTIONS = [
                    "שילוב מעורפל ומסתורי של טעמים עמוקים.",
                    "קפה מאוזן עם סיומת מפתיעה.",
                    "חוויה חושית עשירה במיוחד.",
                    "טעם עוצמתי שמעורר את החושים."
                ];

                const fallbackName = FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)];
                const fallbackDesc = FALLBACK_DESCRIPTIONS[Math.floor(Math.random() * FALLBACK_DESCRIPTIONS.length)];

                // Create backup blend in DB
                const fallbackBlend = await prisma.blend.create({
                    data: {
                        name: fallbackName,
                        base: "Alchemy Fallback",
                        milk: "None",
                        flavor: fallbackDesc,
                        acidity: rawStats.acidity, // Use the user's requested stats
                        body: rawStats.body,
                        sweetness: rawStats.sweetness,
                        bitterness: rawStats.bitterness,
                        userId: user.id
                    }
                });

                revalidatePath("/dashboard");
                revalidatePath("/alchemy");

                // Return success with the fallback blend, but maybe log it warn level
                console.warn("Served fallback blend due to AI error.");
                return { success: true, data: fallbackBlend };
            }
        } catch (dbError) {
            console.error("Critical: Fallback DB creation failed:", dbError);
        }

        // Real Error Message (only if fallback also failed)
        let message = "המעבדה כרגע לא יציבה. נסה שוב בעוד דקה.";
        if (error instanceof Error) {
            if (error.message.includes("API_KEY")) {
                message = "מפתח ה-API חסר או לא תקין";
            } else if (error.message.includes("fetch")) {
                message = "שגיאת תקשורת עם ה-AI. בדוק את החיבור לרשת.";
            } else if (error.message.includes("quota")) {
                message = "חריגה ממכסת השימוש ב-AI. נסה שוב מאוחר יותר.";
            }
        }

        return { success: false, error: message };
    }
}
