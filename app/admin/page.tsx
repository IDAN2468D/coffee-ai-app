
import { getAdminStats } from "@/app/actions/admin";
import Navbar from "@/components/TempNavbar"; // Using TempNavbar as per previous files
import Footer from "@/components/AppFooter";
import { ShieldAlert, TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import nextDynamic from 'next/dynamic';

const AdminChart = nextDynamic(() => import('@/components/admin/AdminChart'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-stone-100 animate-pulse rounded-lg" />
});

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const statsResult = await getAdminStats();

    if (!statsResult.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center space-y-4">
                    <ShieldAlert size={64} className="text-red-500 mx-auto" />
                    <h1 className="text-3xl font-bold text-stone-800">גישה נדחתה</h1>
                    <p className="text-stone-600">{statsResult.error}</p>
                </div>
            </div>
        );
    }

    const { revenue, recentOrders, topProducts, chartData } = statsResult.data!;

    return (
        <main className="min-h-screen bg-stone-50 font-sans" dir="rtl">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-stone-900">לוח בקרה (Admin)</h1>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-stone-500 border border-stone-200">
                        {new Date().toLocaleDateString('he-IL')}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <KpiCard
                        title="הכנסות"
                        value={`₪${revenue.toLocaleString()}`}
                        icon={TrendingUp}
                        color="text-green-600"
                        bgColor="bg-green-50"
                    />
                    <KpiCard
                        title="הזמנות אחרונות"
                        value={recentOrders.length.toString()}
                        icon={ShoppingBag}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <KpiCard
                        title="מוצרים מובילים"
                        value={topProducts.length.toString()}
                        icon={Package}
                        color="text-orange-600"
                        bgColor="bg-orange-50"
                    />
                    <KpiCard
                        title="משתמשים פעילים"
                        value="-"
                        icon={Users}
                        color="text-purple-600"
                        bgColor="bg-purple-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6">הזמנות אחרונות</h2>
                        <RecentOrdersTable orders={recentOrders} />
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-900 mb-6">מוצרים פופולריים</h2>
                        <div className="space-y-6">
                            {topProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-xl">
                                        ☕
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-stone-800 text-sm truncate">{product.name}</h3>
                                        <p className="text-xs text-stone-500">{product.sold} נמכרו</p>
                                    </div>
                                    <div className="font-mono text-sm font-bold">
                                        ₪{product.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                    <h2 className="text-xl font-bold text-stone-900 mb-6">תחזית מכירות (Sales Trend)</h2>
                    <div className="h-80 w-full">
                        <AdminChart data={chartData} />
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}

function KpiCard({ title, value, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
                <p className="text-stone-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-stone-900">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );
}
