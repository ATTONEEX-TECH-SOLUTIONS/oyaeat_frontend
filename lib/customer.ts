// Shared helpers for the customer app: API base, auth storage, formatting.

export const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const naira = (n: number) => `₦${Math.round(n || 0).toLocaleString()}`;

export const resolveImg = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

export type CustomerUser = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("customer_token");

export const getUser = (): CustomerUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("customer_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_user");
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** fetch JSON from the API. Throws ApiError with a human message on failure. */
export async function api<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth, headers, ...rest } = opts;
  const token = auth ? getToken() : null;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      "We couldn't reach OyaEat. Check your connection and try again.",
      0,
    );
  }
  let json: any = null;
  try {
    json = await res.json();
  } catch {}
  if (res.status === 401 && auth) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = `/customer/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }
  if (!res.ok || json?.success === false) {
    throw new ApiError(
      json?.message || "Something went wrong. Please try again.",
      res.status,
    );
  }
  return json as T;
}

export const ORDER_STEPS = [
  { id: "pending", label: "Placed" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "out_for_delivery", label: "On the way" },
  { id: "delivered", label: "Delivered" },
] as const;

export const ACTIVE_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
];

export const statusMeta = (status: string) => {
  switch (status) {
    case "delivered":
      return { label: "Delivered", tone: "success" as const };
    case "cancelled":
    case "rejected":
    case "failed":
      return { label: status === "failed" ? "Failed" : "Cancelled", tone: "danger" as const };
    case "out_for_delivery":
      return { label: "On the way", tone: "mango" as const };
    case "preparing":
      return { label: "Preparing", tone: "mango" as const };
    case "ready":
      return { label: "Ready", tone: "mango" as const };
    case "confirmed":
      return { label: "Confirmed", tone: "violet" as const };
    case "pending":
      return { label: "Placed", tone: "violet" as const };
    default:
      return { label: status.replace(/_/g, " "), tone: "violet" as const };
  }
};

/** An online-payment order whose payment we have not confirmed yet. */
export const isAwaitingPayment = (o: any) =>
  o?.paymentMethod === "paystack" && o?.paymentStatus !== "paid" && !!o?.paymentReference && o?.status === "pending";

/**
 * Asks the server to confirm any online payments that are still unconfirmed
 * (the customer has just returned from Paystack, or the page was reloaded).
 * Returns how many orders turned out to be paid. Never throws: a payment that is
 * simply not finished yet is not an error.
 */
export async function confirmPendingPayments(orders: any[]): Promise<number> {
  const waiting = orders.filter(isAwaitingPayment);
  const results = await Promise.all(
    waiting.map((o) =>
      api(`/orders/verify-payment/${encodeURIComponent(o.paymentReference)}`, { auth: true })
        .then(() => true)
        .catch(() => false),
    ),
  );
  return results.filter(Boolean).length;
}
