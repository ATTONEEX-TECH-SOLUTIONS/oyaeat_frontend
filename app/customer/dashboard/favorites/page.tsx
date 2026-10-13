"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import RestaurantCard from "@/components/customer/RestaurantCard";
import { EmptyState, PageHeader } from "@/components/customer/ui";
import { useLikedRestaurants } from "@/hooks/useLikedRestaurants";

export default function SavedPage() {
  const { liked } = useLikedRestaurants();
  return (
    <div>
      <PageHeader title="Saved" subtitle="Restaurants you've hearted." />
      {liked.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          body="Tap the heart on any restaurant to keep it here for next time."
          action={{ label: "Browse restaurants", href: "/customer" }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {liked.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
