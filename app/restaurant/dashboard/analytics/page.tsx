'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { vendorApi, type VendorDashboard, type Order, type MenuItem } from '@/lib/api/vendor';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';

const COLORS = ['#1a5c2a', '#2e7d32', '#4ade80', '#a5d6a7', '#14491f'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState<VendorDashboard | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        // Fetch everything safely
        const [dashRes, menuRes, ordersRes] = await Promise.all([
          vendorApi.getDashboard().catch(() => null),
          vendorApi.getMenu().catch(() => null),
          vendorApi.getOrders({ limit: 200 }).catch(() => null)
        ]);
        
        if (!active) return;
        
        if (dashRes) setDashboard(dashRes.dashboard);
        if (menuRes && Array.isArray(menuRes.items)) setMenuItems(menuRes.items);
        if (ordersRes && Array.isArray(ordersRes.orders)) setHistoryOrders(ordersRes.orders);
      } catch (e: any) {
        if (active) setError(e.message || 'Failed to fetch analytics');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Compute standard bar chart
  const chartData = useMemo(() => {
    if (!dashboard?.salesSeries) return [];
    return dashboard.salesSeries.map(s => ({
      date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      sales: s.revenue,
      orders: s.orders
    }));
  }, [dashboard]);

  // Compute item counts and categorical distribution dynamically
  const { topItems, categoryData } = useMemo(() => {
    const itemMap: Record<string, { sold: number, revenue: number }> = {};
    const catMap: Record<string, number> = {};

    historyOrders.forEach(order => {
      if (order.status === 'cancelled') return; // Ignore abandoned money
      (order.items || []).forEach(item => {
        if (!itemMap[item.name]) itemMap[item.name] = { sold: 0, revenue: 0 };
        itemMap[item.name].sold += item.quantity;
        itemMap[item.name].revenue += item.price * item.quantity;

        // Try mapping against the live menu
        const menuItem = menuItems.find(m => m.name.toLowerCase() === item.name.toLowerCase());
        const cat = menuItem?.category || 'Uncategorized';
        catMap[cat] = (catMap[cat] || 0) + (item.price * item.quantity);
      });
    });

    const sortedItems = Object.entries(itemMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Take top 5

    const categories = Object.entries(catMap)
      .map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }))
      .sort((a, b) => b.value - a.value);

    return { topItems: sortedItems, categoryData: categories };
  }, [historyOrders, menuItems]);

  const maxSold = topItems.length ? Math.max(...topItems.map(i => i.sold)) : 100;

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><Spinner /></div>;
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
      <AlertCircle className="w-5 h-5" /> {error}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
         <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-[#52b788]">Vendor Portal</p>
         <h1 className="text-3xl font-black tracking-tight text-[#111c14] mb-2">Analytics & Reports</h1>
         <p className="text-[#6b7c6e]">Real-time synchronization of your sales metrics.</p>
      </div>

      {/* Sales Chart */}
      <div className="bg-card border border-[#d8e4dc] rounded-2xl p-6 shadow-sm">
        <h3 className="font-extrabold text-[#111c14] text-lg mb-6">Revenue & Order Volume</h3>
        <div style={{ width: '100%', height: 300 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ed" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7c6e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#6b7c6e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₦${v/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7c6e" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111c14', color: '#fff', borderRadius: '12px', border: 'none' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
                <Bar yAxisId="left" dataKey="sales" name="Revenue" fill="#1a5c2a" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#a5d6a7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-[#6b7c6e]">
                <BarChart className="w-8 h-8 opacity-20 mb-3 text-[#1a5c2a]" />
                <span className="font-semibold text-sm">No recent sales data to display.</span>
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie */}
        <div className="bg-card border border-[#d8e4dc] rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-[#111c14] text-lg mb-6">Revenue by Category</h3>
          <div style={{ width: '100%', height: 250 }}>
             {categoryData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {categoryData.map((e, index) => <Cell key={`cell-${index}`} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: number) => `₦${v.toLocaleString()}`} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', fontWeight: '600' }} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6b7c6e] font-semibold text-sm">
                   Not enough categorised sales data.
                </div>
             )}
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-card border border-[#d8e4dc] rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-[#111c14] text-lg mb-6">Top Selling Items</h3>
          <div className="space-y-5">
            {topItems.length > 0 ? topItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#111c14] text-sm truncate">{item.name}</p>
                  <p className="text-xs font-semibold text-[#6b7c6e] mt-0.5">{item.sold} units sold</p>
                </div>
                <div className="w-16 h-1.5 bg-[#e8f5ed] rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${Math.max(5, (item.sold / maxSold) * 100)}%`, backgroundColor: '#1a5c2a' }}
                  />
                </div>
                <p className="font-black text-[#1a5c2a] text-sm min-w-[70px] text-right">
                  ₦{(item.revenue || 0).toLocaleString()}
                </p>
              </div>
            )) : (
                <div className="py-12 flex h-full items-center justify-center text-[#6b7c6e] font-semibold text-sm">
                   No item sales tracked yet.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
