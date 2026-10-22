"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesSeries {
  date: string;
  orders: number;
  revenue: number;
}

const compact = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

function Tip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl bg-violet-950 px-3 py-2 text-xs text-white shadow-pop">
      <p className="font-bold text-violet-200">{p.full}</p>
      <p className="mt-1 text-sm font-extrabold">₦{Math.round(p.revenue).toLocaleString()}</p>
      <p className="text-violet-200">{p.orders} order{p.orders === 1 ? "" : "s"}</p>
    </div>
  );
}

export default function SalesChart({ data }: { data: SalesSeries[] }) {
  const rows = (data || []).map((d) => {
    const dt = new Date(d.date);
    const valid = !Number.isNaN(dt.getTime());
    return {
      day: valid ? dt.toLocaleDateString(undefined, { weekday: "short" }) : d.date,
      full: valid ? dt.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" }) : d.date,
      revenue: Number(d.revenue) || 0,
      orders: Number(d.orders) || 0,
    };
  });

  if (rows.length === 0 || rows.every((r) => r.revenue === 0 && r.orders === 0)) {
    return (
      <div className="grid h-56 place-items-center rounded-2xl bg-violet-50/60 text-center">
        <div>
          <p className="font-bold">No sales yet</p>
          <p className="text-sm text-muted-foreground">Your revenue chart fills in as orders are delivered.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-56 w-full sm:h-64" role="img" aria-label="Revenue by day">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e6e0f3" strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6b6480", fontSize: 12 }} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6b6480", fontSize: 12 }} tickFormatter={compact} width={44} />
          <Tooltip content={<Tip />} cursor={{ stroke: "#c4b5fd" }} />
          <Area type="monotone" dataKey="revenue" stroke="#5b21b6" strokeWidth={2.5} fill="url(#rev)" activeDot={{ r: 5, fill: "#fdba2d", stroke: "#5b21b6", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
