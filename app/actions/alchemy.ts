"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ServerActionResponse, AlchemyStats } from "@/src/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const AlchemySchema = z.object({
    acidity: z.number().min(0).max(100),
    body: z.number().min(0).max(100),
    sweetness: z.number().min(0).max(100),
    bitterness: z.number().min(0).max(100),
});

export async function craftBlend(rawStats: AlchemyStats): Promise<ServerActionResponse> {
    try {
        const stats = AlchemySchema.parse(rawStats);

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // AI Generation
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Act as a world-class coffee roaster. Create a unique, creative, and luxurious name and a short sensory description (max 20 words) for a coffee blend with the following characteristics (0-100 scale):
        - Acidity: ${stats.acidity}
        - Body: ${stats.body}
        - Sweetness: ${stats.sweetness}
        - Bitterness: ${stats.bitterness}
        
        The description should be professional and evocative. Return JSON format: { "name": "...", "description": "..." }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

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
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "ערכי הקלט אינם תקינים." };
        }
        console.error("Crafting error:", error);
        // Provide more context if it's an API error
        const errorMsg = error.message?.includes("API_KEY") ? "מפתח ה-API חסר או לא תקין" : "המעבדה כרגע לא יציבה. נסה שוב בעוד דקה.";
        return { success: false, error: errorMsg };
    }
}
