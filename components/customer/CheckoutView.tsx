"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { APIProvider } from "@vis.gl/react-google-maps";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { EmptyState, PageHeader } from "./ui";
import { OrderSummary } from "./CartView";
import { useCart } from "@/hooks/useCart";
import { api, getUser, naira, DELIVERY_FEE_ESTIMATE, SERVICE_FEE_ESTIMATE, type CustomerUser } from "@/lib/customer";
import { cn } from "@/lib/utils";

type Method = "card" | "transfer" | "cash";

const METHODS: { id: Method; label: string; hint: string; icon: React.ElementType }[] = [
  { id: "card", label: "Card", hint: "Pay securely with Paystack", icon: CreditCard },
  { id: "transfer", label: "Bank transfer", hint: "Transfer via Paystack", icon: Landmark },
  { id: "cash", label: "Cash on delivery", hint: "Pay the rider on arrival", icon: Banknote },
];

export default function CheckoutView() {
  const router = useRouter();
  const cart = useCart();
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [method, setMethod] = useState<Method>("card");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setPhone(u?.phone || "");
  }, []);

  const total = cart.subtotal + DELIVERY_FEE_ESTIMATE + SERVICE_FEE_ESTIMATE;
  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const canPlace = cart.items.length > 0 && !!address && phoneOk && !loading;

  const place = async () => {
    if (!address) return setError("Choose your delivery address from the suggestions.");
    if (!phoneOk) return setError("Enter a phone number the rider can call.");
    setLoading(true);
    setError("");
    const order = {
      businessId: cart.restaurantId,
      customerName: `${user?.firstName || "Customer"} ${user?.lastName || ""}`.trim(),
      customerPhone: phone,
      address,
      notes,
      items: cart.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      customerLatitude: coords?.lat ?? null,
      customerLongitude: coords?.lng ?? null,
    };
    try {
      if (method === "cash") {
        await api("/orders", {
          method: "POST",
          auth: true,
          body: JSON.stringify({ ...order, paymentMethod: "cash" }),
        });
        cart.clear();
        router.push("/customer/dashboard/orders");
      } else {
        const json = await api("/orders/initialize-payment", {
          method: "POST",
          auth: true,
          body: JSON.stringify({
            ...order,
            email: user?.email || "",
            callbackUrl: window.location.origin + "/customer/dashboard/orders",
          }),
        });
        const url = json.data?.authorization_url;
        if (!url) throw new Error("We couldn't start the payment. Please try again.");
        // Keep the cart until payment is confirmed (orders page clears it).
        sessionStorage.setItem("oyaeat_pending_payment", "1");
        window.location.href = url;
        return;
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (cart.ready && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl pt-4">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          body="Add something to your cart first."
          action={{ label: "Browse restaurants", href: "/customer" }}
        />
      </div>
    );
  }

  const label = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground";
  const field =
    "h-12 w-full rounded-xl border border-input bg-card px-4 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:opacity-60";

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Checkout" subtitle={cart.restaurantName ? `Ordering from ${cart.restaurantName}` : undefined} />

        {error && (
          <div role="alert" className="mb-5 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 pb-32 lg:grid-cols-[1fr_22rem] lg:pb-0">
          <div className="space-y-6">
            {/* Step 1 */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
              <StepTitle n={1} icon={MapPin}>Delivery details</StepTitle>
              <div className="space-y-4">
                <div>
                  <span className={label}>Delivery address</span>
                  <AddressAutocomplete
                    label={null}
                    disabled={loading}
                    onClear={() => {
                      setAddress("");
                      setCoords(null);
                    }}
                    onAddressSelected={(text, c) => {
                      setAddress(text);
                      setCoords(c);
                    }}
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {address ? `✓ ${address}` : "Start typing and pick your address from the list."}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className={label}>Phone</label>
                    <input id="phone" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" className={field} disabled={loading} />
                  </div>
                  <div>
                    <label htmlFor="notes" className={label}>Note for the rider</label>
                    <input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Call when you arrive" className={field} disabled={loading} />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
              <StepTitle n={2} icon={CreditCard}>Payment</StepTitle>
              <div role="radiogroup" aria-label="Payment method" className="grid gap-3">
                {METHODS.map((m) => {
                  const on = method === m.id;
                  return (
                    <button
                      key={m.id}
                      role="radio"
                      aria-checked={on}
                      disabled={loading}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition",
                        on ? "border-primary bg-violet-50" : "border-border hover:border-violet-300",
                      )}
                    >
                      <span className={cn("grid h-11 w-11 place-items-center rounded-xl", on ? "bg-primary text-primary-foreground" : "bg-violet-50 text-violet-800")}>
                        <m.icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-bold">{m.label}</span>
                        <span className="block text-sm text-muted-foreground">{m.hint}</span>
                      </span>
                      <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2", on ? "border-primary" : "border-border")}>
                        {on && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display mb-4 text-lg font-bold">Order summary</h2>
              <ul className="mb-4 space-y-2 text-sm">
                {cart.items.map((i) => (
                  <li key={i.menuItemId} className="flex justify-between gap-3">
                    <span className="line-clamp-1"><b>{i.quantity}×</b> {i.name}</span>
                    <span className="font-semibold">{naira(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4">
                <OrderSummary subtotal={cart.subtotal} />
              </div>
              <PlaceButton loading={loading} disabled={!canPlace} onClick={place} total={total} method={method} />
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Encrypted checkout
              </p>
            </div>
          </aside>
        </div>

        {/* Mobile dock */}
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-card/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-xl [&>button]:mt-0">
            <PlaceButton loading={loading} disabled={!canPlace} onClick={place} total={total} method={method} />
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

function StepTitle({ n, icon: Icon, children }: { n: number; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h2 className="font-display mb-5 flex items-center gap-3 text-lg font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{n}</span>
      {children}
      <Icon className="ml-auto h-5 w-5 text-violet-300" />
    </h2>
  );
}

function PlaceButton({ loading, disabled, onClick, total, method }: { loading: boolean; disabled: boolean; onClick: () => void; total: number; method: Method }) {
  return (
    <>
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 lg:mt-6"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : method === "cash" ? `Place order · ${naira(total)}` : `Pay ${naira(total)}`}
    </button>
    {disabled && !loading && (
      <p className="mt-2 text-center text-xs text-muted-foreground">Add your delivery address and phone number to continue.</p>
    )}
    </>
  );
}
