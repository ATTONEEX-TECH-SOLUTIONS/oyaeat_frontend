import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-screen items-center bg-[var(--oya-surface-50)] p-4">
      <EmptyState
        className="mx-auto w-full max-w-xl"
        title={title}
        description={description}
      >
        <Link
          href="/"
          className="mt-6 text-label text-[var(--oya-green-700)] underline"
        >
          Back to homepage
        </Link>
      </EmptyState>
    </main>
  );
}
