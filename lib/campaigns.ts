// Shared campaign (promo banner) helpers for the customer and superadmin apps.

export type Campaign = {
  id: number;
  businessId: number;
  title?: string | null;
  desc?: string | null;
  bgGradient?: string | null; // image URL (or legacy gradient classes)
  code?: string | null;
  discount?: number | null;
  expiresAt?: string | null;
  isActive?: boolean | null;
  business?: { id?: number; name?: string; city?: string; thumbnailUrl?: string | null } | null;
};

export type CampaignState = "pending" | "live" | "expired" | "hidden" | "rejected";

/**
 * The API has no explicit status column, so the state is derived:
 *  - rejected: inactive and stamped with the historical rejection date (before 2020)
 *  - pending : inactive with a future expiry (waiting for review)
 *  - live    : active with a future expiry
 *  - expired : active but past its expiry
 *  - hidden  : inactive, past expiry (an admin/vendor switched it off)
 */
export function campaignState(c: Campaign, now = Date.now()): CampaignState {
  const exp = c.expiresAt ? new Date(c.expiresAt).getTime() : NaN;
  if (c.isActive) return !Number.isNaN(exp) && exp <= now ? "expired" : "live";
  if (!Number.isNaN(exp) && exp < new Date("2020-01-01").getTime()) return "rejected";
  if (!Number.isNaN(exp) && exp > now) return "pending";
  return "hidden";
}

export const isImageUrl = (v?: string | null) => !!v && /^https?:\/\//.test(v);

/** "Ends in 3h", "Ends in 25m", "Ends today"... or null when there is no usable expiry. */
export function endsIn(expiresAt?: string | null, now = Date.now()): string | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - now;
  if (Number.isNaN(ms) || ms <= 0) return null;
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `Ends in ${Math.max(mins, 1)}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `Ends in ${hrs}h`;
  return `Ends in ${Math.round(hrs / 24)} days`;
}

export function discountLabel(discount?: number | null): string | null {
  if (!discount || discount <= 0) return null;
  return discount <= 100 ? `${discount}% off` : `₦${Math.round(discount).toLocaleString()} off`;
}
