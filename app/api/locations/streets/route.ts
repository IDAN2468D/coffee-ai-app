
import { NextResponse } from 'next/server';

const STREETS_RESOURCE_ID = '9ad3862c-8391-4b2f-84a4-2d4c68625f4b';
const LIMIT = 15;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city');

    if (!city || !query) {
        return NextResponse.json({ results: [] });
    }

    try {
        // We need to filter by city name exactly, and search within street name.
        // CKAN 'filters' parameter expects JSON object.
        const filters = JSON.stringify({ "שם_ישוב": city.trim() });

        // We use 'q' for the street name search.
        const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${STREETS_RESOURCE_ID}&q=${encodeURIComponent(query)}&filters=${encodeURIComponent(filters)}&limit=${LIMIT}`;

        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`External API error: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.success) {
            throw new Error("External API reported failure");
        }

        const results = data.result.records.map((record: any) => ({
            id: record._id,
            name: record['שם_רחוב'].trim(),
            city: record['שם_ישוב'].trim()
        }));

        // Remove duplicates
        const uniqueResults = Array.from(new Set(results.map((a: any) => a.name)))
            .map(name => results.find((a: any) => a.name === name));

        return NextResponse.json({ results: uniqueResults });

    } catch (error) {
        console.error('Error fetching streets:', error);
        return NextResponse.json({ error: 'Failed to fetch streets' }, { status: 500 });
    }
}
