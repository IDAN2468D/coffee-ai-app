'use client';

import React, { useState } from 'react';
import Navbar from "../../components/AppNavbar";
import { Package, Coffee, Users, BarChart3, Search, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminClient({ orders, products }: { orders: any[], products: any[] }) {
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter Logic
    const filteredOrders = orders.filter(o =>
        o.id.includes(searchTerm) ||
        o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans mb-10">
            <Navbar />

            <div className="flex-1 flex pt-20">
                {/* Sidebar */}
                <aside className="w-64 bg-[#2D1B14] text-white hidden md:block pt-8 fixed h-full z-0 top-0 left-0">
                    <div className="px-6 mb-10 pt-16">
                        <h2 className="text-2xl font-bold font-serif">Admin Portal</h2>
                        <p className="text-white/50 text-xs">Manage your coffee empire</p>
                    </div>

                    <nav className="space-y-2 px-4">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-[#C37D46] text-white' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            <Package className="w-5 h-5" />
                            <span>Orders</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-[#C37D46] text-white' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            <Coffee className="w-5 h-5" />
                            <span>Menu Products</span>
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 md:ml-64 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#2D1B14]">
                            {activeTab === 'orders' ? 'Order Management' : 'Product Inventory'}
                        </h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C37D46]"
                            />
                        </div>
                    </div>

                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#fcf8f5] text-[#2D1B14] font-bold border-b">
                                    <tr>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Items</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono text-xs text-gray-500">#{order.id.slice(-6)}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-[#2D1B14]">{order.shippingAddress?.fullName || 'Guest'}</div>
                                                <div className="text-xs text-gray-400">{order.user?.email}</div>
                                            </td>
                                            <td className="p-4 max-w-xs truncate text-gray-600">
                                                {order.items?.map((i: any) => `${i.quantity}x ${i.product?.name}`).join(', ')}
                                            </td>
                                            <td className="p-4 font-bold text-[#2D1B14]">${order.total.toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredOrders.length === 0 && <div className="p-8 text-center text-gray-400">No orders found.</div>}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={product.image || '/images/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-[#2D1B14]">{product.name}</h3>
                                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">${product.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button className="text-xs flex items-center gap-1 text-blue-600 hover:underline"><Edit className="w-3 h-3" /> Edit</button>
                                            <button className="text-xs flex items-center gap-1 text-red-600 hover:underline"><Trash2 className="w-3 h-3" /> Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
