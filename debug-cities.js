
async function testCities() {
    const query = "תל";
    const CITIES_RESOURCE_ID = 'b5e27a1b-3b7f-4318-ab02-901b0f1a9a83';
    const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${CITIES_RESOURCE_ID}&q=${encodeURIComponent(query)}&limit=5`;

    console.log("Fetching URL:", url);

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log("Success:", data.success);
        if (data.result && data.result.records) {
            console.log("Found records:", data.result.records.length);
            console.log("First record:", data.result.records[0]);
        } else {
            console.log("No records or bad structure", data);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

testCities();
