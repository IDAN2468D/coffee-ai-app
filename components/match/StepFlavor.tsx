"use client"

import React from "react"
import { motion } from "framer-motion"
import { Cherry, Nut, Square as Choco } from "lucide-react"

type FlavorNote = "FRUITY" | "NUTTY" | "CHOCOLATY"

interface StepFlavorProps {
    selected: FlavorNote | null
    onSelect: (note: FlavorNote) => void
}

export default function StepFlavor({ selected, onSelect }: StepFlavorProps) {
    const options = [
        { id: "FRUITY" as FlavorNote, label: "פירותי", desc: "רענן, חמצמץ, תוסס", icon: Cherry, color: "text-red-400" },
        { id: "NUTTY" as FlavorNote, label: "אגוזי", desc: "אדמתי, קלוי, עמוק", icon: Nut, color: "text-amber-800" },
        { id: "CHOCOLATY" as FlavorNote, label: "שוקולדי", desc: "מתקתק, סמיך, קטיפתי", icon: Choco, color: "text-[#4b3621]" },
    ]

    return (
        <div className="space-y-8 py-8 px-2">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-black text-[#2D1B14]">איזה טעמים אתה מחפש?</h2>
                <p className="text-stone-500">הפרופיל המועדף עליך בחוויית הקפה</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((opt) => (
                    <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(opt.id)}
                        className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center gap-4 ${selected === opt.id
                                ? "border-[#C37D46] bg-white shadow-2xl scale-105"
                                : "border-stone-100 bg-stone-50/50 hover:bg-white hover:border-[#E8CBAD]"
                            }`}
                    >
                        <div className={`p-4 rounded-3xl bg-white shadow-sm ${opt.color}`}>
                            <opt.icon className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-[#2D1B14]">{opt.label}</div>
                            <div className="text-sm text-stone-400 font-medium">{opt.desc}</div>
                        </div>
                        {selected === opt.id && (
                            <motion.div
                                layoutId="check-flavor"
                                className="w-6 h-6 bg-[#C37D46] rounded-full flex items-center justify-center text-white"
                            >
                                <div className="w-2 h-4 border-r-2 border-b-2 border-white rotate-45 mb-1"></div>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
