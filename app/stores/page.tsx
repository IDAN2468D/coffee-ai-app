import dynamicHelper from 'next/dynamic';
import dbConnect from '@/lib/dbConnect';
import Branch, { IBranch } from '@/models/Branch';

// Dynamically import StoreMap with ssr: false to prevent Leaflet window errors
const StoreMap = dynamicHelper(() => import('@/components/StoreMap'), {
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-500 font-medium">Preparing Map...</div>,
    ssr: false
});

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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-amber-900">Our Branches</h1>

            <div className="max-w-4xl mx-auto mb-10 text-center">
                <p className="text-lg text-gray-700 mb-6">
                    Find your nearest Cyber Barista location. We are serving future coffee all across the country.
                </p>
            </div>

            <StoreMap branches={branches} />

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {branches.map((branch: IProcessedBranch) => (
                    <div key={branch._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold mb-2 text-amber-800">{branch.name}</h3>
                        <p className="text-gray-600 mb-2">{branch.address}</p>
                        {branch.phoneNumber && (
                            <p className="text-gray-500 text-sm mb-4">📞 {branch.phoneNumber}</p>
                        )}
                        <a
                            href={`https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 font-medium hover:text-amber-800"
                        >
                            Get Directions &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
