
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// רשימת תמונות אקראיות לשימוש אם אין לנו מודל ליצירת תמונות בזמן אמת
const RANDOM_IMAGES = [
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=1000"
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function generateProductData(categoryName: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
      You are a coffee shop manager. Generate a creative, unique new coffee product for the category "${categoryName}".
      Return ONLY a valid JSON object with the following fields:
      - name: A creative name in Hebrew.
      - description: A short, appetizing description in Hebrew (1-2 sentences).
      - price: A number between 12 and 35.
      
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating with AI, falling back to defaults", error);
        return {
            name: `הפתעת ${categoryName} ${Math.floor(Math.random() * 1000)}`,
            description: "טעם חדש ומפתיע, נסו עכשיו!",
            price: 15
        };
    }
}

async function main() {
    console.log("Starting daily product generation...");

    try {
        const categories = await prisma.category.findMany();

        for (const category of categories) {
            console.log(`Generating product for category: ${category.name}`);

            const productData = await generateProductData(category.name);

            const randomImage = RANDOM_IMAGES[Math.floor(Math.random() * RANDOM_IMAGES.length)];

            const newProduct = await prisma.product.create({
                data: {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    categoryId: category.id,
                    image: randomImage,
                    isArchived: false
                }
            });

            console.log(`Created: ${newProduct.name}`);
        }

        console.log("Done!");
    } catch (e) {
        console.error("Error in daily job:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
