'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [isLeafletReady, setIsLeafletReady] = useState(false);

    useEffect(() => {
        let L: any;

        const initMap = async () => {
            if (!mapContainerRef.current || mapInstanceRef.current) return;

            try {
                // Import Leaflet only on the client
                L = await import('leaflet');

                // Initialize map
                const map = L.map(mapContainerRef.current).setView([32.0853, 34.7818], 12);
                mapInstanceRef.current = map;

                // Add TileLayer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Custom Icon
                const defaultIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                // Add Markers
                branches.forEach(branch => {
                    const marker = L.marker([branch.lat, branch.lng], { icon: defaultIcon }).addTo(map);

                    const popupContent = `
                        <div style="text-align: right; direction: rtl; font-family: sans-serif; padding: 5px;">
                            <h3 style="margin: 0 0 5px 0; color: #78350f; font-weight: bold; font-size: 14px;">${branch.name}</h3>
                            <p style="margin: 0 0 8px 0; font-size: 11px; color: #4b5563;">${branch.address}</p>
                            ${branch.phoneNumber ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #6b7280;">📞 ${branch.phoneNumber}</p>` : ''}
                            <a href="https://waze.com/ul?ll=${branch.lat},${branch.lng}&navigate=yes" 
                               target="_blank" 
                               style="display: block; text-align: center; background: #C37D46; color: white; padding: 5px 10px; border-radius: 6px; text-decoration: none; font-size: 10px; font-weight: bold;">
                               ניווט עם Waze
                            </a>
                        </div>
                    `;

                    marker.bindPopup(popupContent);
                });

                // Fit bounds if branches exist
                if (branches.length > 0) {
                    const group = new L.featureGroup(branches.map((b: any) => L.marker([b.lat, b.lng])));
                    map.fitBounds(group.getBounds().pad(0.1));
                }

                setIsLeafletReady(true);
            } catch (err) {
                console.error('Error initializing Vanilla Leaflet:', err);
            }
        };

        if (typeof window !== 'undefined') {
            initMap();
        }

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [branches]);

    return (
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-50">
            {!isLeafletReady && (
                <div className="absolute inset-0 z-10 bg-stone-50/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-stone-400 font-medium animate-pulse">טוען מפת סניפים...</div>
                </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
    );
}
