"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Badge, type Tone } from "@/components/superadmin/ui";
import { EmptyState } from "@/components/shared/states";

export type RecentOrder = {
  id: number;
  customerName: string;
  status: "pending" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  items?: { name: string; quantity: number; price: number }[];
};

const STATUS: Record<string, { label: string; tone: Tone }> = {
  pending: { label: "New", tone: "mango" },
  preparing: { label: "Preparing", tone: "violet" },
  ready: { label: "Ready", tone: "success" },
  out_for_delivery: { label: "On the way", tone: "violet" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const ago = (iso: string) => {
  const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : new Date(iso).toLocaleDateString();
};

export default function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  if (!orders.length)
    return <EmptyState icon={ChefHat} title="No orders yet" body="Your latest orders will show up here." />;
  return (
    <ul className="divide-y divide-border">
      {orders.map((o) => {
        const s = STATUS[o.status] ?? STATUS.pending;
        return (
          <li key={o.id}>
            <Link href="/restaurant/dashboard/orders" className="flex items-center gap-3 py-3 transition hover:bg-violet-50/50 sm:px-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-xs font-extrabold text-violet-800">#{o.id}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{o.customerName}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {ago(o.createdAt)}
                  {o.items?.length ? ` · ${o.items.reduce((n, i) => n + i.quantity, 0)} items` : ""}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-extrabold">₦{Math.round(o.total || 0).toLocaleString()}</span>
                <Badge tone={s.tone}>{s.label}</Badge>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
