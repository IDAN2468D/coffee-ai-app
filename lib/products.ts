export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'Hot' | 'Cold' | 'Pastry' | 'Beans' | 'Equipment';
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Midnight Espresso',
        description: 'A deep, intense shot of pure Arabian coffee with notes of dark chocolate.',
        price: 3.50,
        image: '/images/products/espresso.jpg',
        category: 'Hot'
    },
    {
        id: '13',
        name: 'Honey Oak Cortado',
        description: 'Smooth espresso cut with warm oat milk and a touch of wild honey.',
        price: 4.50,
        image: '/images/products/oak-cortado.jpg',
        category: 'Hot'
    },
    {
        id: '14',
        name: 'Lavender Fields Latte',
        description: 'Creamy latte infused with organic culinary lavender and floral sweetness.',
        price: 5.40,
        image: '/images/products/lavender-latte.jpg',
        category: 'Hot'
    },
    {
        id: '4',
        name: 'Iced Vanilla Cold Brew',
        description: 'Slow-steeped for 20 hours, served over ice with a splash of sweet cream.',
        price: 5.20,
        image: '/images/products/cold-brew.jpg',
        category: 'Cold'
    },
    {
        id: '15',
        name: 'Cloud Cold Foam Brew',
        description: 'Signature cold brew topped with thick, airy vanilla bean cold foam.',
        price: 5.80,
        image: '/images/products/cloud-brew.jpg',
        category: 'Cold'
    },
    {
        id: '5',
        name: 'Artisan Croissant',
        description: 'Flaky, buttery pastry baked fresh every morning in our shop.',
        price: 3.00,
        image: '/images/products/croissant.jpg',
        category: 'Pastry'
    },
    {
        id: '16',
        name: 'Dark Chocolate Brownie',
        description: 'Fudgy, espresso-infused dark chocolate brownie with sea salt flakes.',
        price: 3.90,
        image: '/images/products/brownie.jpg',
        category: 'Pastry'
    },
    {
        id: '17',
        name: 'Blueberry Zen Scone',
        description: 'Tender lemon-zest scone packed with wild blueberries and sugar crystals.',
        price: 3.50,
        image: '/images/products/scone.jpg',
        category: 'Pastry'
    },
    {
        id: '8',
        name: 'Ethiopian Yirgacheffe',
        description: 'Specially sourced beans with bright acidity and floral jasmine notes.',
        price: 18.00,
        image: '/images/products/beans-ethiopia.jpg',
        category: 'Beans'
    },
    {
        id: '18',
        name: 'Golden Hour V60 Kit',
        description: 'Complete pour-over starter kit including dripper, filters, and glass server.',
        price: 45.00,
        image: '/images/products/v60-kit.jpg',
        category: 'Equipment'
    },
    {
        id: '19',
        name: 'Heritage Ceramic Mug',
        description: 'Hand-thrown 12oz ceramic mug in our signature matte basalt finish.',
        price: 22.00,
        image: '/images/products/mug.jpg',
        category: 'Equipment'
    }
];
