const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'Midnight Espresso',
            description: 'A deep, intense shot of pure Arabian coffee with notes of dark chocolate.',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot'
        },
        {
            name: 'Honey Oak Cortado',
            description: 'Smooth espresso cut with warm oat milk and a touch of wild honey.',
            price: 4.50,
            image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot'
        },
        {
            name: 'Lavender Fields Latte',
            description: 'Creamy latte infused with organic culinary lavender and floral sweetness.',
            price: 5.40,
            image: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot'
        },
        {
            name: 'Iced Vanilla Cold Brew',
            description: 'Slow-steeped for 20 hours, served over ice with a splash of sweet cream.',
            price: 5.20,
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1000&auto=format&fit=crop',
            category: 'Cold'
        },
        {
            name: 'Cloud Cold Foam Brew',
            description: 'Signature cold brew topped with thick, airy vanilla bean cold foam.',
            price: 5.80,
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1000&auto=format&fit=crop',
            category: 'Cold'
        },
        {
            name: 'Artisan Croissant',
            description: 'Flaky, buttery pastry baked fresh every morning in our shop.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
            category: 'Pastry'
        },
        {
            name: 'Dark Chocolate Brownie',
            description: 'Fudgy, espresso-infused dark chocolate brownie with sea salt flakes.',
            price: 3.90,
            image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&w=1000&auto=format&fit=crop',
            category: 'Pastry'
        },
        {
            name: 'Blueberry Zen Scone',
            description: 'Tender lemon-zest scone packed with wild blueberries and sugar crystals.',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=1000&auto=format&fit=crop',
            category: 'Pastry'
        },
        {
            name: 'Ethiopian Yirgacheffe',
            description: 'Specially sourced beans with bright acidity and floral jasmine notes.',
            price: 18.00,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop',
            category: 'Beans'
        },
        {
            name: 'Golden Hour V60 Kit',
            description: 'Complete pour-over starter kit including dripper, filters, and glass server.',
            price: 45.00,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
            category: 'Equipment'
        },
        {
            name: 'Heritage Ceramic Mug',
            description: 'Hand-thrown 12oz ceramic mug in our signature matte basalt finish.',
            price: 22.00,
            image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1000&auto=format&fit=crop',
            category: 'Equipment'
        }
    ];

    console.log('Clearing existing data...');
    // Delete in order to avoid foreign key constraints
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('Seeding categories...');
    const categoriesMap = {};
    const categoryNames = ['Hot', 'Cold', 'Pastry', 'Beans', 'Equipment'];

    for (const name of categoryNames) {
        const cat = await prisma.category.create({ data: { name } });
        categoriesMap[name] = cat.id;
    }

    console.log('Seeding products...');
    for (const p of products) {
        const categoryId = categoriesMap[p.category];
        // Remove the string 'category' field and use 'categoryId'
        const { category, ...productData } = p;
        if (categoryId) {
            await prisma.product.create({
                data: {
                    ...productData,
                    categoryId: categoryId
                }
            });
        } else {
            console.warn(`Category ${p.category} not found for product ${p.name}`);
            await prisma.product.create({ data: productData });
        }
    }

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
