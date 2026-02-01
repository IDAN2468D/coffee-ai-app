
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
        // Construct the CKAN datastore search URL
        // We use 'distinct' to uppercase or just standard search. 
        // The field for city name is usually 'שם_ישוב'.
        // We can use a simple SQL-like query or simple q parameter.
        const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${CITIES_RESOURCE_ID}&q=${encodeURIComponent(query)}&limit=${LIMIT}`;

        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`External API error: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.success) {
            throw new Error("External API reported failure");
        }

        // Map the results to a simple format
        // Modify this based on actual field names if needed.
        // Usually: "שם_ישוב", "סמל_ישוב"
        const results = data.result.records.map((record: any) => ({
            id: record._id,
            name: record['שם_ישוב'].trim(), // Assuming Hebrew field name
            symbol: record['סמל_ישוב']
        })).filter((item: any) => item.name.includes(query) || item.name.startsWith(query));
        // The API 'q' is a full text search, so we might get loose matches. 
        // We can refine clientside or here.  

        // Remove duplicates if any (though records have unique IDs, names might duplicate slightly?)
        const uniqueResults = Array.from(new Set(results.map((a: any) => a.name)))
            .map(name => results.find((a: any) => a.name === name));

        return NextResponse.json({ results: uniqueResults });

    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }
}
