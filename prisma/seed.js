const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'אספרסו חצות (Midnight Espresso)',
            description: 'שוט עמוק ואינטנסיבי של קפה ערביקה טהור עם תווים של שוקולד מריר.',
            price: 14.00,
            image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot',
            roast: 'DARK',
            flavor: ['CHOCOLATY']
        },
        {
            name: 'קורטדו דבש ואלון',
            description: 'אספרסו חלק חתוך עם חלב שיבולת שועל חם ומגע של דבש פרחי בר.',
            price: 18.00,
            image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot',
            roast: 'MEDIUM',
            flavor: ['NUTTY']
        },
        {
            name: 'לאטה שדות לבנדר',
            description: 'לאטה קרמי מתובל בלבנדר קולינרי אורגני ומתיקות פרחונית עדינה.',
            price: 22.00,
            image: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=1000&auto=format&fit=crop',
            category: 'Hot',
            roast: 'LIGHT',
            flavor: ['FRUITY']
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
            name: 'מארז התנסות Starbucks',
            description: 'מארז הכולל מגוון טעמי סטארבקס להתנסות - קלייה בינונית וחזקה.',
            price: 29.90,
            category: 'Capsules',
            image: 'https://images.unsplash.com/photo-1641804732000-36f84e887b21?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'מארז הבית - 100 קפסולות',
            description: 'המארז המשתלם ביותר. תערובת הבית האהובה באריזת חיסכון ענקית.',
            price: 110.00,
            category: 'Capsules',
            image: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'קפה אתיופיה (Single Origin)',
            description: '100% ערביקה מאתיופיה. טעמים פירותיים וחומציות עדינה.',
            price: 22.00,
            category: 'Capsules',
            image: 'https://images.unsplash.com/photo-1587859892837-238d8212626e?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'אספרסו נטול קפאין',
            description: 'טעם עשיר ללא קפאין. מתאים לשעות הערב.',
            price: 20.00,
            category: 'Capsules',
            image: 'https://images.unsplash.com/photo-1627850604058-52e40de1b847?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'מארז משרדי - 300 קפסולות',
            description: 'פתרון מושלם למשרדים. מגוון טעמים לבחירה.',
            price: 290.00,
            category: 'Capsules',
            image: 'https://images.unsplash.com/photo-1517088455889-1fc7b1d1f054?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'קולומביה סופרמו',
            description: 'קפה מאוזן עם גוף מלא ונגיעות אגוזים.',
            price: 24.00,
            category: 'Capsules',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'
        }
    ];

    console.log('Clearing existing data...');
    // Delete in order to avoid foreign key constraints
    await prisma.review.deleteMany({});
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
