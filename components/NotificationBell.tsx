"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

type Notification = {
    id: string;
    message: string;
    type: string;
    createdAt: string;
};

export function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Poll for notifications
    useEffect(() => {
        if (!session) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error("Failed to poll notifications", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [session]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const markAsRead = async (id?: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id })
            });

            if (id) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            } else {
                setNotifications([]);
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    if (!session) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Notifications"
            >
                <Bell className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#2D1B14]" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-80 bg-white dark:bg-[#2D1B14] rounded-2xl shadow-xl ring-1 ring-black/5 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
                            <h3 className="font-bold text-sm text-[#2D1B14] dark:text-white">התראות</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => markAsRead()}
                                    className="text-xs text-[#C37D46] hover:underline"
                                >
                                    סמן הכל כנקרא
                                </button>
                            )}
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-stone-400 text-sm">
                                    אין התראות חדשות
                                </div>
                            ) : (
                                <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                                    {notifications.map((notification) => (
                                        <li key={notification.id} className="p-4 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors relative group">
                                            <div className="text-sm text-stone-600 dark:text-stone-300 pr-6">
                                                {notification.message}
                                            </div>
                                            <span className="text-[10px] text-stone-400 mt-1 block">
                                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="absolute top-4 right-4 text-stone-300 hover:text-[#C37D46] opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="סמן כנקרא"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
