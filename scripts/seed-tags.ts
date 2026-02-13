/**
 * Temporary script to seed product tags for AI Brewmaster context.
 * Run with: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-tags.ts
 * Or:       npx tsx scripts/seed-tags.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tag mapping by category name
const categoryTagMap: Record<string, string[]> = {
    'Hot': ['Morning', 'Energy', 'Warming', 'Rainy', 'Cold'],
    'Cold': ['Afternoon', 'Sunny', 'Refreshing'],
    'Coffee': ['Morning', 'Energy', 'Warming'],
    'Pastry': ['PASTRY', 'Afternoon', 'Comfort', 'Rainy'],
    'Bakery': ['PASTRY', 'Afternoon', 'Comfort', 'Rainy'],
    'Beans': ['Morning', 'Energy'],
    'Equipment': ['Morning'],
    'Capsules': ['Morning', 'Energy', 'Refreshing'],
};

async function seedTags() {
    console.log('🏷️  Seeding product tags...\n');

    const products = await prisma.product.findMany({
        include: { category: true },
    });

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
        // Skip products that already have tags
        if (product.tags && product.tags.length > 0) {
            console.log(`  ⏭️  ${product.name} — already has tags: [${product.tags.join(', ')}]`);
            skipped++;
            continue;
        }

        const categoryName = product.category?.name || '';
        const tags = categoryTagMap[categoryName] || ['General'];

        await prisma.product.update({
            where: { id: product.id },
            data: { tags },
        });

        console.log(`  ✅ ${product.name} (${categoryName}) → [${tags.join(', ')}]`);
        updated++;
    }

    console.log(`\n📊 Done! Updated: ${updated}, Skipped: ${skipped}, Total: ${products.length}`);
}

seedTags()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
