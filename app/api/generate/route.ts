import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TIER_BENEFITS, UserTier } from '@/lib/tiers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { prompt, variant = 0 } = await req.json();

        if (session?.user) {
            const user = await prisma.user.findUnique({
                where: { id: (session.user as any).id },
                select: { tier: true }
            });
            const userTier: UserTier = (user?.tier as UserTier) || 'SILVER';
            const benefits = TIER_BENEFITS[userTier];

            if (benefits.aiAccess === false) {
                const fallbackUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1024&auto=format&fit=crop";
                return NextResponse.json({
                    url: fallbackUrl,
                    message: "שדרג ל-Gold כדי ליהנות מהמלצות AI אישיות!",
                    isLocked: true
                });
            }
        }

        if (!process.env.GEMINI_API_KEY) {
            console.warn("⚠️ No Gemini API Key found. Please add GEMINI_API_KEY to your .env file");

            // Fallback to Unsplash with different variations
            const fallbackImages = [
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1024&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1024&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1024&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1024&auto=format&fit=crop"
            ];

            const imageUrl = fallbackImages[variant % fallbackImages.length];

            if (session?.user) {
                await prisma.coffeeImage.create({
                    data: {
                        url: imageUrl,
                        prompt: prompt,
                        userId: (session.user as any).id,
                        isPublic: true
                    }
                });
            }

            return NextResponse.json({
                url: imageUrl,
                message: "⚠️ Using fallback image. Add GEMINI_API_KEY for AI generation.",
                usingFallback: true
            });
        }

        // Use Gemini to generate a detailed image prompt
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const enhancementPrompt = `You are a professional coffee photographer. Create a detailed, vivid description for generating a coffee image based on this: "${prompt}". 

Include details about:
- The coffee type and presentation
- Lighting and atmosphere
- Colors and textures
- Background and setting
- Professional photography style

Make it specific and visual. End with photography keywords like "professional photography, high resolution, 8k, studio lighting". Keep it under 150 words.

Enhanced prompt:`;

        const result = await model.generateContent(enhancementPrompt);
        const enhancedPrompt = result.response.text();

        console.log("🎨 Enhanced prompt:", enhancedPrompt);

        // Extract key coffee-related keywords from enhanced prompt
        const coffeeKeywords = [
            'coffee', 'espresso', 'latte', 'cappuccino', 'mocha', 'americano',
            'macchiato', 'cortado', 'flat white', 'cold brew', 'iced coffee',
            'pour over', 'french press', 'cafe', 'barista', 'cup', 'mug'
        ];

        // Build search query from prompt
        let searchQuery = 'coffee';
        const lowercasePrompt = (prompt + ' ' + enhancedPrompt).toLowerCase();

        // Find relevant coffee keywords
        const foundKeywords = coffeeKeywords.filter(kw => lowercasePrompt.includes(kw));
        if (foundKeywords.length > 0) {
            searchQuery = foundKeywords.slice(0, 3).join(' ');
        }

        // Add variant for diversity
        const variants = ['art', 'photography', 'aesthetic', 'beautiful', 'professional'];
        searchQuery += ' ' + variants[variant % variants.length];

        console.log("☕ Coffee search query:", searchQuery);

        // Use Pollinations.ai for real AI image generation (Free, no key required)
        // We use the enhanced prompt to get better results
        const encodedPrompt = encodeURIComponent(enhancedPrompt.slice(0, 1000)); // Limit length just in case
        const seed = Math.floor(Math.random() * 1000000);

        // Construct visual URL with high quality parameters
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

        console.log("🎨 Generated Pollinations URL:", imageUrl);

        // Save to DB if user is logged in
        if (session?.user) {
            await prisma.coffeeImage.create({
                data: {
                    url: imageUrl,
                    prompt: enhancedPrompt,
                    userId: (session.user as any).id,
                    isPublic: true
                }
            });
        }

        return NextResponse.json({
            url: imageUrl,
            enhancedPrompt: enhancedPrompt,
            searchQuery: searchQuery,
            message: "Generated with AI enhancement!"
        });

    } catch (error) {
        console.error("❌ Error with AI generation:", error);

        // Emergency fallback
        const fallbackUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1024&auto=format&fit=crop";
        return NextResponse.json({
            url: fallbackUrl,
            error: "AI generation failed, using fallback image",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
