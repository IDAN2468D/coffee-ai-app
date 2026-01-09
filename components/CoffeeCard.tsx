interface CoffeeCardProps {
    imageUrl: string;
    prompt: string;
}

export default function CoffeeCard({ imageUrl, prompt }: CoffeeCardProps) {
    return (
        <div className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <img
                src={imageUrl}
                alt={prompt}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-xs line-clamp-2">{prompt}</p>
            </div>
        </div>
    );
}
