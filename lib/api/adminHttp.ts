// Shared request helper for superadmin screens. Reads only the admin token.

export const adminBase = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function adminCall<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("admin_token");
  if (!token) throw new Error("Admin not logged in. Please login again.");
  let res: Response;
  try {
    res = await fetch(`${adminBase()}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(json?.message || "Request failed.");
  return json as T;
}
