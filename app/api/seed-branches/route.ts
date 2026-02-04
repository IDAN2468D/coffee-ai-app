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
                name: 'Cyber Barista Tel Aviv - Rothschild',
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
                name: 'Cyber Barista Jerusalem - Old City',
                address: 'Jaffa Gate, Jerusalem',
                lat: 31.7767,
                lng: 35.2275,
                phoneNumber: '02-666-1122'
            },
            {
                name: 'Cyber Barista Haifa - Port',
                address: 'HaNamal St 24, Haifa',
                lat: 32.8192,
                lng: 34.9995,
                phoneNumber: '04-888-3344'
            },
            {
                name: 'Cyber Barista Beer Sheva',
                address: 'Rager Blvd, Beer Sheva',
                lat: 31.2588,
                lng: 34.7978,
                phoneNumber: '08-777-5566'
            },
            {
                name: 'Cyber Barista Rishon LeZion',
                address: 'Moshe Dayan St, Rishon LeZion',
                lat: 31.9730,
                lng: 34.7925,
                phoneNumber: '03-444-8899'
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
