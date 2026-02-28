'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export type SalesPoint = {
  date: string // "YYYY-MM-DD"
  orders: number
  revenue: number
}

function formatDayLabel(isoDate: string) {
  // "2026-02-23" -> "Mon"
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

export default function SalesChart({ data }: { data: SalesPoint[] }) {
  const chartData = Array.isArray(data)
    ? data.map((d) => ({
        ...d,
        day: formatDayLabel(d.date),
      }))
    : []

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-bold text-lg text-foreground mb-6">Weekly Sales & Orders</h3>

      {!chartData.length ? (
        <div className="text-sm text-muted-foreground">No sales data yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === 'revenue') return [`₦${Number(value).toLocaleString()}`, 'Revenue']
                if (name === 'orders') return [Number(value).toLocaleString(), 'Orders']
                return [value, name]
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--accent))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}