
import { Product, PRODUCTS } from './products';

interface PairingSuggestion {
    suggestedProduct: Product;
    reason: string;
}

export function getAIPairing(product: Product): PairingSuggestion | null {
    // Logic: 
    // Hot Coffee -> Pastry
    // Cold Coffee -> Sweet Pastry
    // Beans -> Equipment
    // Pastry -> Coffee

    // Don't suggest if it's already a pastry
    if (product.category === 'Pastry') return null;

    let suggestedId = '';
    let reason = '';

    if (product.category === 'Beans') {
        suggestedId = '19'; // Mug
        reason = "פולים איכותיים חייבים ספל ראוי.";
    } else if (product.category === 'Equipment') {
        suggestedId = '8'; // Beans
        reason = "ציוד חדש? הגיע הזמן לנסות פולים חדשים.";
    } else if (product.category === 'Capsules') {
        suggestedId = '16'; // Brownie
        reason = "קפסולות מעולות דורשות שוקולד בצד. הבראוניז שלנו הם השידוך המושלם.";
    } else if (product.name?.toLowerCase().includes('strong') || product.description?.toLowerCase().includes('intense') || product.id === '1') {
        suggestedId = '5'; // Croissant
        reason = "אספרסו חזק הולך בול עם קרואסון חמאה עשיר.";
    } else if (product.category === 'Cold') {
        suggestedId = '17'; // Scone
        reason = "קפה קר ומרענן משלים נהדר סקונס אוכמניות.";
    } else {
        // Generic Hot or others
        suggestedId = '20'; // Suggest Capsules instead of always brownie for generic hot
        reason = "אהבת את זה? נסה גם את קפסולות הבית שלנו - Veloce Arabica.";
    }

    const suggestion = PRODUCTS.find(p => p.id === suggestedId);

    if (!suggestion || suggestion.id === product.id) return null;

    return {
        suggestedProduct: suggestion,
        reason
    };
}
