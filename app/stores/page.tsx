import dbConnect from '@/lib/dbConnect';
import Branch, { IBranch } from '@/models/Branch';
import StoresClient from './StoresClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface IProcessedBranch {
    _id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}

async function getBranches(): Promise<IProcessedBranch[]> {
    try {
        if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
            console.error('STORES_DEBUG: Database environment variables are missing');
            return [];
        }

        console.log('STORES_DEBUG: Connecting to database...');
        await dbConnect();

        console.log('STORES_DEBUG: Fetching branches from MongoDB...');
        // Explicitly selecting fields and using .lean()
        const rawBranches = await Branch.find({}).select('name address lat lng phoneNumber createdAt updatedAt').lean();

        console.log(`STORES_DEBUG: Found ${rawBranches?.length || 0} branches`);

        if (!rawBranches || rawBranches.length === 0) {
            return [];
        }

        const serializedBranches = rawBranches.map((branch: any) => ({
            _id: branch._id?.toString() || Math.random().toString(),
            name: branch.name || 'Unknown Store',
            address: branch.address || 'No Address Provided',
            lat: branch.lat || 32.0853,
            lng: branch.lng || 34.7818,
            phoneNumber: branch.phoneNumber || '',
            createdAt: branch.createdAt?.toISOString() || '',
            updatedAt: branch.updatedAt?.toISOString() || ''
        }));

        // Final deep clone to ensure pure objects for Next.js serialization
        return JSON.parse(JSON.stringify(serializedBranches));
    } catch (error: any) {
        console.error('STORES_DEBUG_ERROR: Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return [];
    }
}

export default async function StoresPage() {
    const branches = await getBranches();
    return <StoresClient branches={branches} />;
}
