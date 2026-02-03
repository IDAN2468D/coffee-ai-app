import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Branch from '@/models/Branch';

export async function GET() {
    await dbConnect();

    try {
        // Check if branches already exist to avoid duplicates
        const count = await Branch.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Branches already seeded', count }, { status: 200 });
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

        await Branch.insertMany(sampleBranches);

        return NextResponse.json({
            message: 'Successfully seeded branches',
            branches: sampleBranches
        }, { status: 201 });

    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
