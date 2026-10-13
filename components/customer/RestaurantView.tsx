"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Plus,
  ShoppingBag,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { RestaurantImage, restaurantImage } from "./RestaurantCard";
import { EmptyState, ErrorState, QtyStepper, RowSkeleton } from "./ui";
import { Skeleton } from "@/components/ui/skeleton";
import { api, naira, resolveImg } from "@/lib/customer";
import { useCart } from "@/hooks/useCart";
import RestaurantReviews from "./RestaurantReviews";
import { useLikedRestaurants } from "@/hooks/useLikedRestaurants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function RestaurantView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const cart = useCart();
  const { isLiked, toggle } = useLikedRestaurants();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [category, setCategory] = useState("All");
  const [conflict, setConflict] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await api(`/public/restaurants/${id}/menu`);
      setRestaurant(json.data.restaurant);
      setMenu(json.data.menu || []);
    } catch (e: any) {
      setError({ message: e.message, status: e.status ?? 0 });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(menu.map((m) => m.category).filter(Boolean)))],
    [menu],
  );
  const visible = menu.filter((m) => category === "All" || m.category === category);

  const toCartItem = (item: any) => ({
    menuItemId: item.id,
    name: item.name,
    price: item.price,
    image: resolveImg(item.imageUrl),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
  });

  const add = (item: any) => {
    if (!cart.add(toCartItem(item))) setConflict(item);
  };

  if (loading) return <RestaurantSkeleton />;

  if (error || !restaurant) {
    return (
      <div className="mx-auto max-w-xl pt-6">
        {error?.status === 404 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="We couldn't find that restaurant"
            body="It may have closed or the link is out of date."
            action={{ label: "Browse restaurants", href: "/customer" }}
          />
        ) : (
          <ErrorState
            title="We couldn't load this menu"
            message={error?.message}
            onRetry={load}
          />
        )}
      </div>
    );
  }

  const liked = isLiked(restaurant.id);
  const rating = Number(restaurant.rating ?? restaurant.averageRating);
  const inThisCart = cart.restaurantId === restaurant.id;

  return (
    <div className="-mt-5 sm:-mt-7">
      {/* Cover */}
      <div className="relative -mx-4 h-52 overflow-hidden bg-violet-900 sm:h-64 lg:mx-0 lg:mt-7 lg:rounded-3xl">
        <RestaurantImage
          src={restaurantImage(restaurant) || resolveImg(restaurant.profilePicUrl)}
          alt={restaurant.name}
          className="h-full w-full opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/85 via-violet-950/20 to-black/20" />
        <div className="absolute inset-x-4 top-4 flex justify-between">
          <button
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/customer"))}
            aria-label="Back"
            className="grid h-11 w-11 place-items-center rounded-full bg-card/95 shadow-sm backdrop-blur"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggle(restaurant)}
            aria-pressed={liked}
            aria-label={liked ? "Remove from saved" : "Save restaurant"}
            className="grid h-11 w-11 place-items-center rounded-full bg-card/95 shadow-sm backdrop-blur active:scale-90"
          >
            <Heart className={cn("h-5 w-5", liked ? "fill-destructive text-destructive" : "")} />
          </button>
        </div>
      </div>

      {/* Identity */}
      <div className="relative z-10 -mt-8 rounded-3xl border border-border bg-card p-5 shadow-card sm:mx-4 lg:mx-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {restaurant.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {restaurant.type || "Restaurant"}
            </p>
          </div>
          {Number.isFinite(rating) && rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-mango-100 px-3 py-1.5 text-sm font-extrabold text-mango-800">
              <Star className="h-4 w-4 fill-mango-400 text-mango-400" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
        {(restaurant.streetAddress || restaurant.city) && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {[restaurant.streetAddress, restaurant.city].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {/* Category tabs stick under the top bar */}
      {categories.length > 2 && (
        <div className="sticky top-16 z-30 -mx-4 mt-5 border-b border-border bg-background/95 backdrop-blur lg:mx-0">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 lg:px-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "h-9 shrink-0 rounded-full px-4 text-sm font-bold transition",
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-violet-50 text-violet-900 hover:bg-violet-100",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <section className="mt-6" aria-label="Menu">
        {menu.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes yet"
            body="This kitchen hasn't added its menu. Try another restaurant."
            action={{ label: "Browse restaurants", href: "/customer" }}
          />
        ) : (
          <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {visible.map((item) => {
              const qty = cart.quantityOf(item.id);
              const unavailable = item.isAvailable === false;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex gap-4 rounded-3xl border border-border bg-card p-3 shadow-card sm:p-4",
                    unavailable && "opacity-60",
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-display line-clamp-2 text-base font-bold leading-snug">
                      {item.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.description || item.category}
                    </p>
                    <p className="mt-auto pt-3 text-base font-extrabold text-primary">
                      {naira(item.price)}
                    </p>
                  </div>
                  <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                    <div className="h-full w-full overflow-hidden rounded-2xl bg-violet-50">
                      <RestaurantImage
                        src={resolveImg(item.imageUrl)}
                        alt={item.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      {unavailable ? (
                        <span className="rounded-full bg-card px-3 py-1.5 text-xs font-bold shadow">
                          Sold out
                        </span>
                      ) : qty > 0 ? (
                        <div className="shadow-pop rounded-full bg-card">
                          <QtyStepper
                            size="sm"
                            quantity={qty}
                            onAdd={() => add(item)}
                            onRemove={() => cart.decrement(item.id)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => add(item)}
                          aria-label={`Add ${item.name}`}
                          className="inline-flex h-10 items-center gap-1 rounded-full bg-cta px-4 text-sm font-extrabold text-cta-foreground shadow-pop transition hover:bg-mango-300 active:scale-95"
                        >
                          <Plus className="h-4 w-4" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <RestaurantReviews businessId={restaurant.id} />

      {/* Sticky cart bar, above the mobile tab bar */}
      {inThisCart && cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-[4.75rem] z-30 px-4 md:bottom-6">
          <Link
            href="/customer/cart"
            className="mx-auto flex max-w-xl items-center justify-between rounded-full bg-primary p-2 pl-5 text-primary-foreground shadow-pop transition hover:bg-violet-800"
          >
            <span className="flex items-center gap-3 text-sm font-bold">
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-cta px-1.5 text-xs font-extrabold text-cta-foreground">
                {cart.count}
              </span>
              View cart
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold">
              {naira(cart.subtotal)} <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}

      {/* One restaurant per order */}
      <AlertDialog open={!!conflict} onOpenChange={(o) => !o && setConflict(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart has items from {cart.restaurantName}. You can only order from
              one restaurant at a time. Start a new cart with{" "}
              {restaurant.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep my cart</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-primary"
              onClick={() => {
                cart.replaceWith(toCartItem(conflict));
                setConflict(null);
              }}
            >
              Start new cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RestaurantSkeleton() {
  return (
    <div className="-mt-5 sm:-mt-7" aria-busy="true">
      <Skeleton className="-mx-4 h-52 rounded-none bg-muted sm:h-64 lg:mx-0 lg:mt-7 lg:rounded-3xl" />
      <div className="relative z-10 -mt-8 space-y-3 rounded-3xl border border-border bg-card p-5 sm:mx-4 lg:mx-6">
        <Skeleton className="h-7 w-1/2 bg-muted" />
        <Skeleton className="h-4 w-1/3 bg-muted" />
      </div>
      <div className="mt-8">
        <RowSkeleton rows={4} />
      </div>
    </div>
  );
}
