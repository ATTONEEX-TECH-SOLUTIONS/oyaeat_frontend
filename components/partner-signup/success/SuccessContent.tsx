"use client";

import Logo from "@/components/brand/Logo";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ClipboardCheck, LogIn, UtensilsCrossed } from "lucide-react";

const NEXT = [
  { icon: ClipboardCheck, title: "We review your documents", body: "Our team checks your CAC details and identity within 2 business days." },
  { icon: LogIn, title: "You get access", body: "Once approved, log in to your OyaEat restaurant dashboard." },
  { icon: UtensilsCrossed, title: "Add your menu and go live", body: "Add dishes, prices and photos, and start taking orders." },
];

export default function SuccessContent() {
  const params = useSearchParams();
  const [name, setName] = useState("your business");
  useEffect(() => {
    const q = params.get("businessName");
    if (q) setName(q);
  }, [params]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Link href="/" aria-label="OyaEat home"><Logo className="h-9" /></Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-card sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success"><CheckCircle2 className="h-8 w-8" /></span>
          <h1 className="font-display mt-5 text-3xl font-extrabold tracking-tight">Documents submitted</h1>
          <p className="mt-2 text-muted-foreground">Thank you. We&apos;ve received the documents for <b className="text-foreground">{name}</b> and will review them shortly.</p>

          <ol className="mt-8 space-y-3 text-left">
            {NEXT.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="flex items-start gap-4 rounded-2xl bg-violet-50 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-bold">{i + 1}. {title}</p>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link href="/restaurant/login" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-cta px-8 text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300">
            Go to my dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
