"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUnlockedOrigins } from "@/app/actions/odyssey";
import { Globe, MapPin, Lock, Unlock, Compass } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

// Origin coordinates
const ORIGINS: any = {
    "Ethiopia": [9.145, 40.4896],
    "Colombia": [4.5709, -74.2973],
    "Brazil": [-14.235, -51.9253],
    "Vietnam": [14.0583, 108.2772],
    "Indonesia": [-0.7893, 113.9213],
    "Guatemala": [15.7835, -90.2308],
};

export default function OdysseyPage() {
    const [unlocked, setUnlocked] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await getUnlockedOrigins();
            if (res.success) {
                setUnlocked(res.origins || []);
            }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans overflow-hidden">
            <style jsx global>{`
                .leaflet-container { background: transparent !important; border-radius: 2rem; }
            `}</style>

            <div className="max-w-6xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-6 bg-zinc-900/50 p-8 rounded-[3rem] border border-white/5 backdrop-blur-xl"
                >
                    <div className="p-4 rounded-2xl bg-blue-500/10">
                        <Compass className="w-12 h-12 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">מסע הקפה</h1>
                        <p className="text-gray-400 mt-2 text-lg">גלה את מקורות פולי הקפה שלך והשלם את המפה העולמית</p>
                    </div>
                    <div className="mr-auto text-right">
                        <div className="text-sm text-gray-500 uppercase tracking-widest">התקדמות</div>
                        <div className="text-3xl font-mono text-blue-400">{unlocked.length} / {Object.keys(ORIGINS).length}</div>
                    </div>
                </motion.div>

                <div className="h-[600px] rounded-[3rem] overflow-hidden border border-white/10 relative">
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        {Object.entries(ORIGINS).map(([name, coords]: any) => {
                            const isUnlocked = unlocked.includes(name);
                            return (
                                <Marker key={name} position={coords}>
                                    <Popup>
                                        <div className="p-2 text-center bg-zinc-900 text-white rounded-lg">
                                            <div className="font-bold text-lg mb-1">{name}</div>
                                            {isUnlocked ? (
                                                <div className="flex items-center gap-2 text-green-400 justify-center">
                                                    <Unlock className="w-4 h-4" />
                                                    <span>פתוח לאניני טעם</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-500 justify-center">
                                                    <Lock className="w-4 h-4" />
                                                    <span>טרם נטעם</span>
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>

                    {/* Overlay Stats Card */}
                    <div className="absolute bottom-8 left-8 right-8 z-[1000] grid grid-cols-3 gap-4 pointer-events-none">
                        {Object.entries(ORIGINS).slice(0, 3).map(([name, _]) => (
                            <div key={name} className={`p-4 rounded-2xl backdrop-blur-md border ${unlocked.includes(name) ? 'bg-blue-500/20 border-blue-500/50' : 'bg-black/40 border-white/5'} flex items-center gap-3 transition-all`}>
                                {unlocked.includes(name) ? <Unlock className="text-blue-400 w-5 h-5" /> : <Lock className="text-gray-600 w-5 h-5" />}
                                <span className={unlocked.includes(name) ? 'text-blue-100' : 'text-gray-500'}>{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
