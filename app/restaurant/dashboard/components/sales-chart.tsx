"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SalesSeries {
  date: string;
  orders: number;
  revenue: number;
}

interface SalesChartProps {
  data: SalesSeries[];
}

const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: "#5b21b6",
        border: "none",
        borderRadius: "10px",
        padding: "10px 16px",
        boxShadow: "0 8px 24px rgba(26,92,42,0.25)",
      }}
    >
      <p
        style={{
          color: "#c4b5fd",
          fontSize: 11,
          fontWeight: 600,
          marginBottom: 6,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 3,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: entry.color,
            }}
          />
          <span
            style={{
              color: "#f1ebff",
              fontSize: 12,
              textTransform: "capitalize",
            }}
          >
            {entry.dataKey === "revenue"
              ? `₦${Math.round(entry.value).toLocaleString()}`
              : entry.value}
          </span>
          <span style={{ color: "#81c784", fontSize: 11 }}>{entry.name}</span>
        </div>
      ))}
    </div>
  );
};

// Custom legend
const CustomLegend = ({ payload }: any) => (
  <div
    style={{
      display: "flex",
      gap: 20,
      justifyContent: "flex-end",
      paddingRight: 8,
      marginTop: 4,
    }}
  >
    {payload?.map((entry: any) => (
      <div
        key={entry.value}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            backgroundColor: entry.color,
          }}
        />
        <span
          style={{
            color: "#7c3aed",
            fontSize: 12,
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

export default function SalesChart({ data }: SalesChartProps) {
  // Normalise / pad to 7 days
  const chartData: { day: string; orders: number; revenue: number }[] =
    data?.length
      ? data.map((d, i) => ({
          day: DAYS[i] ?? d.date,
          orders: d.orders ?? 0,
          revenue: d.revenue ?? 0,
        }))
      : DAYS.map((day) => ({ day, orders: 0, revenue: 0 }));

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h3
            style={{
              color: "#5b21b6",
              fontWeight: 700,
              fontSize: 17,
              margin: 0,
            }}
          >
            Weekly Sales & Orders
          </h3>
          <p
            style={{
              color: "#7c3aed",
              fontSize: 12,
              margin: "4px 0 0",
              opacity: 0.8,
            }}
          >
            Last 7 days performance
          </p>
        </div>

        {/* Period pill */}
        <div
          style={{
            backgroundColor: "#f1ebff",
            border: "1px solid #ddd6fe",
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "#6d28d9",
            cursor: "default",
          }}
        >
          This Week
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 4, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#81c784" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#81c784" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#f1ebff"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7c3aed", fontSize: 12, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7c3aed", fontSize: 11 }}
            width={32}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#ddd6fe",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Legend content={<CustomLegend />} />

          <Area
            type="monotone"
            dataKey="orders"
            name="orders"
            stroke="#5b21b6"
            strokeWidth={2.5}
            fill="url(#ordersGrad)"
            dot={{ r: 4, fill: "#5b21b6", strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: "#5b21b6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="#66bb6a"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            strokeDasharray="5 3"
            dot={{ r: 3, fill: "#66bb6a", strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: "#66bb6a",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
