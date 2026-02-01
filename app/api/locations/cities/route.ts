
import { NextResponse } from 'next/server';

const CITIES_RESOURCE_ID = 'b5e27a1b-3b7f-4318-ab02-901b0f1a9a83'; // List of settlements
const LIMIT = 15;

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
        if (records.length === 0) return NextResponse.json({ results: [] });

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
        return NextResponse.json({ results: [] });
    }
}
