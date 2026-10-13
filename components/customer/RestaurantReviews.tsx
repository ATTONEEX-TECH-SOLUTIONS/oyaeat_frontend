"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/customer";
import { cn } from "@/lib/utils";

type Review = { id: number; rating: number; comment?: string | null; createdAt: string; customerName: string };

const Stars = ({ value, size = "h-4 w-4" }: { value: number; size?: string }) => (
  <span className="inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={cn(size, n <= Math.round(value) ? "fill-cta text-cta" : "text-border")} />
    ))}
  </span>
);

/** What other customers said. Renders nothing until there is at least one real review. */
export default function RestaurantReviews({ businessId }: { businessId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const d = (await api(`/public/restaurants/${businessId}/reviews?page=${p}&limit=5`)).data;
        setReviews((prev) => (p === 1 ? d.reviews : [...prev, ...d.reviews]));
        setAvg(d.averageRating || 0);
        setTotal(d.totalReviews || 0);
        setPages(d.pagination?.totalPages || 1);
        setPage(p);
      } catch {
        // reviews are a nice-to-have; never break the menu page over them
      } finally {
        setLoading(false);
      }
    },
    [businessId],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  if (!total) return null;

  return (
    <section aria-labelledby="reviews-heading" className="mt-10">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <h2 id="reviews-heading" className="font-display text-xl font-extrabold">Reviews</h2>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Stars value={avg} /> <b className="text-foreground">{avg.toFixed(1)}</b> · {total} {total === 1 ? "review" : "reviews"}
        </span>
      </div>
      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        {reviews.map((r) => (
          <li key={r.id} className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold">{r.customerName}</p>
              <span className="text-xs text-muted-foreground">{format(new Date(r.createdAt), "d MMM yyyy")}</span>
            </div>
            <Stars value={r.rating} />
            {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
          </li>
        ))}
      </ul>
      {page < pages && (
        <button onClick={() => load(page + 1)} disabled={loading} className="mx-auto mt-4 flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-bold transition hover:bg-violet-50 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Show more
        </button>
      )}
    </section>
  );
}
