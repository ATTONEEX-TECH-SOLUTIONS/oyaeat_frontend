import { MapPin, UtensilsCrossed, Bike } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    icon: MapPin,
    title: "Tell us where you are",
    body: "Drop your address and see every restaurant that delivers to you.",
  },
  {
    icon: UtensilsCrossed,
    title: "Pick your chow",
    body: "Browse menus, customise your order, and pay with cash, card or transfer.",
  },
  {
    icon: Bike,
    title: "Track it to your door",
    body: "A rider picks it up hot and you follow the delivery live on the map.",
  },
];

export default function HowItWorks() {
  return (
    <section className="lp-doodles py-16 lg:py-24 px-5 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          tone="dark"
          eyebrow="How it works"
          title="Hungry to happy in 3 steps"
        />
        <ol className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="relative bg-[var(--lp-cream-50)] rounded-3xl p-7 pt-10 shadow-[0_8px_0_rgba(26,16,51,0.25)]"
            >
              <span
                aria-hidden="true"
                className="lp-display absolute -top-5 left-7 w-11 h-11 rounded-full bg-[var(--lp-mango)] text-[var(--lp-violet-950)] text-2xl font-extrabold flex items-center justify-center shadow-[0_3px_0_#c98a06]"
              >
                {i + 1}
              </span>
              <span className="w-14 h-14 rounded-2xl bg-[var(--lp-violet-100)] flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-[var(--lp-violet-700)]" />
              </span>
              <h3 className="lp-display text-2xl font-bold text-[var(--lp-violet-900)] leading-tight">
                {title}
              </h3>
              <p className="mt-2 text-[var(--lp-ink-soft)] font-medium leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
