import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  trend,
  className,
}: {
  label: string;
  value: React.ReactNode;
  trend?: string;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 py-6", className)}>
      <CardContent>
        <p className="text-label text-[var(--oya-ink-600)]">{label}</p>
        <p className="text-display mt-2">{value}</p>
        {trend && (
          <p className="text-caption mt-2 text-[var(--oya-green-700)]">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
