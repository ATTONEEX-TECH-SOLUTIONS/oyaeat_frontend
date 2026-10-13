import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = React.ComponentProps<"section"> & {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void; loading?: boolean };
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-[var(--oya-border)] bg-[var(--oya-surface-0)] p-6 text-center md:p-8",
        className,
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-[var(--oya-green-500)]">{icon}</div>}
      <h2 className="text-h2">{title}</h2>
      <p className="text-body mt-2 max-w-sm text-[var(--oya-ink-600)]">
        {description}
      </p>
      {action && (
        <Button
          className="mt-6"
          loading={action.loading}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </section>
  );
}
