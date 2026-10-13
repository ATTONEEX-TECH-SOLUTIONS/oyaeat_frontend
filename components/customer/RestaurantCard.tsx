"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Star, UtensilsCrossed } from "lucide-react";
import { useLikedRestaurants } from "@/hooks/useLikedRestaurants";
import { resolveImg } from "@/lib/customer";
import { cn } from "@/lib/utils";

export const restaurantImage = (r: any) =>
  resolveImg(
    r.galleryImages?.[0]?.imageUrl || r.thumbnailUrl || r.profilePicUrl,
  );

export function RestaurantImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-gradient-to-br from-violet-100 to-mango-100 text-violet-400",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <UtensilsCrossed className="h-10 w-10" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

export default function RestaurantCard({ restaurant }: { restaurant: any }) {
  const { isLiked, toggle } = useLikedRestaurants();
  const liked = isLiked(restaurant.id);
  const rating = Number(restaurant.rating ?? restaurant.averageRating);
  const second = restaurant.galleryImages?.[1]?.imageUrl;

  return (
    <Link
      href={`/customer/restaurant/${restaurant.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-violet-50">
        <RestaurantImage
          src={restaurantImage(restaurant)}
          alt={restaurant.name}
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
        {second && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            +{(restaurant.galleryImages?.length || 1) - 1} photos
          </span>
        )}
        <button
          type="button"
          aria-label={liked ? "Remove from saved" : "Save restaurant"}
          aria-pressed={liked}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(restaurant);
          }}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-card/95 shadow-sm backdrop-blur transition active:scale-90"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition",
              liked ? "fill-destructive text-destructive" : "text-violet-900",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display line-clamp-1 text-lg font-bold leading-tight text-foreground group-hover:text-primary">
            {restaurant.name}
          </h3>
          {Number.isFinite(rating) && rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-mango-100 px-2 py-0.5 text-xs font-extrabold text-mango-800">
              <Star className="h-3.5 w-3.5 fill-mango-400 text-mango-400" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {restaurant.type || "Restaurant"}
        </p>
        {(restaurant.city || restaurant.streetAddress) && (
          <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">
              {restaurant.city || restaurant.streetAddress}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
