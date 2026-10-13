import {
  Clock,
  Check,
  X,
  PauseCircle,
  FileText,
  Store,
  XCircle,
} from "lucide-react";

export const C = {
  brand: "#5b21b6",
  brandMid: "#6d28d9",
  brandLight: "#8b5cf6",
  mango: "#d97f06",
  mangoLight: "#fdba2d",
  success: "#15803d",
  bg: "#fbf9ff",
  white: "#FFFFFF",
  textDark: "inherit",
  textMuted: "#6b6480",
  border: "#e6e0f3",
  error: "#c8372d",
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending_review: {
    label: "Pending",
    color: C.mango,
    bg: "#fff4d6",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: C.success,
    bg: "#dcfce7",
    icon: Check,
  },
  rejected: { label: "Rejected", color: C.error, bg: "#FDECEA", icon: X },
  suspended: {
    label: "Suspended",
    color: "#6b6480",
    bg: "#f3f0fa",
    icon: PauseCircle,
  },
  draft: { label: "Draft", color: "#6b6480", bg: "#f3f0fa", icon: FileText },
};

export const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending_review", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

export const getStatusCfg = (status: string) =>
  STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
