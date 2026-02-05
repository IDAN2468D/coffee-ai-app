'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudLightning, Cpu, Radio, Activity, Play, Pause } from 'lucide-react';

interface SoundTrackProps {
    name: string;
    icon: React.ReactNode;
    src: string;
    initialVolume?: number;
    neonColor?: string;
}

const SoundTrack: React.FC<SoundTrackProps> = ({ name, icon, src, initialVolume = 50, neonColor = "#C37D46" }) => {
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
        <div
            className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center justify-between gap-4 group hover:border-white/20 transition-all duration-500"
            style={{
                boxShadow: isPlaying ? `0 0 20px ${neonColor}1a` : 'none'
            }}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative overflow-hidden group/btn"
                    style={{
                        backgroundColor: isPlaying ? neonColor : 'rgba(255,255,255,0.05)',
                        boxShadow: isPlaying ? `0 0 15px ${neonColor}` : 'none'
                    }}
                >
                    {isPlaying ? <Pause size={20} className="text-white fill-current" /> : <Play size={20} className="text-white/50 group-hover/btn:text-white ml-1 fill-current" />}
                    {isPlaying && (
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-white/20 rounded-full"
                        />
                    )}
                </button>
                <div
                    className="p-3 rounded-xl transition-all duration-500"
                    style={{
                        backgroundColor: isPlaying ? `${neonColor}26` : 'rgba(255,255,255,0.03)',
                        color: isPlaying ? neonColor : '#a8a29e'
                    }}
                >
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-white tracking-wide group-hover:text-white/90 transition-colors">{name}</h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'animate-pulse' : 'bg-stone-600'}`} style={{ backgroundColor: isPlaying ? neonColor : undefined }} />
                        <p className="text-[10px] text-white/40 font-mono tracking-tighter uppercase">{isPlaying ? 'Transmitting' : 'Standby'}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-[150px]">
                <VolumeX size={14} className="text-stone-500" />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#C37D46] hover:accent-white transition-all"
                />
                <Volume2 size={14} className="text-stone-500" />
            </div>

            <audio ref={audioRef} src={src} loop />
        </div>
    );
};

// Add Framer Motion for the pulse effect
import { motion } from 'framer-motion';

export default function AmbienceMixer() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SoundTrack
                name="ניאון ריין"
                icon={<CloudLightning size={24} />}
                src="https://assets.mixkit.co/active_storage/sfx/2433/2433-preview.mp3"
                initialVolume={40}
                neonColor="#60A5FA" // Blue
            />
            <SoundTrack
                name="סינת'-האם"
                icon={<Cpu size={24} />}
                src="https://www.soundjay.com/ambient/sounds/mechanical-hum-01.mp3"
                initialVolume={20}
                neonColor="#C37D46" // Amber
            />
            <SoundTrack
                name="דאטה צ'אטר"
                icon={<Radio size={24} />}
                src="https://assets.mixkit.co/active_storage/sfx/158/158-preview.mp3"
                initialVolume={30}
                neonColor="#F472B6" // Pink
            />
            <SoundTrack
                name="סייבר-ספייס"
                icon={<Activity size={24} />}
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                initialVolume={50}
                neonColor="#34D399" // Emerald
            />
        </div>
    );
}

