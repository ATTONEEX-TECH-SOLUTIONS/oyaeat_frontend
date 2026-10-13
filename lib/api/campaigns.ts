import type { Campaign } from "@/lib/campaigns";

import { adminCall as call } from "@/lib/api/adminHttp";

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
