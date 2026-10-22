"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2, UtensilsCrossed } from "lucide-react";
import MenuForm from "./components/menu-form";
import { vendorApi, type MenuItem } from "@/lib/api/vendor";
import { EmptyState, ErrorState, PageHeader, TableSkeleton } from "@/components/shared/states";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminField } from "@/components/superadmin/ui";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const img = (u?: string | null) => (!u ? "" : u.startsWith("http") ? u : `${API}${u}`);
const naira = (n: number) => `₦${Math.round(n || 0).toLocaleString()}`;

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await vendorApi.getMenu();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e: any) {
      setError(e?.message || "We couldn't load your menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))], [items]);
  const visible = useMemo(() => {
    const t = search.trim().toLowerCase();
    return items.filter(
      (i) => (category === "All" || i.category === category) && (!t || i.name.toLowerCase().includes(t) || i.category.toLowerCase().includes(t)),
    );
  }, [items, search, category]);

  const toggle = async (item: MenuItem, available: boolean) => {
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, available } : x))); // optimistic
    try {
      await vendorApi.updateMenuItem(item.id, {
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        available,
      });
      toast.success(`${item.name} is now ${available ? "available" : "sold out"}`);
    } catch (e: any) {
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, available: item.available } : x)));
      toast.error(e?.message || "Couldn't update availability");
    }
  };

  const remove = async () => {
    if (!deleting) return;
    const item = deleting;
    setDeleting(null);
    try {
      await vendorApi.deleteMenuItem(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      toast.success(`${item.name} deleted`);
    } catch (e: any) {
      toast.error(e?.message || "Couldn't delete this item");
    }
  };

  const openForm = (item: MenuItem | null) => {
    setSelected(item);
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader
        title="Menu"
        subtitle={items.length ? `${items.length} dish${items.length === 1 ? "" : "es"} · ${items.filter((i) => !i.available).length} sold out` : "Add the dishes customers can order."}
        action={
          <button
            onClick={() => openForm(null)}
            className="flex h-11 items-center gap-2 rounded-full bg-cta px-5 text-sm font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300"
          >
            <Plus className="h-4 w-4" /> Add dish
          </button>
        }
      />

      {showForm && (
        <MenuForm
          item={selected}
          onClose={() => {
            setShowForm(false);
            setSelected(null);
          }}
          onCreated={(created) => {
            setItems((prev) => [created, ...prev]);
            setShowForm(false);
            setSelected(null);
          }}
          onUpdated={(updated) => {
            setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            setShowForm(false);
            setSelected(null);
          }}
        />
      )}

      {items.length > 0 && (
        <div className="mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input aria-label="Search menu" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes or categories" className={`${adminField} pl-11`} />
          </div>
          {categories.length > 2 && (
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn("h-9 shrink-0 rounded-full px-4 text-sm font-bold transition", category === c ? "bg-primary text-primary-foreground" : "bg-violet-50 text-violet-900 hover:bg-violet-100")}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState title="We couldn't load your menu" message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="Your menu is empty" body="Add your first dish and it will appear to customers straight away." action={{ label: "Add your first dish", onClick: () => openForm(null) }} />
      ) : visible.length === 0 ? (
        <EmptyState icon={Search} title="No dishes match" body="Try a different search or category." />
      ) : (
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className={cn("flex gap-4 rounded-3xl border border-border bg-card p-3 shadow-card transition sm:p-4", !item.available && "bg-muted/40")}>
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-violet-50 sm:h-28 sm:w-28">
                {item.imageUrl ? (
                  <img src={img(item.imageUrl)} alt="" loading="lazy" className={cn("h-full w-full object-cover", !item.available && "grayscale")} />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-violet-100 to-mango-100 text-violet-400">
                    <UtensilsCrossed className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="font-display line-clamp-1 text-base font-bold">{item.name}</p>
                <p className="text-xs font-semibold text-violet-700">{item.category}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description || "No description"}</p>
                <p className="mt-auto pt-2 text-lg font-extrabold text-primary">{naira(item.price)}</p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <Switch checked={item.available} onCheckedChange={(v) => toggle(item, v)} aria-label={`${item.name} available`} />
                    <span className={item.available ? "text-success" : "text-muted-foreground"}>{item.available ? "Available" : "Sold out"}</span>
                  </label>
                  <span className="flex gap-1">
                    <button onClick={() => openForm(item)} aria-label={`Edit ${item.name}`} className="grid h-10 w-10 place-items-center rounded-full text-violet-800 transition hover:bg-violet-100">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleting(item)} aria-label={`Delete ${item.name}`} className="grid h-10 w-10 place-items-center rounded-full text-destructive transition hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>It will be removed from your menu. Mark it sold out instead if it will come back.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
