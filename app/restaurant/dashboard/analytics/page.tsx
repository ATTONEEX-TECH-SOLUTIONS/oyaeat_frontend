'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SALES_DATA = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 221 },
  { month: 'Mar', sales: 2000, orders: 229 },
  { month: 'Apr', sales: 2780, orders: 200 },
  { month: 'May', sales: 1890, orders: 229 },
  { month: 'Jun', sales: 2390, orders: 200 },
];

const CATEGORY_DATA = [
  { name: 'Pizza', value: 45, fill: 'hsl(var(--primary))' },
  { name: 'Salads', value: 20, fill: 'hsl(var(--accent))' },
  { name: 'Beverages', value: 15, fill: '#10b981' },
  { name: 'Desserts', value: 12, fill: '#f59e0b' },
  { name: 'Starters', value: 8, fill: '#8b5cf6' },
];

const TOP_ITEMS = [
  { name: 'Margherita Pizza', sold: 245, revenue: 3183.55 },
  { name: 'Pepperoni Pizza', sold: 198, revenue: 2968.02 },
  { name: 'Caesar Salad', sold: 156, revenue: 1402.44 },
  { name: 'Coca Cola', sold: 342, revenue: 1023.58 },
  { name: 'Garlic Bread', sold: 89, revenue: 444.11 },
];

const REVIEWS = [
  { rating: 5, count: 485, percentage: 62 },
  { rating: 4, count: 220, percentage: 28 },
  { rating: 3, count: 65, percentage: 8 },
  { rating: 2, count: 10, percentage: 1 },
  { rating: 1, count: 2, percentage: 1 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">Track your restaurant's performance and insights.</p>
      </div>

      {/* Sales Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg text-foreground mb-6">Monthly Sales & Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={SALES_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="hsl(var(--primary))" />
            <Bar dataKey="orders" fill="hsl(var(--accent))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-lg text-foreground mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Items */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-lg text-foreground mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {TOP_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sold} sold</p>
                </div>
                <div className="w-16 bg-muted rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${(item.sold / 350) * 100}%` }}
                  />
                </div>
                <p className="font-semibold text-foreground text-sm min-w-16 text-right">
                  ${item.revenue.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg text-foreground mb-6">Customer Reviews</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <div className="space-y-4">
            {REVIEWS.map((review) => (
              <div key={review.rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < review.rating ? 'text-yellow-400' : 'text-muted-foreground'}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${review.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground min-w-16 text-right">
                  {review.count}
                </span>
              </div>
            ))}
          </div>

          {/* Rating Stats */}
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
              <p className="text-4xl font-bold text-foreground">4.8</p>
              <p className="text-xs text-muted-foreground mt-2">Based on 782 reviews</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-green-700 mb-1">POSITIVE</p>
                <p className="text-xl font-bold text-green-700">90%</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">NEUTRAL</p>
                <p className="text-xl font-bold text-amber-700">9%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
