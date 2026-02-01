
import { NextResponse } from 'next/server';

const CITIES_RESOURCE_ID = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba'; // List of settlements
const LIMIT = 15;

const FALLBACK_CITIES = [
    { id: '3000', name: 'ירושלים', symbol: '3000' },
    { id: '5000', name: 'תל אביב - יפו', symbol: '5000' },
    { id: '4000', name: 'חיפה', symbol: '4000' },
    { id: '8300', name: 'ראשון לציון', symbol: '8300' },
    { id: '7900', name: 'פתח תקווה', symbol: '7900' },
    { id: '7400', name: 'אשדוד', symbol: '7400' },
    { id: '6600', name: 'חולון', symbol: '6600' },
    { id: '7000', name: 'נתניה', symbol: '7000' },
    { id: '9000', name: 'באר שבע', symbol: '9000' },
    { id: '8600', name: 'רמת גן', symbol: '8600' },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${CITIES_RESOURCE_ID}&q=${encodeURIComponent(query)}&limit=${LIMIT}`;

        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`External API error: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.success || !data.result || !data.result.records) {
            console.error("Data.gov.il API failed or header mismatch", data);
            return NextResponse.json({ results: [] });
        }

        const records = data.result.records;
        if (records.length === 0) {
            const fallback = FALLBACK_CITIES.filter(c => c.name.includes(query) || c.name.startsWith(query));
            return NextResponse.json({ results: fallback });
        }

        // Dynamic field detection - "List of settlements" usually uses 'שם_ישוב' but let's be safe
        const firstRecord = records[0];
        // Try known keys or find one that looks like a name
        const nameField = Object.keys(firstRecord).find(key =>
            key.includes('שם_ישוב') ||
            key.includes('שם ישוב') ||
            key === 'שם' ||
            key.toLowerCase().includes('name')
        ) || 'שם_ישוב';

        const idField = Object.keys(firstRecord).find(key =>
            key.includes('סמל_ישוב') ||
            key.includes('סמל')
        ) || '_id';

        const results = records.map((record: any) => {
            const nameVal = record[nameField];
            return {
                id: record[idField] || record._id,
                name: (typeof nameVal === 'string' ? nameVal : String(nameVal || '')).trim(),
                symbol: record[idField]
            };
        }).filter((item: any) => !!item.name);
        // Logic: filtered by 'q' from API, so assume relevance. 
        // Client-side filtering can happen if needed, but data.gov.il 'q' is fuzzy.

        const uniqueResults = Array.from(new Set(results.map((a: any) => a.name)))
            .map(name => results.find((a: any) => a.name === name));

        return NextResponse.json({ results: uniqueResults });

    } catch (error) {
        console.error('Error fetching cities:', error);
        // Fallback filter
        const fallback = FALLBACK_CITIES.filter(c => c.name.includes(query) || c.name.startsWith(query));
        return NextResponse.json({ results: fallback });
    }
}
