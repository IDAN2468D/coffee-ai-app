
'use client';

import React from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

// Map status to visual elements
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    'PENDING': { label: 'ממתין', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    'BREWING': { label: 'בהכנה', color: 'bg-orange-100 text-orange-800', icon: Package },
    'OUT_FOR_DELIVERY': { label: 'במשלוח', color: 'bg-blue-100 text-blue-800', icon: Truck },
    'DELIVERED': { label: 'נמסר', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'CANCELLED': { label: 'בוטל', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function RecentOrdersTable({ orders }: { orders: any[] }) {
    if (!orders || orders.length === 0) {
        return <div className="p-4 text-center text-stone-500">אין הזמנות חדשות</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-stone-50 text-stone-500 font-medium">
                    <tr>
                        <th className="px-4 py-3 rounded-tr-lg">מספר הזמנה</th>
                        <th className="px-4 py-3">לקוח</th>
                        <th className="px-4 py-3">סכום</th>
                        <th className="px-4 py-3">סטטוס</th>
                        <th className="px-4 py-3 rounded-tl-lg">תאריך</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800', icon: Clock };
                        const StatusIcon = status.icon;

                        return (
                            <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-stone-600">
                                    #{order.id.slice(-6)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-stone-900">{order.user?.name || 'אורח'}</div>
                                    <div className="text-xs text-stone-400">{order.user?.email}</div>
                                </td>
                                <td className="px-4 py-3 font-bold text-stone-800">
                                    ₪{order.total}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                        <StatusIcon size={12} />
                                        {status.label}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-stone-500">
                                    {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
