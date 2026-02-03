'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default Leaflet icons in Webpack/Next.js
// We need to define the custom icon to avoid 404s on marker images
// These will be initialized inside the component to ensure they only run on the client.
let customIcon: Icon;
let defaultIcon: Icon;

interface Branch {
    _id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    phoneNumber?: string;
}

interface StoreMapProps {
    branches: Branch[];
}

export default function StoreMap({ branches }: StoreMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Initialize icons only once on the client
        if (!defaultIcon) {
            defaultIcon = new Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        }

        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>;
    }

    // Default center (Tel Aviv)
    const defaultCenter: [number, number] = [32.0853, 34.7818];

    return (
        <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 z-0">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {branches.map((branch) => (
                    <Marker
                        key={branch._id}
                        position={[branch.lat, branch.lng]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-lg text-amber-900">{branch.name}</h3>
                                <p className="text-sm text-gray-600">{branch.address}</p>
                                {branch.phoneNumber && (
                                    <p className="text-sm text-gray-500 mt-1">📞 {branch.phoneNumber}</p>
                                )}
                                <a
                                    href={`https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-xs bg-amber-600 text-white px-3 py-1 rounded-full hover:bg-amber-700 transition-colors"
                                >
                                    Navigate
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
