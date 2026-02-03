const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
// fallback to .env if .env.local doesn't exist or doesn't have the var
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI or DATABASE_URL not found in environment variables.');
    process.exit(1);
}

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    phoneNumber: { type: String },
}, { timestamps: true });

const Branch = mongoose.models.Branch || mongoose.model('Branch', branchSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const count = await Branch.countDocuments();
        if (count > 0) {
            console.log('Branches already seeded. Exiting.');
            process.exit(0);
        }

        const sampleBranches = [
            {
                name: 'Cyber Barista Tel Aviv',
                address: 'Rothschild Blvd 10, Tel Aviv-Yafo',
                lat: 32.062996,
                lng: 34.773822,
                phoneNumber: '03-555-1234'
            },
            {
                name: 'Cyber Barista Herzliya',
                address: 'Aba Eban 1, Herzliya Pituach',
                lat: 32.162413,
                lng: 34.808381,
                phoneNumber: '09-999-5678'
            },
            {
                name: 'Cyber Barista Dizengoff',
                address: 'Dizengoff St 50, Tel Aviv-Yafo',
                lat: 32.077884,
                lng: 34.773177,
                phoneNumber: '03-555-9876'
            }
        ];

        console.log('Inserting branches...');
        await Branch.insertMany(sampleBranches);
        console.log('Successfully seeded branches!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
