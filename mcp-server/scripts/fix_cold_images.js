
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load .env file from root
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
    });
}

const prisma = new PrismaClient();

const imageMap = {
    'קולד ברו וניל': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800',
    'קולד ברו עננים': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800',
    'אייס לאטה קלאסי (Classic Iced Latte)': 'https://images.unsplash.com/photo-1559525839-b184a4d6c5af?auto=format&fit=crop&q=80&w=800',
    'אייס אמריקנו (Iced Americano)': 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd74?auto=format&fit=crop&q=80&w=800',
    'נייטרו קולד ברו (Nitro Cold Brew)': 'https://images.unsplash.com/photo-1499961024600-ad094db305cc?auto=format&fit=crop&q=80&w=800'
};

async function main() {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    name: 'Cold'
                }
            }
        });

        for (const p of products) {
            const newImage = imageMap[p.name];
            if (newImage) {
                console.log(`Updating image for ${p.name}...`);
                await prisma.product.update({
                    where: { id: p.id },
                    data: { image: newImage }
                });
            } else {
                console.log(`No new image defined for ${p.name}`);
            }
        }
        console.log('✅ All Cold images updated successfully.');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
