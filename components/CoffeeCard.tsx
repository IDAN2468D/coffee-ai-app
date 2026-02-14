import Image from 'next/image';

interface CoffeeCardProps {
    imageUrl: string;
    prompt: string;
}

export default function CoffeeCard({ imageUrl, prompt }: CoffeeCardProps) {
    return (
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <Image
                src={imageUrl}
                alt={prompt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-xs line-clamp-2">{prompt}</p>
            </div>
        </div>
    );
}
