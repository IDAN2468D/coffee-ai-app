'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, Users, Music, Play, Pause } from 'lucide-react';

interface SoundTrackProps {
    name: string;
    icon: React.ReactNode;
    src: string;
    initialVolume?: number;
}

const SoundTrack: React.FC<SoundTrackProps> = ({ name, icon, src, initialVolume = 50 }) => {
    const [volume, setVolume] = useState(initialVolume);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center justify-between gap-4 group hover:border-[#C37D46]/50 transition-colors">
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#C37D46] text-white shadow-[0_0_15px_#C37D46]' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <div className={`p-3 rounded-xl ${isPlaying ? 'bg-[#C37D46]/20 text-[#C37D46]' : 'bg-white/5 text-stone-400'}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-white tracking-wide">{name}</h3>
                    <p className="text-xs text-white/40 font-mono">{isPlaying ? 'PLAYING' : 'PAUSED'}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-[150px]">
                <VolumeX size={16} className="text-stone-500" />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#C37D46]"
                />
                <Volume2 size={16} className="text-stone-500" />
            </div>

            <audio ref={audioRef} src={src} loop />
        </div>
    );
};

export default function AmbienceMixer() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SoundTrack
                name="גשם בחוץ"
                icon={<CloudRain size={24} />}
                src="https://raw.githubusercontent.com/isyuricunha/rain-for-relax/main/audio/rain.mp3"
                initialVolume={40}
            />
            <SoundTrack
                name="מכונת אספרסו"
                icon={<Coffee size={24} />}
                src="https://cdn.pixabay.com/audio/2021/08/09/audio_88447e769f.mp3" // Replacing with a generic mechanical hum if possible, or use placeholder
                initialVolume={20}
            />
            <SoundTrack
                name="בית קפה הומה"
                icon={<Users size={24} />}
                src="https://cdn.pixabay.com/audio/2022/03/23/audio_03d9774643.mp3" // Generic chatter
                initialVolume={30}
            />
            <SoundTrack
                name="ג'אז לילי"
                icon={<Music size={24} />}
                src="https://cdn.pixabay.com/audio/2022/10/25/audio_55a2991879.mp3" // Smooth Jazz
                initialVolume={50}
            />
        </div>
    );
}
