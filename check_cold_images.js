
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Manually load .env file
const envPath = path.join(__dirname, '.env');
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

async function main() {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    name: 'Cold'
                }
            },
            select: {
                id: true,
                name: true,
                image: true
            }
        });

        console.log('--- Cold Products ---');
        products.forEach(p => {
            console.log(`ID: ${p.id} | Name: ${p.name}`);
            console.log(`Image: ${p.image || 'MISSING'}`);
            console.log('-------------------');
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
