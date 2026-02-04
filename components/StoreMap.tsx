'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

export default function StoreMap({ branches = [] }: StoreMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [leafletIcon, setLeafletIcon] = useState<any>(null);

    useEffect(() => {
        // Only run on client
        const initMap = async () => {
            try {
                const L = await import('leaflet');

                // Fix for default Leaflet icons
                const icon = new L.Icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                setLeafletIcon(icon);
                setIsMounted(true);
            } catch (err) {
                console.error('Failed to initialize Leaflet:', err);
            }
        };

        if (typeof window !== 'undefined') {
            initMap();
        }
    }, []);

    if (!isMounted || !leafletIcon) {
        return (
            <div className="h-[500px] w-full bg-stone-50 animate-pulse rounded-2xl flex items-center justify-center border border-stone-200">
                <div className="text-stone-400 font-medium">טוען מפה...</div>
            </div>
        );
    }

    // Default center (Tel Aviv)
    const defaultCenter: [number, number] = [32.0853, 34.7818];

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-stone-200 z-0 relative">
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
                {branches && branches.length > 0 && branches.map((branch) => (
                    <Marker
                        key={branch._id}
                        position={[branch.lat, branch.lng]}
                        icon={leafletIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="text-right p-1" dir="rtl">
                                <h3 className="font-bold text-amber-900 mb-1">{branch.name}</h3>
                                <p className="text-xs text-stone-600 mb-2">{branch.address}</p>
                                {branch.phoneNumber && (
                                    <p className="text-xs text-stone-500 mb-2">📞 {branch.phoneNumber}</p>
                                )}
                                <a
                                    href={`https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full text-center py-1.5 px-3 bg-[#C37D46] text-white text-[10px] font-bold rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    ניווט עם Waze
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
