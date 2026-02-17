
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-stone-400">אין נתונים להצגה</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis
                    dataKey="name"
                    stroke="#78716c"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#78716c"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₪${value}`}
                />
                <Tooltip
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                    dataKey="sales"
                    fill="#C37D46"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
