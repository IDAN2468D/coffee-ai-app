"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function craftBlend(stats: { acidity: number; body: number; sweetness: number; bitterness: number }) {
    try {
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
        const text = response.text();
        const aiData = JSON.parse(text.replace(/```json|```/g, "").trim());

        // Save to DB
        const blend = await prisma.blend.create({
            data: {
                name: aiData.name,
                base: "Alchemy Custom",
                milk: "None",
                flavor: aiData.description,
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
    } catch (error) {
        console.error("Crafting error:", error);
        return { success: false, error: "The lab is currently unstable. Please try again later." };
    }
}
