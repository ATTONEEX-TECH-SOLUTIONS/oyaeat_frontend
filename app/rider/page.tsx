import Link from "next/link";
import { ArrowRight, Banknote, Clock, MapPinned, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";

export const metadata = {
  title: "Ride with OyaEat",
  description: "Deliver food with OyaEat. Go online when you want, accept the orders you like and track your earnings.",
};

const PERKS = [
  { icon: Clock, title: "Your schedule", body: "Go online when you're ready and offline when you're done. No fixed shifts." },
  { icon: MapPinned, title: "Orders near you", body: "Delivery requests come to you based on where you are." },
  { icon: Banknote, title: "See what you earn", body: "Every delivery, your balance and your payouts are in one place." },
  { icon: ShieldCheck, title: "Verified riders", body: "Every rider is reviewed before taking orders, so customers can trust you." },
];

const STEPS = [
  ["Apply", "Share your details, vehicle and a valid ID."],
  ["Get verified", "We review your application."],
  ["Go online", "Tap one switch to start receiving orders."],
  ["Deliver and get paid", "Complete deliveries, then request a payout to your bank."],
];

const FAQ = [
  ["What do I need to apply?", "Your name, phone number and email, your vehicle type and plate number, and a valid ID document (PDF, JPG or PNG)."],
  ["Can I choose when I ride?", "Yes. You decide when to go online and when to go offline."],
  ["How do I get paid?", "Your earnings build up in your balance. Request a payout from the Earnings screen and it's sent to your linked bank account."],
  ["Which vehicles can I use?", "Motorcycles, bicycles and cars."],
];

export default function RiderLanding() {
  return (
    <div className="landing min-h-screen">
      <Navbar />

      <section className="lp-doodles">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white sm:py-24">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">Ride with OyaEat</span>
          <h1 className="lp-display mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
            Deliver food. <span className="text-[var(--lp-mango)]">Keep your freedom.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">Go online when you want, accept the orders you like and track every naira you earn.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/rider/register" className="inline-flex h-14 items-center gap-2 rounded-full bg-[var(--lp-mango)] px-8 text-lg font-extrabold text-[var(--lp-ink)] shadow-lg transition hover:brightness-105">
              Apply to ride <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/rider/login" className="inline-flex h-14 items-center rounded-full border-2 border-white/40 px-8 text-lg font-bold text-white transition hover:bg-white/10">Rider log in</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <h2 className="lp-display text-3xl font-extrabold tracking-tight text-[var(--lp-ink)] sm:text-4xl">Why ride with us</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-3xl border border-[#ecdcae] bg-white p-6 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--lp-violet-100)] text-[var(--lp-violet-700)]"><Icon className="h-6 w-6" /></span>
              <h3 className="lp-display mt-4 text-xl font-bold text-[var(--lp-ink)]">{title}</h3>
              <p className="mt-1 text-[var(--lp-ink-soft)]">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <h2 className="lp-display text-3xl font-extrabold tracking-tight text-[var(--lp-ink)] sm:text-4xl">How it works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, b], i) => (
            <li key={t} className="rounded-3xl bg-[var(--lp-violet-700)] p-6 text-white">
              <span className="lp-display grid h-10 w-10 place-items-center rounded-full bg-[var(--lp-mango)] text-lg font-extrabold text-[var(--lp-ink)]">{i + 1}</span>
              <h3 className="lp-display mt-4 text-xl font-bold">{t}</h3>
              <p className="mt-1 text-violet-100">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
        <h2 className="lp-display text-3xl font-extrabold tracking-tight text-[var(--lp-ink)] sm:text-4xl">Questions, answered</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group overflow-hidden rounded-2xl border border-[#ecdcae] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-bold text-[var(--lp-ink)]">
                {q}
                <span className="text-xl text-[var(--lp-violet-700)] transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="px-5 pb-5 text-[var(--lp-ink-soft)]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
