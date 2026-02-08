'use client';

import React, { useState, useMemo } from 'react';
import Navbar from "../../../components/TempNavbar";
import { Plus, X, Coffee, Beaker, Flame, ArrowRight, ShoppingBag, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../lib/store';

// Types
type Origin = {
    id: string;
    name: string;
    region: string;
    desc: string;
    color: string;
    stats: {
        body: number;
        acidity: number;
        sweetness: number;
        bitterness: number;
    }
};

type BlendComponent = {
    id: string;
    originId: string;
    percentage: number;
};

// Mock Data
const ORIGINS: Origin[] = [
    {
        id: 'brazil',
        name: 'Brazil Santos',
        region: 'South America',
        desc: 'אגוזי, שוקולדי, וחומציות נמוכה. בסיס מעולה לכל תערובת.',
        color: '#C37D46',
        stats: { body: 8, acidity: 3, sweetness: 6, bitterness: 4 }
    },
    {
        id: 'ethiopia',
        name: 'Ethiopia Yirgacheffe',
        region: 'Africa',
        desc: 'פרחוני, הדרי, ועדין. מוסיף מורכבות וארומה.',
        color: '#E6A27C',
        stats: { body: 4, acidity: 9, sweetness: 7, bitterness: 2 }
    },
    {
        id: 'colombia',
        name: 'Colombia Supremo',
        region: 'South America',
        desc: 'מאוזן להפליא עם טעמי קרמל ופירות.',
        color: '#8B4513',
        stats: { body: 6, acidity: 6, sweetness: 6, bitterness: 4 }
    },
    {
        id: 'guatemala',
        name: 'Guatemala Antigua',
        region: 'Central America',
        desc: 'מעושן קלות, תבלינים ושוקולד מריר.',
        color: '#5D4037',
        stats: { body: 7, acidity: 5, sweetness: 5, bitterness: 6 }
    },
    {
        id: 'sumatra',
        name: 'Sumatra Mandheling',
        region: 'Asia',
        desc: 'גוף כבד, אדמתי, וחריפות עדינה.',
        color: '#3E2723',
        stats: { body: 10, acidity: 2, sweetness: 4, bitterness: 8 }
    }
];

export default function CustomBlendClient() {
    const { addItem } = useCart();

    // State
    const [blendName, setBlendName] = useState('');
    const [components, setComponents] = useState<BlendComponent[]>([
        { id: '1', originId: 'brazil', percentage: 50 },
        { id: '2', originId: 'colombia', percentage: 50 }
    ]);
    const [roastLevel, setRoastLevel] = useState(3); // 1-5
    const [isAdding, setIsAdding] = useState(false);

    // Derived State
    const totalPercentage = components.reduce((acc, curr) => acc + curr.percentage, 0);
    const isValid = totalPercentage === 100 && blendName.length > 0;

    const flavorProfile = useMemo(() => {
        const profile = { body: 0, acidity: 0, sweetness: 0, bitterness: 0 };
        if (totalPercentage === 0) return profile;

        components.forEach(comp => {
            const origin = ORIGINS.find(o => o.id === comp.originId);
            if (origin) {
                profile.body += (origin.stats.body * comp.percentage) / 100;
                profile.acidity += (origin.stats.acidity * comp.percentage) / 100;
                profile.sweetness += (origin.stats.sweetness * comp.percentage) / 100;
                profile.bitterness += (origin.stats.bitterness * comp.percentage) / 100;
            }
        });

        // Apply roast modifier
        // Darker roast (5) = More Body/Bitterness, Less Acidity
        // Lighter roast (1) = More Acidity, Less Body
        const roastMod = (roastLevel - 3) * 0.5; // -1 to +1 range roughly

        profile.body = Math.min(10, Math.max(0, profile.body + roastMod));
        profile.bitterness = Math.min(10, Math.max(0, profile.bitterness + roastMod));
        profile.acidity = Math.min(10, Math.max(0, profile.acidity - roastMod));

        return profile;
    }, [components, roastLevel, totalPercentage]);

    // Handlers
    const updatePercentage = (id: string, newVal: number) => {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, percentage: newVal } : c));
    };

    const removeComponent = (id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id));
    };

    const addComponent = (originId: string) => {
        const newId = Date.now().toString();
        // Try to guess a reasonable percentage (remaining or 20)
        const remaining = 100 - totalPercentage;
        const val = remaining > 0 ? remaining : 0;

        setComponents([...components, { id: newId, originId, percentage: val }]);
        setIsAdding(false);
    };

    const handleAddToCart = () => {
        if (!isValid) return;

        // Create a custom product object (mock)
        const customProduct = {
            id: `blend-${Date.now()}`,
            name: blendName || 'הבלנד שלי',
            price: 85,
            image: '/images/products/custom-bag.png',
            description: `בלנד אישי: ${components.map(c => `${c.percentage}% ${ORIGINS.find(o => o.id === c.originId)?.name}`).join(', ')}`,
            category: 'Beans' as const,
        };

        // Since useCart expects a specific Product type, we might need to cast or adapt
        // For now, assuming addItem can take this capable object or we need to map it carefully to actual product structure
        // Let's assume we alert for now as "Add to Cart" logic might be strict on types
        alert(`הוספת את "${blendName}" לסל! (סימולציה)`);

        // Actual implementation would need a real product creation or special cart item type
        // addItem(customProduct as any); 
    };

    return (
        <main className="min-h-screen bg-[#FDFCF0] font-sans text-[#2D1B14]" dir="rtl">
            <Navbar />

            <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D1B14]/5 rounded-full text-[#C37D46] font-bold text-sm tracking-widest uppercase">
                        <Beaker className="w-4 h-4" />
                        <span>Custom Blend Lab</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-[#2D1B14] mb-4">
                        מעבדת <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C37D46] to-[#8B4513]">הבלנדים</span>
                    </h1>
                    <p className="text-stone-500 max-w-2xl mx-auto text-lg">
                        הפכו למאסטר-בלנדר ליום אחד. בחרו פולים, אזנו טעמים, וצרו את הקפה שתמיד חלמתם עליו.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT COLUMN: Builder Controls */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Components List */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-[#C37D46]" />
                                    הרכב הבלנד
                                </h3>
                                <div className={`text-sm font-bold px-3 py-1 rounded-full ${totalPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    סה"כ: {totalPercentage}%
                                </div>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence>
                                    {components.map((comp) => {
                                        const origin = ORIGINS.find(o => o.id === comp.originId);
                                        return (
                                            <motion.div
                                                key={comp.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-stone-50 p-4 rounded-2xl border border-stone-200"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{origin?.name}</h4>
                                                        <p className="text-xs text-stone-500">{origin?.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeComponent(comp.id)}
                                                        className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={comp.percentage}
                                                        onChange={(e) => updatePercentage(comp.id, parseInt(e.target.value))}
                                                        className="flex-grow h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#C37D46]"
                                                    />
                                                    <span className="font-mono font-bold w-12 text-right">{comp.percentage}%</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Add Button */}
                            <div className="mt-6 relative">
                                {isAdding ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white border border-[#C37D46] rounded-2xl p-4 absolute top-0 left-0 w-full z-10 shadow-lg grid grid-cols-2 sm:grid-cols-3 gap-2"
                                    >
                                        {ORIGINS.map(origin => (
                                            <button
                                                key={origin.id}
                                                onClick={() => addComponent(origin.id)}
                                                disabled={components.some(c => c.originId === origin.id)}
                                                className="text-right p-3 hover:bg-[#FDFCF0] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <div className="font-bold text-sm">{origin.name}</div>
                                                <div className="text-[10px] text-stone-500">{origin.region}</div>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsAdding(false)}
                                            className="col-span-full mt-2 text-center text-xs text-stone-400 hover:text-[#2D1B14] py-2"
                                        >
                                            ביטול
                                        </button>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="w-full py-4 border-2 border-dashed border-stone-300 rounded-2xl text-stone-400 font-bold hover:border-[#C37D46] hover:text-[#C37D46] hover:bg-[#C37D46]/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        הוסף מקור נוסף
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Roast Level */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Flame className="w-5 h-5 text-[#C37D46]" />
                                רמת קלייה
                            </h3>

                            <div className="relative pt-6 pb-2">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#e8d5c4] via-[#8B4513] to-[#2D1B14] rounded-full opacity-20" />
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={roastLevel}
                                    onChange={(e) => setRoastLevel(parseInt(e.target.value))}
                                    className="relative z-10 w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#2D1B14] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                />
                                <div className="flex justify-between mt-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
                                    <span>בהירה</span>
                                    <span>בינונית</span>
                                    <span>כהה</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visualization & Review */}
                    <div className="lg:col-span-5 space-y-8 sticky top-32">

                        {/* Taste Profile Visualization */}
                        <div className="bg-[#2D1B14] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C37D46] rounded-full blur-[100px] opacity-20 pointer-events-none" />

                            <h3 className="text-xl font-serif font-bold mb-8 relative z-10">פרופיל טעם צפוי</h3>

                            <div className="space-y-6 relative z-10">
                                {Object.entries(flavorProfile).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-2 opacity-80 pl-1 capitalize">
                                            <span>{key}</span>
                                            <span>{value.toFixed(1)}/10</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(value / 10) * 100}%` }}
                                                transition={{ duration: 0.5 }}
                                                className="h-full bg-gradient-to-r from-[#C37D46] to-[#E6A27C] rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <Info className="w-5 h-5 text-[#C37D46] flex-shrink-0" />
                                    <p className="text-xs text-white/60 leading-relaxed">
                                        הפרופיל מחושב משקלול נתוני המקורות ורמת הקלייה שנבחרה.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Action */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
                            <div className="space-y-4 mb-8">
                                <label className="block font-bold text-sm text-stone-500">שם הבלנד שלך</label>
                                <input
                                    type="text"
                                    value={blendName}
                                    onChange={(e) => setBlendName(e.target.value)}
                                    placeholder="למשל: בוקר של שבת"
                                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 font-bold text-lg text-[#2D1B14] focus:border-[#C37D46] outline-none transition-colors"
                                />
                            </div>

                            {!isValid && (
                                <div className="mb-6 flex items-start gap-3 text-red-500 bg-red-50 p-4 rounded-xl">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-bold">שימו לב:</p>
                                        <ul className="list-disc list-inside mt-1 opacity-80">
                                            {totalPercentage !== 100 && <li>סך האחוזים חייב להיות 100% (כרגע {totalPercentage}%)</li>}
                                            {blendName.length === 0 && <li>יש לתת שם לבלנד</li>}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={!isValid}
                                className="w-full py-5 bg-[#2D1B14] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span>הוסף לסל - ₪85.00</span>
                            </button>

                            <p className="text-center text-xs text-stone-400 mt-4">
                                * מחיר אחיד לאריזת 250 גרם
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}
