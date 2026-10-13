"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, ShoppingBag } from "lucide-react";
import { EmptyState, ErrorState, PageHeader, TableSkeleton } from "@/components/shared/states";
import { OrderBadge, adminField } from "@/components/superadmin/ui";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export default function SuperadminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

      const res = await fetch(
        `${API_BASE}/admin/orders?page=${page}&limit=50`,
        {
          headers,
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          json?.message || `Failed to fetch global orders (${res.status})`,
        );

      const list = Array.isArray(json?.data?.orders)
        ? json.data.orders
        : Array.isArray(json?.orders)
          ? json.orders
          : Array.isArray(json?.data)
            ? json.data
            : [];
      setOrders(list);
      setHasNextPage(
        list.length === 50 || (json?.data?.pagination?.hasNextPage ?? false),
      );
    } catch (e: any) {
      setError(e?.message || "Error communicating with the orders server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const filtered = useMemo(() => {
    return orders.filter(
      (o) =>
        (statusFilter === "all" || o.status === statusFilter) &&
        (o.id?.toString().includes(searchTerm) ||
          (o.businessName || o.restaurantName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (o.customer?.name || o.customerName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())),
    );
  }, [orders, searchTerm, statusFilter]);

  const nameOf = (o: any) => o.businessName || o.business?.name || o.restaurantName || "Unknown vendor";
  const customerOf = (o: any) => o.customer?.firstName || o.customer?.name || o.customerName || "Guest";
  const amountOf = (o: any) => `₦${Number(o.totalAmount || o.amount || 0).toLocaleString()}`;
  const dateOf = (o: any) =>
    new Date(o.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div>
      <PageHeader
        title="Customers & orders"
        subtitle={`${orders.length} orders loaded · page ${page}`}
        action={
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold text-primary transition hover:bg-violet-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search orders"
            placeholder="Search by order ID, restaurant or customer"
            className={`${adminField} pl-11`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by status"
          className={`${adminField} sm:w-52`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="out_for_delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && orders.length === 0 ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState title="We couldn't load orders" message={error} onRetry={fetchOrders} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders match"
          body={orders.length ? "Try a different search or status." : "Orders will appear here as customers place them."}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {/* Mobile: cards */}
          <ul className="divide-y divide-border md:hidden">
            {filtered.map((o, i) => (
              <li key={o.id || i} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{nameOf(o)}</p>
                    <p className="text-sm text-muted-foreground">#{o.id} · {customerOf(o)}</p>
                  </div>
                  <OrderBadge status={o.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-extrabold">{amountOf(o)}</span>
                  <span className="text-muted-foreground">{dateOf(o)}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <table className="hidden w-full text-left md:table">
            <thead className="bg-muted/60">
              <tr>
                {["Order", "Restaurant", "Customer", "Amount", "Status", "Placed"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o, i) => (
                <tr key={o.id || i} className="transition hover:bg-violet-50/50">
                  <td className="px-5 py-3.5 font-extrabold text-primary">#{o.id}</td>
                  <td className="px-5 py-3.5 font-semibold">{nameOf(o)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{customerOf(o)}</td>
                  <td className="px-5 py-3.5 font-extrabold">{amountOf(o)}</td>
                  <td className="px-5 py-3.5"><OrderBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{dateOf(o)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-5">
            <span className="text-sm font-semibold text-muted-foreground">Page {page}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 rounded-full border border-border px-4 text-sm font-bold text-primary transition hover:bg-violet-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={!hasNextPage || loading}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 rounded-full border border-border px-4 text-sm font-bold text-primary transition hover:bg-violet-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
