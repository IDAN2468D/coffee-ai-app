
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

    try {
        // Strategy: Use full text search 'q' with both street and city to find matches even if city name isn't exact.
        // This is more robust than strict 'filters' which requires exact string match.
        const combinedQuery = `${query} ${city}`;

        const apiUrl = `https://data.gov.il/api/3/action/datastore_search?resource_id=${STREETS_RESOURCE_ID}&q=${encodeURIComponent(combinedQuery)}&limit=${LIMIT}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

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

        // Optional: Filter by city if we got results from other cities (though 'q' usually handles it well)
        // We use loose matching to allow "Tel Aviv" to match "Tel Aviv - Yafo"
        const filteredResults = results.filter((item: any) => {
            if (!item.city) return true;
            return item.city.includes(city) || city.includes(item.city) || (item.city.includes('תל אביב') && city.includes('תל אביב'));
        });

        const uniqueResults = Array.from(new Set(filteredResults.map((a: any) => a.name)))
            .map(name => filteredResults.find((a: any) => a.name === name));

        return NextResponse.json({ results: uniqueResults });

    } catch (error) {
        console.error('Error fetching streets:', error);
        // Do not error out, just empty
        return NextResponse.json({ results: [] });
    }
}
