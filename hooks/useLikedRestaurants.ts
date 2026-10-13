"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "liked_restaurants";
const EVENT = "oyaeat:likes";

const read = (): any[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function useLikedRestaurants() {
  const [liked, setLiked] = useState<any[]>([]);

  useEffect(() => {
    const sync = () => setLiked(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((restaurant: any) => {
    const current = read();
    const next = current.some((r) => r.id === restaurant.id)
      ? current.filter((r) => r.id !== restaurant.id)
      : [...current, restaurant];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isLiked = useCallback(
    (id: number) => liked.some((r) => r.id === id),
    [liked],
  );

  return { liked, toggle, isLiked };
}
