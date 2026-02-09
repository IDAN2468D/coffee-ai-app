
'use client';

import React, { useState, useRef } from 'react';
import { Music, Pause, Play, Volume2, VolumeX, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Using reliable public domain / CC sources for the demo
const LOFI_URL = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Elisions.mp3";
const CAFE_NOISE_URL = "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg";

export default function VirtualCafe() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCafeMode, setIsCafeMode] = useState(false); // Cafe noise toggle
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const noiseRef = useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
        setMounted(true);
        if (noiseRef.current) {
            noiseRef.current.volume = 0.3;
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            if (noiseRef.current) noiseRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
            if (isCafeMode && noiseRef.current) noiseRef.current.play().catch(e => console.error("Noise play failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleCafeMode = () => {
        if (!noiseRef.current) return;

        if (isCafeMode) {
            noiseRef.current.pause();
        } else {
            if (isPlaying) noiseRef.current.play().catch(e => console.error("Noise play failed", e));
        }
        setIsCafeMode(!isCafeMode);
    };

    const toggleMute = () => {
        if (audioRef.current) audioRef.current.muted = !isMuted;
        if (noiseRef.current) noiseRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 left-4 z-40 font-sans" dir="ltr">
            <audio ref={audioRef} src={LOFI_URL} loop />
            <audio ref={noiseRef} src={CAFE_NOISE_URL} loop />

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-16 left-0 bg-[#2D1B14] text-white p-4 rounded-2xl shadow-2xl w-64 border border-[#white]/10 mb-2 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                            <div className="w-10 h-10 rounded-lg bg-[#8B4513] flex items-center justify-center animate-pulse">
                                <Music className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Lofi Coffee Beats</h4>
                                <p className="text-xs text-stone-400">Relax & Brew</p>
                            </div>
                        </div>

                        {/* Visualizer bars */}
                        <div className="flex items-end justify-center gap-1 h-8 mb-4">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: isPlaying ? [10, 32, 10] : 4,
                                        opacity: isPlaying ? 1 : 0.3
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.1
                                    }}
                                    className="w-1.5 bg-[#C37D46] rounded-full"
                                />
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={toggleCafeMode}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all ${isCafeMode ? 'bg-[#white]/10 text-[#C37D46]' : 'text-stone-400 hover:text-white'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <Coffee className="w-3 h-3" />
                                    Cafe Ambience
                                </span>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${isCafeMode ? 'bg-[#C37D46]' : 'bg-stone-600'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isCafeMode ? 'translate-x-4' : ''}`} />
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => isExpanded ? togglePlay() : setIsExpanded(true)}
                className="group flex items-center gap-3 bg-[#2D1B14] text-white pr-6 pl-2 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isExpanded) {
                            setIsExpanded(false);
                        } else {
                            setIsExpanded(true);
                        }
                    }}
                    className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center relative overflow-hidden"
                >
                    {isPlaying ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full absolute animate-spin-slow opacity-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)]" />
                            <Music className="w-5 h-5 relative z-10" />
                        </div>
                    ) : (
                        <Play className="w-5 h-5 ml-1" />
                    )}
                </div>

                <div className="flex flex-col items-start" onClick={togglePlay}>
                    <span className="text-xs font-bold text-[#C37D46] uppercase tracking-wider">Virtual Cafe</span>
                    <span className="text-sm font-medium">{isPlaying ? 'Playing...' : 'Play Focus Music'}</span>
                </div>

                {isExpanded && (
                    <div className="flex items-center gap-2 border-l border-white/20 pl-3 ml-1">
                        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </button>
        </div>
    );
}
