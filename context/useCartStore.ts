'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, CoffeeSize, CartStore } from '@/src/types';

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            total: 0,
            recentlyAddedItem: null,
            addItem: (product, size = 'M') => set((state) => {
                // Find item with same product ID AND size
                const existingItem = state.items.find(item =>
                    item.id === product.id && item.size === size
                );
                let newItems;
                if (existingItem) {
                    newItems = state.items.map(item =>
                        item.id === product.id && item.size === size
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    newItems = [...state.items, { ...product, quantity: 1, size }];
                }
                const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                return { items: newItems, total: newTotal, recentlyAddedItem: { ...product, quantity: 1, size } };
            }),
            removeItem: (productId, size) => set((state) => {
                // If size is provided, remove only that specific size
                const existingItem = size
                    ? state.items.find(item => item.id === productId && item.size === size)
                    : state.items.find(item => item.id === productId);

                let newItems;
                if (existingItem && existingItem.quantity > 1) {
                    newItems = state.items.map(item =>
                        (size ? (item.id === productId && item.size === size) : item.id === productId)
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                } else {
                    newItems = state.items.filter(item =>
                        size ? !(item.id === productId && item.size === size) : item.id !== productId
                    );
                }
                const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                return { items: newItems, total: newTotal };
            }),
            clearCart: () => set({ items: [], total: 0 }),
            clearRecentlyAdded: () => set({ recentlyAddedItem: null }),
        }),
        {
            name: 'coffee-cart-storage-v3', // Updated version to include sizes
            partialize: (state) => ({ items: state.items, total: state.total }),
        }
    )
);
export default useCartStore;
