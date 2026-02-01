
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

interface AutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (item: any) => void;
    placeholder?: string;
    label?: string;
    fetchSuggestions: (query: string) => Promise<any[]>;
    error?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export function Autocomplete({
    value,
    onChange,
    onSelect,
    placeholder,
    label,
    fetchSuggestions,
    error,
    icon,
    disabled = false
}: AutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setInputValue(query);
        onChange(query);

        if (query.length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const results = await fetchSuggestions(query);
            setSuggestions(results);
            setIsOpen(results.length > 0);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (item: any) => {
        setInputValue(item.name);
        onChange(item.name);
        if (onSelect) onSelect(item);
        setIsOpen(false);
    };

    return (
        <div className="space-y-4" ref={wrapperRef}>
            {label && <label className="text-xs font-black uppercase text-[#2D1B14] tracking-widest mr-1">{label}</label>}
            <div className="relative group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-stone-50 border-2 border-stone-100 focus:border-[#2D1B14] focus:bg-white rounded-2xl p-5 pr-12 text-sm transition-all outline-none font-medium placeholder:text-stone-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#2D1B14] transition-colors">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (icon || <Search className="w-5 h-5" />)}
                </div>

                <AnimatePresence>
                    {isOpen && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 max-h-60 overflow-y-auto custom-scrollbar"
                        >
                            {suggestions.map((item: any) => (
                                <button
                                    key={item.id || item.name}
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className="w-full text-right px-5 py-3 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-none text-sm font-medium text-[#2D1B14]"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold mr-2 uppercase">{error}</p>}
        </div>
    );
}
