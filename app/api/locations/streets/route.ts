
import { NextResponse } from 'next/server';

const STREETS_RESOURCE_ID = '9ad3862c-8391-4b2f-84a4-2d4c68625f4b';
const LIMIT = 15;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    let city = searchParams.get('city');

    if (!city || !query) {
        return NextResponse.json({ results: [] });
    }

    // Sanitize city name: remove hyphens or spaces if needed? 
    // Usually strict match required but let's try raw first.
    city = city.trim();

    try {
        // We do a full text search using 'q' which includes street name.
        // And we filter by city name.
        // Note: 'filters' param in CKAN must match exact field value.
        // If city name mismatch (e.g. users writes "Tel Aviv" but DB has "Tel Aviv - Yafo"), filter will fail.
        // So we might search ONLY by street name and filter in memory? 
        // No, dataset is huge (all streets in Israel). We MUST filter by city.

        // Strategy: Try exact filter. If empty, maybe try just 'q' with "city street" combined?
        // But 'filters' is safer for performance.

        const filters = JSON.stringify({ "שם_ישוב": city });

        const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${STREETS_RESOURCE_ID}&q=${encodeURIComponent(query)}&filters=${encodeURIComponent(filters)}&limit=${LIMIT}`;

        let res = await fetch(apiUrl);
        let data = await res.json();

        // If no results, maybe city name variant issue?
        // Try searching without city filter but include city in query string? 
        // "Tel Aviv Ibn Gvirol"
        if (!data.success || !data.result || !data.result.records) {
            console.error("Data.gov.il Streets API failed", data);
            return NextResponse.json({ results: [] });
        }

        let records = data.result.records;

        // Dynamic field detection for Streets
        if (records.length > 0) {
            const first = records[0];
            const streetNameField = Object.keys(first).find(k => k.includes('שם_רחוב') || k.includes('שם רחוב')) || 'שם_רחוב';
            const cityNameField = Object.keys(first).find(k => k.includes('שם_ישוב') || k.includes('שם ישוב')) || 'שם_ישוב';

            records = records.map((record: any) => ({
                ...record,
                _extracted_name: record[streetNameField],
                _extracted_city: record[cityNameField]
            }));
        }

        const results = records.map((record: any) => ({
            id: record._id,
            name: (record._extracted_name || record['שם_רחוב'] || '').trim(),
            city: (record._extracted_city || record['שם_ישוב'] || '').trim()
        })).filter((item: any) => item.name);

        const uniqueResults = Array.from(new Set(results.map((a: any) => a.name)))
            .map(name => results.find((a: any) => a.name === name));

        // If we found nothing with strict filter, maybe try relax?
        // But for now, returning unique results is safer.

        return NextResponse.json({ results: uniqueResults });

    } catch (error) {
        console.error('Error fetching streets:', error);
        // Do not error out, just empty
        return NextResponse.json({ results: [] });
    }
}
