"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sun, CloudSun, Moon } from "lucide-react"

type RoastLevel = "LIGHT" | "MEDIUM" | "DARK"

interface StepRoastProps {
    selected: RoastLevel | null
    onSelect: (level: RoastLevel) => void
}

export default function StepRoast({ selected, onSelect }: StepRoastProps) {
    const options = [
        { id: "LIGHT" as RoastLevel, label: "בהיר", desc: "חומציות גבוהה, פירותי", icon: Sun, color: "text-amber-400" },
        { id: "MEDIUM" as RoastLevel, label: "בינוני", desc: "מאוזן, גוף עשיר", icon: CloudSun, color: "text-[#C37D46]" },
        { id: "DARK" as RoastLevel, label: "כהה", desc: "מרירות עדינה, שוקולדי", icon: Moon, color: "text-stone-700" },
    ]

    return (
        <div className="space-y-8 py-8 px-2">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-black text-[#2D1B14]">איך אתה אוהב את הקלייה שלך?</h2>
                <p className="text-stone-500">בחרו את רמת הקלייה שמתאימה לכם בדרך כלל</p>
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
                                layoutId="check"
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
