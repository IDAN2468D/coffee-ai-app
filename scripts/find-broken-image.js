
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Searching for broken image URL in Products...");
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { image: { contains: 'paramicafe.cl' } },
                { description: { contains: 'paramicafe.cl' } }
            ]
        }
    });

    if (products.length > 0) {
        console.log("Found in Products:");
        products.forEach(p => console.log(`- ID: ${p.id}, Name: ${p.name}, Image: ${p.image}`));
    } else {
        console.log("Not found in Products.");
    }

    console.log("\nSearching in Images...");
    const images = await prisma.image.findMany({
        where: {
            url: { contains: 'paramicafe.cl' }
        }
    });

    if (images.length > 0) {
        console.log("Found in Images:");
        images.forEach(img => console.log(`- ID: ${img.id}, URL: ${img.url}, ProductId: ${img.productId}`));
    } else {
        console.log("Not found in Images.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
