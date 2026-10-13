"use client";

import { useCallback, useEffect, useState } from "react";

export type CartItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: number;
  restaurantName: string;
};

const KEY = "customer_cart";
const EVENT = "oyaeat:cart";

const read = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  try {
    if (items.length) localStorage.setItem(KEY, JSON.stringify(items));
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
};

/** Single cart for the whole customer app, synced across components and tabs. */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /** Returns false when the item is from a different restaurant than the cart. */
  const add = useCallback((item: Omit<CartItem, "quantity">) => {
    const current = read();
    if (current.length && current[0].restaurantId !== item.restaurantId) {
      return false;
    }
    const existing = current.find((c) => c.menuItemId === item.menuItemId);
    write(
      existing
        ? current.map((c) =>
            c.menuItemId === item.menuItemId
              ? { ...c, quantity: c.quantity + 1 }
              : c,
          )
        : [...current, { ...item, quantity: 1 }],
    );
    return true;
  }, []);

  const decrement = useCallback((menuItemId: number) => {
    const current = read();
    write(
      current.flatMap((c) =>
        c.menuItemId !== menuItemId
          ? [c]
          : c.quantity > 1
            ? [{ ...c, quantity: c.quantity - 1 }]
            : [],
      ),
    );
  }, []);

  const remove = useCallback((menuItemId: number) => {
    write(read().filter((c) => c.menuItemId !== menuItemId));
  }, []);

  const clear = useCallback(() => write([]), []);

  /** Replace the cart with a single new item (after a different-restaurant conflict). */
  const replaceWith = useCallback((item: Omit<CartItem, "quantity">) => {
    write([{ ...item, quantity: 1 }]);
  }, []);

  const replaceAll = useCallback((next: CartItem[]) => write(next), []);

  const quantityOf = useCallback(
    (menuItemId: number) =>
      items.find((c) => c.menuItemId === menuItemId)?.quantity || 0,
    [items],
  );

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  return {
    items,
    ready,
    count,
    subtotal,
    restaurantId: items[0]?.restaurantId,
    restaurantName: items[0]?.restaurantName,
    add,
    decrement,
    remove,
    clear,
    replaceWith,
    replaceAll,
    quantityOf,
  };
}
