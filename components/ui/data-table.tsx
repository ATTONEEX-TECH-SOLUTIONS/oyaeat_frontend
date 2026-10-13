import * as React from "react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  numeric?: boolean;
  render?: (row: T) => React.ReactNode;
};
export function DataTable<T extends { id: React.Key }>({
  columns,
  data,
  loading,
  error,
  className,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  className?: string;
}) {
  if (error)
    return (
      <p role="alert" className="text-body text-[var(--oya-danger)]">
        {error}
      </p>
    );
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-[var(--oya-border)] bg-[var(--oya-surface-0)]",
        className,
      )}
    >
      <table className="w-full text-body">
        <thead className="bg-[var(--oya-surface-100)]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-4 text-label text-[var(--oya-ink-600)]",
                  column.numeric ? "text-right" : "text-left",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                className="p-6 text-center text-[var(--oya-ink-600)]"
                colSpan={columns.length}
              >
                Loading…
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[var(--oya-border)] transition-colors hover:bg-[var(--oya-surface-50)]"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn("px-4 py-4", column.numeric && "text-right")}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
