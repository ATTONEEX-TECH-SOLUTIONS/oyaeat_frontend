"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type IncomingRequest = {
  orderId: number;
  restaurantName: string;
  payout: number;
  distance: string;
  dropoffAddress: string;
};

type RiderCtx = {
  data: any;
  loading: boolean;
  error: string;
  status: string;
  restricted: boolean;
  isOnline: boolean;
  busy: boolean;
  gpsIssue: string;
  incoming: IncomingRequest | null;
  refresh: () => Promise<void>;
  toggleShift: () => Promise<void>;
  accept: (orderId: string | number) => Promise<boolean>;
  complete: (orderId: string | number) => Promise<boolean>;
  dismissIncoming: () => void;
};

const Ctx = createContext<RiderCtx | null>(null);
export const useRider = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRider must be used inside RiderProvider");
  return c;
};

const token = () => (typeof window === "undefined" ? null : localStorage.getItem("riderToken"));
const cleanId = (id: string | number) => String(id).replace(/^ORD-/, "");

function alertUser() {
  try {
    navigator.vibrate?.([200, 100, 200]);
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    osc.onended = () => ctx.close().catch(() => {});
  } catch {}
}

/** Owns everything that must keep running while the rider moves between screens. */
export function RiderProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gpsIssue, setGpsIssue] = useState("");
  const [incoming, setIncoming] = useState<IncomingRequest | null>(null);
  const watchRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const status = data?.riderProfile?.status || data?.status || "pending";
  const restricted = !!data && status !== "active";

  const logoutExpired = useCallback(() => {
    localStorage.removeItem("riderToken");
    router.replace("/rider/login");
  }, [router]);

  const refresh = useCallback(async () => {
    const t = token();
    if (!t) return;
    try {
      const res = await fetch(`${API}/rider/dashboard`, { headers: { Authorization: `Bearer ${t}` } });
      if (res.status === 401) return logoutExpired();
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setData(json);
      setIsOnline(json.status === "active" || json.riderProfile?.status === "active" ? !!json.isOnline : false);
      setError("");
    } catch (e: any) {
      setError(e?.message?.startsWith("Failed") ? "We couldn't reach OyaEat. Check your connection." : e?.message || "Couldn't load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [logoutExpired]);

  // initial load + polling while the app is visible
  useEffect(() => {
    refresh();
    const t = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 10000);
    return () => clearInterval(t);
  }, [refresh]);

  // stream GPS while online
  useEffect(() => {
    const stop = () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
    if (!isOnline || restricted) {
      stop();
      setGpsIssue("");
      return;
    }
    if (!("geolocation" in navigator)) {
      setGpsIssue("This device can't share its location.");
      return;
    }
    const t = token();
    watchRef.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        setGpsIssue("");
        try {
          await fetch(`${API}/rider/location/ping`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
            body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude }),
          });
        } catch {}
      },
      (err) => setGpsIssue(err.code === 1 ? "Location is blocked. Allow location access to receive orders." : "We can't get your location right now."),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
    return stop;
  }, [isOnline, restricted]);

  // receive order requests while online, on any screen
  useEffect(() => {
    const drop = () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
    const t = token();
    if (!isOnline || restricted || !t) {
      drop();
      return;
    }
    const socket = io(API, { auth: { token: t } });
    socketRef.current = socket;
    socket.on("NEW_DELIVERY_REQUEST", (o: IncomingRequest) => {
      setIncoming(o);
      alertUser();
    });
    return drop;
  }, [isOnline, restricted]);

  const call = useCallback(
    async (path: string, method: string) => {
      const res = await fetch(`${API}${path}`, { method, headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" } });
      if (res.status === 401) {
        logoutExpired();
        throw new Error("Your session expired. Please log in again.");
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
      return json;
    },
    [logoutExpired],
  );

  const toggleShift = useCallback(async () => {
    if (restricted || busy) return;
    setBusy(true);
    try {
      const r = await call("/rider/shift/toggle", "POST");
      setIsOnline(r.status === "online");
      toast.success(r.status === "online" ? "You're online. Orders will come to you." : "You're offline.");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message === "Failed to fetch" ? "No connection. Try again." : e?.message || "Couldn't change your status.");
    } finally {
      setBusy(false);
    }
  }, [busy, call, refresh, restricted]);

  const accept = useCallback(
    async (orderId: string | number) => {
      if (restricted) return false;
      setBusy(true);
      try {
        await call(`/rider/orders/${cleanId(orderId)}/accept`, "PUT");
        toast.success("Order accepted. Head to the restaurant.");
        await refresh();
        return true;
      } catch (e: any) {
        toast.error(e?.message || "Couldn't accept this order. It may have been taken.");
        await refresh();
        return false;
      } finally {
        setBusy(false);
      }
    },
    [call, refresh, restricted],
  );

  const complete = useCallback(
    async (orderId: string | number) => {
      setBusy(true);
      try {
        await call(`/rider/orders/${cleanId(orderId)}/complete`, "PUT");
        toast.success("Delivery completed. Nice work!");
        await refresh();
        return true;
      } catch (e: any) {
        toast.error(e?.message || "Couldn't complete this delivery. Try again.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [call, refresh],
  );

  const value = useMemo<RiderCtx>(
    () => ({ data, loading, error, status, restricted, isOnline, busy, gpsIssue, incoming, refresh, toggleShift, accept, complete, dismissIncoming: () => setIncoming(null) }),
    [data, loading, error, status, restricted, isOnline, busy, gpsIssue, incoming, refresh, toggleShift, accept, complete],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
