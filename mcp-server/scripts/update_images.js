
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
            // Remove quotes if present
            process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
    });
}

const prisma = new PrismaClient();

async function main() {
    const updates = [
        {
            id: '697f7fca3d76df70fc12479c', // Iced Latte
            image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd74?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: '697f7fcb3d76df70fc12479d', // Iced Americano
            image: 'https://images.unsplash.com/photo-1553909489-cd47e3b20280?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: '697f7fcb3d76df70fc12479e', // Nitro Cold Brew
            image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000&auto=format&fit=crop'
        }
    ];

    for (const update of updates) {
        try {
            const product = await prisma.product.update({
                where: { id: update.id },
                data: { image: update.image }
            });
            console.log(`Updated ${product.name}`);
        } catch (error) {
            console.error(`Failed to update ${update.id}: ${error.message}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
