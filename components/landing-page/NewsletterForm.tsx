"use client";

import { FormEvent, useState } from "react";

// Newsletter signup is not wired to a backend yet; this only confirms
// locally so the control behaves like a real form.
export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <p role="status" className="text-[var(--lp-mango)] font-bold text-sm">
        Thanks! We&apos;ll keep you posted.
      </p>
    );
  }

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="your@email.com"
        className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--lp-mango)] transition-colors font-medium"
      />
      <button
        type="submit"
        className="px-5 py-3 bg-[var(--lp-mango)] text-[var(--lp-violet-950)] text-sm font-extrabold rounded-full hover:brightness-105 transition whitespace-nowrap flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Subscribe
      </button>
    </form>
  );
}
