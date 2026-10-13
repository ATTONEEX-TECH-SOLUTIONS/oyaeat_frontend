import { Check } from "lucide-react";
import Navbar from "@/components/landing-page/Navbar";
import Footer from "@/components/landing-page/Footer";
import PartnerForm from "@/components/partner-signup/login/PartnerForm";
import PartnerSolutions from "@/components/partner-signup/login/PartnerSolutions";
import PartnerFAQ from "@/components/partner-signup/login/PartnerFAQ";
import { faqs } from "@/lib/data/data";

const PERKS = [
  "Free to register, with no upfront costs",
  "A simple commission only on completed orders",
  "A dashboard to manage your menu, orders and earnings",
  "Real riders and live order tracking for your customers",
];

const STEPS = [
  ["Create your account", "Tell us who you are."],
  ["Verify your phone", "A quick code to confirm it's you."],
  ["Add your business", "Name, location and what you serve."],
  ["Upload your documents", "We review them, then you go live."],
];

export const metadata = {
  title: "Become a partner | OyaEat",
  description: "Register your restaurant or kitchen on OyaEat and start receiving delivery orders.",
};

export default function PartnerSignupPage() {
  return (
    <div className="landing min-h-screen">
      <Navbar />

      <section className="lp-doodles">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">Partner with OyaEat</span>
            <h1 className="lp-display mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Put your kitchen <span className="text-[var(--lp-mango)]">on the map.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-violet-100">Register in minutes and start receiving delivery orders from customers near you.</p>
            <ul className="mt-6 space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--lp-mango)] text-[var(--lp-ink)]"><Check className="h-4 w-4" /></span>
                  <span className="text-violet-50">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="register" className="rounded-3xl bg-white p-5 text-foreground shadow-pop sm:p-8">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--lp-ink)]">Create your partner account</h2>
            <p className="mb-5 mt-1 text-sm text-muted-foreground">It takes about 5 minutes.</p>
            <PartnerForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--lp-violet-700)]">How it works</p>
        <h2 className="lp-display mt-2 text-3xl font-extrabold tracking-tight text-[var(--lp-ink)] sm:text-4xl">Four steps to your first order</h2>
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

      <PartnerSolutions />
      <PartnerFAQ data={faqs} />
      <Footer />
    </div>
  );
}
