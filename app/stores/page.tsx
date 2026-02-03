import dynamic from 'next/dynamic';
import dbConnect from '@/lib/dbConnect';
import Branch, { IBranch } from '@/models/Branch';

// Dynamically import StoreMap with ssr: false to prevent Leaflet window errors
const StoreMap = dynamic(() => import('@/components/StoreMap').then((mod) => mod.default), {
    loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-500 font-medium">Preparing Map...</div>,
    ssr: false
});

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
    await dbConnect();
    // Using .lean() to get POJOs and avoiding hydration issues
    // Convert _id to string for serialization
    const branches = await Branch.find({}).lean();

    return branches.map((branch: IBranch) => ({
        ...branch,
        _id: branch._id.toString(),
        // Ensure dates are strings if we use them, though they aren't in the interface right now
        createdAt: branch.createdAt?.toISOString(),
        updatedAt: branch.updatedAt?.toISOString()
    }));
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
