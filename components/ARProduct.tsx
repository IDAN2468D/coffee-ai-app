'use client';
import React from 'react';
import '@google/model-viewer';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}

interface ARProductProps {
    modelSrc: string;
    posterImg: string;
}

const ARProduct: React.FC<ARProductProps> = ({ modelSrc: initialModelSrc, posterImg }) => {
    const [modelSrc, setModelSrc] = React.useState(initialModelSrc);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.glb')) {
            const url = URL.createObjectURL(file);
            setModelSrc(url);
        } else {
            alert('Please drop a .glb file');
        }
    };

    return (
        <div
            className={`w-full h-[400px] bg-stone-50 rounded-3xl overflow-hidden relative border transition-colors ${isDragging ? 'border-[#C37D46] border-4' : 'border-stone-200'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'} z-50 bg-white/80`}>
                <div className="text-2xl font-bold text-[#C37D46]">שחרר כדי לטעון מודל</div>
            </div>
            <model-viewer
                src={modelSrc}
                poster={posterImg}
                alt="A 3D model of our coffee cup"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '100%' }}
            >
                {/* Custom AR Button */}
                <button slot="ar-button" className="absolute bottom-4 right-4 bg-[#2D1B14] text-white px-5 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-[#C37D46] transition-all z-10 cursor-pointer">
                    <span>📍 ראה בחדר שלי</span>
                </button>

                {/* Loading Progress */}
                <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-stone-200">
                    <div className="h-full bg-[#C37D46] transition-all duration-300 update-bar"></div>
                </div>
            </model-viewer>
        </div>
    );
};

export default ARProduct;
