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
        console.log('STORES_DEBUG: Starting getBranches...');

        const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
        if (!MONGODB_URI) {
            console.error('STORES_DEBUG: Database environment variables are missing');
            return [];
        }

        console.log('STORES_DEBUG: Connecting to database...');
        await dbConnect();

        console.log('STORES_DEBUG: Fetching branches from MongoDB...');
        // Ensure model exists and find
        if (!Branch) {
            console.error('STORES_DEBUG: Branch model is not registered');
            return [];
        }

        const rawBranches = await Branch.find({}).select('name address lat lng phoneNumber createdAt updatedAt').lean();

        console.log(`STORES_DEBUG: Found ${rawBranches?.length || 0} branches`);

        if (!rawBranches || rawBranches.length === 0) {
            return [];
        }

        const serializedBranches = rawBranches.map((branch: any) => ({
            _id: String(branch._id || Math.random()),
            name: String(branch.name || 'Unknown Store'),
            address: String(branch.address || 'No Address Provided'),
            lat: Number(branch.lat || 32.0853),
            lng: Number(branch.lng || 34.7818),
            phoneNumber: String(branch.phoneNumber || ''),
            createdAt: branch.createdAt ? new Date(branch.createdAt).toISOString() : '',
            updatedAt: branch.updatedAt ? new Date(branch.updatedAt).toISOString() : ''
        }));

        // Deep clone for safety
        return JSON.parse(JSON.stringify(serializedBranches));
    } catch (error: any) {
        console.error('STORES_DEBUG_ERROR: Full error:', error?.message || error);
        return [];
    }
}

export default async function StoresPage() {
    try {
        const branches = await getBranches();
        return <StoresClient branches={branches} />;
    } catch (err: any) {
        console.error('STORES_PAGE_CRITICAL_ERROR:', err?.message || err);
        // Fallback to empty branches if everything fails
        return <StoresClient branches={[]} />;
    }
}
