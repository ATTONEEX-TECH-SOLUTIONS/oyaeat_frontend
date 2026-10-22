import { ChefHat, Cloud, CookingPot, Croissant, Truck, UtensilsCrossed } from "lucide-react";

const WHO = [
  { icon: UtensilsCrossed, title: "Restaurants", body: "Dine-in spots and fast food that want delivery without the overhead." },
  { icon: Cloud, title: "Cloud kitchens", body: "Delivery-only kitchens that live and die by order volume." },
  { icon: CookingPot, title: "Home chefs", body: "Cook from home and reach hungry customers nearby." },
  { icon: Croissant, title: "Bakeries & snacks", body: "Pastries, shawarma and confectionery, delivered fresh." },
  { icon: Truck, title: "Food trucks", body: "Take orders even when you're on the move." },
  { icon: ChefHat, title: "Caterers", body: "Handle bulk orders with one clear dashboard." },
];

export default function PartnerSolutions() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--lp-violet-700)]">Who it&apos;s for</p>
        <h2 className="lp-display mt-2 text-3xl font-extrabold tracking-tight text-[var(--lp-ink)] sm:text-4xl">Built for every kind of kitchen</h2>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WHO.map(({ icon: Icon, title, body }) => (
          <li key={title} className="rounded-3xl border border-[#ecdcae] bg-white p-6 shadow-sm">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--lp-violet-100)] text-[var(--lp-violet-700)]"><Icon className="h-6 w-6" /></span>
            <h3 className="lp-display mt-4 text-xl font-bold text-[var(--lp-ink)]">{title}</h3>
            <p className="mt-1 text-[var(--lp-ink-soft)]">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
