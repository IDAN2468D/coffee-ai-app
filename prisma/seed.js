const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'אספרסו חצות (Midnight Espresso)',
            description: 'שוט עמוק ואינטנסיבי של קפה ערביקה טהור עם תווים של שוקולד מריר.',
            price: 14.00,
            image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot'
        },
        {
            name: 'קורטדו דבש ואלון',
            description: 'אספרסו חלק חתוך עם חלב שיבולת שועל חם ומגע של דבש פרחי בר.',
            price: 18.00,
            image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot'
        },
        {
            name: 'לאטה שדות לבנדר',
            description: 'לאטה קרמי מתובל בלבנדר קולינרי אורגני ומתיקות פרחונית עדינה.',
            price: 22.00,
            image: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot'
        },
        {
            name: 'קולד ברו וניל',
            description: 'חליטה איטית של 20 שעות, מוגשת על קרח עם נגיעה של שמנת מתוקה.',
            price: 20.00,
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1000&auto=format&fit=crop',
            category: 'Cold'
        },
        {
            name: 'קולד ברו עננים',
            description: 'קולד ברו הבית שלנו מכוסה בקצף וניל סמיך ואוורירי.',
            price: 24.00,
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1000&auto=format&fit=crop',
            category: 'Cold'
        },
        {
            name: 'קרואסון חמאה ארטיזן',
            description: 'מאפה שכבות חמאתי ופריך, נאפה טרי בכל בוקר במאפייה שלנו.',
            price: 16.00,
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
            category: 'Pastry'
        },
        {
            name: 'בראוניז שוקולד מריר',
            description: 'בראוניז פאדג׳י עשיר בקפה ושוקולד מריר עם פתיתי מלח ים.',
            price: 18.00,
            image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&w=1000&auto=format&fit=crop',
            category: 'Pastry'
        },
        {
            name: 'סקונס אוכמניות זן',
            description: 'סקונס רך עם גרידת לימון, עמוס באוכמניות בר וגבישי סוכר.',
            price: 16.00,
            image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=1000&auto=format&fit=crop',
            category: 'Pastry'
        },
        {
            name: 'אתיופיה ירגשף (250 גרם)',
            description: 'פולים מובחרים בייבוש טבעי עם חומציות בהירה ותווי יסמין פרחוניים.',
            price: 65.00,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop',
            category: 'Beans'
        },
        {
            name: 'ערכת V60 שעה זהובה',
            description: 'ערכת פור-אובר למתחילים הכוללת טפטפת, מסננים וקנקן זכוכית.',
            price: 180.00,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
            category: 'Equipment'
        },
        {
            name: 'ספל קרמיקה עבודת יד',
            description: 'ספל קרמיקה 350 מ"ל בעבודת יד בגימור בזלת מט הייחודי לנו.',
            price: 85.00,
            image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1000&auto=format&fit=crop',
            category: 'Equipment'
        },
        {
            name: 'מארז התנסות סטארבקס (50 קפסולות)',
            description: 'מיקס 5 שרוולים (50 קפסולות) הכולל: House Blend, Pike Place, Colombia, Espresso Roast, Decaf. מגוון דרגות חוזק.',
            price: 95.00,
            image: '/images/bundles/pack-50.svg',
            category: 'Capsules'
        },
        {
            name: 'מארז הבית ענק (100 קפסולות)',
            description: '10 שרוולים של התערובות האהובות ביותר. מתאים למכונות Nespresso. מחיר מיוחד למזמינים באתר.',
            price: 180.00,
            image: '/images/bundles/pack-100.svg',
            category: 'Capsules'
        },
        {
            name: 'מארז משרדי מושלם (30 שרוולים)',
            description: '300 קפסולות במחיר סיטונאי! מגוון טעמים לבחירה או המיקס המומלץ שלנו. הפתרון המושלם למשרד.',
            price: 490.00,
            image: '/images/bundles/pack-300.svg',
            category: 'Capsules'
        }
    ];

    console.log('Clearing existing data...');
    // Delete in order to avoid foreign key constraints
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('Seeding categories...');
    const categoriesMap = {};
    const categoryNames = ['Hot', 'Cold', 'Pastry', 'Beans', 'Equipment', 'Capsules'];

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
