import type { Campaign } from "@/lib/campaigns";

const base = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function call<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("admin_token");
  if (!token) throw new Error("Admin not logged in. Please login again.");
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, {
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

export const fetchAllCampaigns = async (): Promise<Campaign[]> => (await call("/admin/broadcasts/active")).data || [];
export const fetchPendingCampaigns = async (): Promise<Campaign[]> => (await call("/admin/broadcasts/pending-reviews")).data || [];
export const fetchRejectedCampaigns = async (): Promise<Campaign[]> => (await call("/admin/broadcasts/rejected-history")).data || [];

export const approveCampaign = (id: number, edits: { title: string; desc: string }) =>
  call(`/admin/broadcasts/${id}/approve`, { method: "PATCH", body: JSON.stringify(edits) });
export const rejectCampaign = (id: number, reason?: string) =>
  call(`/admin/broadcasts/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason: reason || undefined }) });
export const setCampaignVisible = (id: number, isActive: boolean) =>
  call(`/admin/broadcasts/${id}/toggle`, { method: "PATCH", body: JSON.stringify({ isActive }) });
export const deleteCampaign = (id: number) => call(`/admin/broadcasts/${id}`, { method: "DELETE" });
