import { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Order, UserTier } from "@/src/types/index";
import { executeQuickReOrder } from "@/app/actions/order";
import { Loader2, Repeat, CheckCircle, Coffee, Sparkles } from "lucide-react";
import Image from "next/image";

interface QuickReOrderProps {
    lastOrder: Order | null;
    userTier: UserTier;
}

export default function QuickReOrder({ lastOrder, userTier }: QuickReOrderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<string>("idle");

    const isVIP = userTier === 'PLATINUM' || userTier === 'GOLD';
    const isPlatinum = userTier === 'PLATINUM';

    // Optimistic UI for button text
    const [optimisticButtonText, setOptimisticButtonText] = useOptimistic(
        "הזמן את הקבוע שלי",
        (current, newState: string) => newState
    );

    if (!lastOrder) return null;

    // Get the first item for the preview (or main item)
    const mainItem = lastOrder.items[0];
    if (!mainItem) return null;

    const handleReorder = async () => {
        startTransition(async () => {
            setOptimisticButtonText("יוצר הזמנה... ☕");

            const result = await executeQuickReOrder(lastOrder.id);
            if (result.success && result.data) {
                setStatus("success");
                // Brief delay to show success state before redirect
                const orderId = result.data;
                setTimeout(() => {
                    router.push(`/checkout/${orderId}`);
                }, 500);
            } else {
                setStatus("error");
                setOptimisticButtonText("הזמן את הקבוע שלי"); // Reset
                setTimeout(() => setStatus("idle"), 3000);
            }
        });
    };

    const isLoading = isPending || status === "success";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md mx-auto mb-8 backdrop-blur-lg rounded-[2rem] p-6 shadow-xl overflow-hidden relative transition-all duration-300 ${isPlatinum
                ? 'bg-[#1a1a1a]/80 border-2 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.15)]'
                : 'bg-white/5 border border-white/10'
                }`}
            dir="rtl"
        >
            {/* VIP Decoration */}
            {isPlatinum && (
                <>
                    <div className="absolute top-0 right-0 bg-[#FFD700] text-[#1a1a1a] text-[10px] font-black px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        VIP PRO RE-ORDER
                    </div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-2xl pointer-events-none" />
                </>
            )}

            <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none">
                <Repeat className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6 flex-row-reverse">
                    <div className="text-right">
                        <h3 className={`text-lg font-bold mb-1 flex items-center justify-end gap-2 ${isPlatinum ? 'text-[#FFD700]' : 'text-white'}`}>
                            {isPlatinum && <Sparkles className="w-4 h-4" />}
                            הקבוע שלך?
                        </h3>
                        <p className="text-white/60 text-xs">
                            הזמנה מיום {new Date(lastOrder.createdAt).toLocaleDateString('he-IL', { weekday: 'long' })}
                        </p>
                    </div>
                    {mainItem.product?.image && (
                        <div className={`relative w-14 h-14 rounded-2xl overflow-hidden ${isPlatinum ? 'border-2 border-[#FFD700]/50' : 'border border-white/20'}`}>
                            <Image
                                src={mainItem.product.image}
                                alt={mainItem.product.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 mb-6 bg-black/20 p-3 rounded-xl border border-white/5 flex-row-reverse">
                    <div className="p-2.5 bg-amber-500/10 rounded-lg">
                        <Coffee className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 text-right">
                        <p className="text-white font-bold text-sm truncate">
                            {mainItem.product?.name || "קפה לא ידוע"}
                        </p>
                        <p className="text-white/40 text-[10px] font-bold">
                            {mainItem.quantity}x {mainItem.size ? `• ${mainItem.size}` : ''}
                            {lastOrder.items.length > 1 && ` + עוד ${lastOrder.items.length - 1} פריטים`}
                        </p>
                    </div>
                    <div className="text-amber-400 font-mono font-bold text-sm bg-amber-500/10 px-2 py-1 rounded-lg">
                        ₪{lastOrder.total.toFixed(0)}
                    </div>
                </div>

                <button
                    onClick={handleReorder}
                    disabled={isLoading}
                    className={`w-full relative group overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] ${isPlatinum
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B]'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600'
                        }`}
                >
                    <div className={`relative rounded-xl px-4 py-3.5 transition-all ${isPlatinum ? 'bg-[#1a1a1a] group-hover:bg-opacity-90' : 'bg-[#1a1a1a] group-hover:bg-opacity-80'
                        }`}>
                        <div className={`flex items-center justify-center gap-2 font-bold ${isPlatinum ? 'text-[#FFD700]' : 'text-white'}`}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{optimisticButtonText}</span>
                                </>
                            ) : status === "success" ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span>ההזמנה נוצרה!</span>
                                </>
                            ) : (
                                <>
                                    <Repeat className="w-4 h-4" />
                                    <span>{optimisticButtonText}</span>
                                </>
                            )}
                        </div>
                    </div>
                </button>
            </div>
        </motion.div>
    );
}
