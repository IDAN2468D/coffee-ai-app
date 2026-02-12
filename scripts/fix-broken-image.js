
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const productId = '696e0871fdb1bf323473cf14';
    const newImageUrl = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop';

    console.log(`Updating Product ID: ${productId} with new AeroPress image...`);

    try {
        const product = await prisma.product.update({
            where: { id: productId },
            data: { image: newImageUrl }
        });
        console.log(`✅ Successfully updated ${product.name}`);
        console.log(`New Image URL: ${product.image}`);
    } catch (error) {
        console.error(`❌ Failed to update product: ${error.message}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
