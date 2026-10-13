import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RiderAuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1fr_1.1fr]">
      <aside className="lp-doodles relative hidden flex-col justify-between p-12 text-white lg:flex">
        <Link href="/rider" className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="max-w-md">
          <p className="font-display text-5xl font-extrabold tracking-tight">oyaeat</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">Riders</p>
          <h2 className="font-display mt-8 text-4xl font-extrabold leading-tight">Ride on your schedule. <span className="text-cta">Deliver with OyaEat.</span></h2>
          <p className="mt-3 text-lg text-violet-100">Go online when you want, accept the orders you like, and track every naira you earn.</p>
        </div>
        <span className="h-1.5 w-24 rounded-full bg-cta" />
      </aside>

      <main className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/rider" className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-primary hover:bg-violet-50 lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <p className="font-display mb-5 text-3xl font-extrabold text-primary lg:hidden">oyaeat</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </main>
    </div>
  );
}
