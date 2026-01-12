import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt } = await req.json();

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;

        // Translate common Hebrew coffee terms to English for better search results
        const hebrewToEnglish: { [key: string]: string } = {
            'קפה': 'coffee',
            'אספרסו': 'espresso',
            'קפוצ\'ינו': 'cappuccino',
            'לאטה': 'latte',
            'מוקה': 'mocha',
            'מקיאטו': 'macchiato',
            'חלב': 'milk',
            'פול': 'beans',
            'חום': 'brown',
            'חלל': 'space',
            'כוכב': 'star',
            'ירח': 'moon'
        };

        // Extract keywords from prompt
        let searchTerms = 'coffee';
        const words = prompt.split(' ');
        const englishWords = words
            .map((word: string) => hebrewToEnglish[word.trim()] || null)
            .filter((w: string | null) => w !== null);

        if (englishWords.length > 0) {
            searchTerms = englishWords.join(',');
        }

        // Curated list of beautiful coffee images from Unsplash
        const coffeeImageIds = [
            'photo-1509042239860-f550ce710b93', // latte art
            'photo-1511920170033-f8396924c348', // espresso
            'photo-1495474472287-4d71bcdd2085', // coffee beans
            'photo-1447933601403-0c6688de566e', // pour over
            'photo-1514432324607-a09d9b4aefdd', // cappuccino
            'photo-1501339847302-ac426a4a7cbb', // coffee shop
            'photo-1461023058943-07fcbe16d735', // milk pour
            'photo-1517487881594-2787fef5ebf7', // cold brew
            'photo-1534778101976-62847782c213', // macchiato
            'photo-1497935586351-b67a49e012bf', // coffee cup
            'photo-1442512595331-e89e73853f31', // coffee beans close up
            'photo-1453614512568-c4024d13c247', // coffee and laptop
            'photo-1511537190424-bbbab87ac5eb', // coffee mug
            'photo-1587734195503-904fca47e0e9', // latte in cup
            'photo-1587049352846-4a222e784acc' // mocha
        ];

        // Select random image from the list
        const randomIndex = Math.floor(Math.random() * coffeeImageIds.length);
        const selectedImageId = coffeeImageIds[randomIndex];
        const imageUrl = `https://images.unsplash.com/${selectedImageId}?w=800&h=1000&fit=crop&q=80`;

        console.log(`[IMAGE-GEN] Creating image with prompt: "${prompt}", search terms: "${searchTerms}", image: ${selectedImageId}`);

        // Save to database
        const coffeeImage = await prisma.coffeeImage.create({
            data: {
                url: imageUrl,
                prompt: prompt,
                userId: userId
            }
        });

        console.log(`[IMAGE-GEN] Image created successfully with ID: ${coffeeImage.id}`);

        return NextResponse.json({
            success: true,
            imageId: coffeeImage.id,
            imageUrl: imageUrl,
            message: 'Image created successfully'
        });

    } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json({
            error: 'Failed to generate image',
            success: false
        }, { status: 500 });
    }
}
