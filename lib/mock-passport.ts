
export interface PassportEntry {
    id: number;
    coffeeName: string;
    date: string;
    rating: number;
    notes: string;
    origin: string;
    image: string;
    roastLevel: 'Light' | 'Medium' | 'Dark';
    method: 'Espresso' | 'Pour Over' | 'Cold Brew' | 'French Press';
    barista: string;
}

export const PASSPORT_ENTRIES: PassportEntry[] = [
    {
        id: 1,
        coffeeName: "אתיופיה יירגשף",
        date: "2023-10-15",
        rating: 5,
        notes: "חומציות פירותית מדהימה, טעמי יסמין והדרים. סיומת נקייה מאוד.",
        origin: "Ethiopia",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop",
        roastLevel: 'Light',
        method: 'Pour Over',
        barista: "דני"
    },
    {
        id: 2,
        coffeeName: "קולומביה סופרמו",
        date: "2023-10-18",
        rating: 4,
        notes: "גוף מלא, טעמי אגוז וקרמל. קצת מריר מדי בסוף, אבל משתלב מעולה עם חלב.",
        origin: "Colombia",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
        roastLevel: 'Medium',
        method: 'Espresso',
        barista: "שרה"
    },
    {
        id: 3,
        coffeeName: "ברזיל סרדו",
        date: "2023-10-22",
        rating: 3,
        notes: "סטנדרטי, טוב לקפוצ'ינו אבל לא לאספרסו נקי. טעמים שוקולדיים פשוטים.",
        origin: "Brazil",
        image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=1000&auto=format&fit=crop",
        roastLevel: 'Dark',
        method: 'Espresso',
        barista: "יוסי"
    }
];
