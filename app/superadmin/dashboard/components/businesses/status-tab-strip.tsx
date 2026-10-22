"use client";

import { C, STATUS_TABS } from "@/config/config";

interface StatusTabStripProps {
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  counts: Record<string, number>;
}

export function StatusTabStrip({
  activeStatus,
  setActiveStatus,
  counts,
}: StatusTabStripProps) {
  return (
    <div
      className="no-scrollbar mb-5 flex max-w-full gap-1 overflow-x-auto rounded-2xl border p-1.5 shadow-sm sm:w-fit"
      style={{ backgroundColor: C.white, borderColor: C.border }}
    >
      {STATUS_TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => setActiveStatus(t.key)}
          className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap"
          style={{
            backgroundColor: activeStatus === t.key ? C.brand : "transparent",
            color: activeStatus === t.key ? C.white : C.textMuted,
          }}
        >
          {t.label}
          <span
            className="ml-1.5 text-xs font-black"
            style={{
              color: activeStatus === t.key ? C.brandLight : C.textMuted,
            }}
          >
            {counts[t.key as keyof typeof counts] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
