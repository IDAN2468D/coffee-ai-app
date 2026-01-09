import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { prompt, variant = 0 } = await req.json();

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

        // Use curated high-quality coffee images from Unsplash
        const coffeeImages = [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1426260193283-c4daed7c2024?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1544787210-2827448b36ea?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1525193612189-dc88ec0fa8ce?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1508424002438-42fdfae09031?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1024&h=1024&fit=crop',
            'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1024&h=1024&fit=crop'
        ];

        // Select different image for each variant
        const baseIndex = Math.floor(Math.random() * (coffeeImages.length - 5));
        const imageUrl = coffeeImages[(baseIndex + variant) % coffeeImages.length];

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
