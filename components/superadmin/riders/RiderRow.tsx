"use client";

import { Bike, Car, ChevronRight } from "lucide-react";
import { Badge, type Tone } from "@/components/superadmin/ui";
import type { AdminRider } from "@/lib/api/riders";
import { cn } from "@/lib/utils";

export const STATUS_TONE: Record<string, Tone> = {
  pending: "mango",
  verified: "violet",
  active: "success",
  inactive: "neutral",
};

const initials = (r: AdminRider) => `${r.firstName?.[0] || ""}${r.lastName?.[0] || ""}`.toUpperCase() || "R";

export default function RiderRow({ rider, onOpen }: { rider: AdminRider; onOpen: () => void }) {
  const vehicle = (rider.riderProfile?.vehicleType || "").toLowerCase();
  const Icon = vehicle === "car" ? Car : Bike;
  return (
    <li>
      <button onClick={onOpen} className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-violet-50/60 sm:gap-4 sm:p-4">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-100 font-display text-sm font-extrabold text-violet-800">
          {initials(rider)}
          <span
            className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card", rider.isOnline ? "bg-success" : "bg-border")}
            title={rider.isOnline ? "Online now" : "Offline"}
            aria-label={rider.isOnline ? "Online" : "Offline"}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-bold">{rider.firstName} {rider.lastName}</span>
          <span className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate capitalize">{vehicle || "No vehicle"}{rider.riderProfile?.plateNumber ? ` · ${rider.riderProfile.plateNumber}` : ""}</span>
          </span>
          <span className="block truncate text-xs text-muted-foreground sm:hidden">{rider.email}</span>
        </span>
        <span className="hidden min-w-0 max-w-[16rem] flex-1 text-sm text-muted-foreground sm:block">
          <span className="block truncate">{rider.email}</span>
          <span className="block truncate">{rider.phone}</span>
        </span>
        <Badge tone={STATUS_TONE[rider.status] || "neutral"}>{rider.status}</Badge>
        <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
      </button>
    </li>
  );
}
