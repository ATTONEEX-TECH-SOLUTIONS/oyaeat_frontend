"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { APIProvider } from "@vis.gl/react-google-maps";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { ErrorState } from "./ui";
import { api } from "@/lib/customer";
import { cn } from "@/lib/utils";

type Addr = { id: number; label: string; address: string; isDefault: boolean };

/** Saved delivery addresses: list, add (with place search so we keep coordinates), set default, remove. */
export default function AddressBook() {
  const [items, setItems] = useState<Addr[] | null>(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [picked, setPicked] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setItems((await api("/customer/addresses", { auth: true })).data?.addresses || []);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setAdding(false);
    setLabel("");
    setPicked(null);
  };

  const add = async () => {
    if (!picked || !label.trim()) return;
    setSaving(true);
    try {
      await api("/customer/addresses", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ label: label.trim(), address: picked.address, latitude: picked.lat, longitude: picked.lng }),
      });
      toast.success("Address saved");
      reset();
      await load();
    } catch (e: any) {
      toast.error(e.message || "Couldn't save this address.");
    } finally {
      setSaving(false);
    }
  };

  const act = async (id: number, fn: () => Promise<unknown>, ok: string) => {
    setBusyId(id);
    try {
      await fn();
      toast.success(ok);
      await load();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Saved addresses</h2>
          {!adding && items && items.length < 10 && (
            <button onClick={() => setAdding(true)} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-violet-100 px-4 text-sm font-bold text-primary transition hover:bg-violet-200">
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>

        {adding && (
          <div className="mt-4 space-y-3 rounded-2xl bg-violet-50 p-4">
            <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} placeholder="Label, e.g. Home or Office" aria-label="Address label" className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:border-ring focus:ring-4 focus:ring-ring/15" />
            <AddressAutocomplete label={null} disabled={saving} onClear={() => setPicked(null)} onAddressSelected={(address, c) => setPicked({ address, ...c })} />
            <p className="text-xs text-muted-foreground">{picked ? `✓ ${picked.address}` : "Start typing and pick the address from the list."}</p>
            <div className="flex gap-2">
              <button onClick={add} disabled={saving || !picked || !label.trim()} className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save address
              </button>
              <button onClick={reset} disabled={saving} className="h-10 rounded-full px-4 text-sm font-bold text-muted-foreground hover:bg-white">Cancel</button>
            </div>
          </div>
        )}

        <div className="mt-4">
          {error ? (
            <ErrorState title="Couldn't load your addresses" message={error} onRetry={load} />
          ) : !items ? (
            <div className="h-16 animate-pulse rounded-2xl bg-muted" aria-busy="true" />
          ) : items.length === 0 && !adding ? (
            <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
              No saved addresses yet. Add one and checkout gets faster.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((a) => (
                <li key={a.id} className="flex items-start gap-3 py-3">
                  <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl", a.isDefault ? "bg-cta text-cta-foreground" : "bg-violet-100 text-violet-800")}>
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-bold">
                      {a.label}
                      {a.isDefault && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-primary">Default</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{a.address}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!a.isDefault && (
                      <button
                        disabled={busyId === a.id}
                        onClick={() => act(a.id, () => api(`/customer/addresses/${a.id}`, { method: "PATCH", auth: true, body: JSON.stringify({ isDefault: true }) }), "Default address updated")}
                        aria-label={`Make ${a.label} the default address`}
                        title="Make default"
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-violet-50 hover:text-primary"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      disabled={busyId === a.id}
                      onClick={() => act(a.id, () => api(`/customer/addresses/${a.id}`, { method: "DELETE", auth: true }), "Address removed")}
                      aria-label={`Remove ${a.label}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </APIProvider>
  );
}
