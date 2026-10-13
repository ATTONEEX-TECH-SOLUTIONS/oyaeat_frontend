import { adminBase, adminCall } from "@/lib/api/adminHttp";

export type RiderStatus = "pending" | "verified" | "active" | "inactive";

export type AdminRider = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: RiderStatus;
  createdAt?: string;
  isOnline?: boolean;
  deliveryCount?: number;
  riderProfile?: { vehicleType?: string | null; plateNumber?: string | null; idDocumentUrl?: string | null } | null;
};

export const fetchRiders = async (): Promise<AdminRider[]> => {
  const list = await adminCall<AdminRider[]>("/api/rider/admin/all");
  return Array.isArray(list) ? list : [];
};

export const setRiderStatus = (id: number, status: RiderStatus) =>
  adminCall(`/api/rider/admin/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const updateRider = (
  id: number,
  edits: { firstName: string; lastName: string; phone: string; vehicleType: string; plateNumber: string },
) => adminCall(`/api/rider/admin/${id}`, { method: "PATCH", body: JSON.stringify(edits) });

export const deleteRiderApplication = (id: number) => adminCall(`/api/rider/admin/${id}`, { method: "DELETE" });

/** Uploaded IDs are Cloudinary URLs; older ones are paths on this API. */
export const documentUrl = (u?: string | null) => (!u ? "" : u.startsWith("http") ? u : `${adminBase()}${u}`);
