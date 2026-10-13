"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Bike,
  Store,
  Briefcase,
  Menu,
  X,
  UtensilsCrossed,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/#download", label: "Get the app" },
];

const joinLinks = [
  {
    href: "/rider/login",
    label: "Become a Rider",
    icon: Bike,
    desc: "Earn on your schedule",
  },
  {
    href: "/partner-signup",
    label: "Become a Partner",
    icon: Store,
    desc: "Grow your restaurant",
  },
  {
    href: "/careers",
    label: "Careers",
    icon: Briefcase,
    desc: "Join our core team",
  },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="OyaEat home"
      className={`flex items-center gap-2 flex-shrink-0 ${className}`}
    >
      <span className="w-9 h-9 rounded-full bg-[var(--lp-mango)] text-[var(--lp-violet-900)] flex items-center justify-center shadow-[0_2px_0_rgba(0,0,0,0.18)]">
        <UtensilsCrossed className="w-[18px] h-[18px]" strokeWidth={2.6} />
      </span>
      <span className="lp-display text-[26px] font-extrabold leading-none">
        <span className="text-[var(--lp-mango)]">Oya</span>
        <span className="text-white">Eat</span>
      </span>
    </Link>
  );
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on Escape / outside click; lock body scroll while the drawer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkBase =
    "relative text-sm font-bold text-white/90 hover:text-white transition-colors py-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lp-mango)] rounded";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--lp-violet-800)]/95 backdrop-blur-md shadow-[0_6px_24px_rgba(26,16,51,0.25)]"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="max-w-[1400px] mx-auto px-5 lg:px-10 flex items-center justify-between h-[72px]"
        >
          <Logo />

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={linkBase}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[3px] rounded-full bg-[var(--lp-mango)] transition-all duration-200 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`${linkBase} flex items-center gap-1`}
              >
                Earn with us
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 top-full pt-3 w-72 origin-top-right transition-all duration-200 ${
                  dropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div
                  role="menu"
                  className="bg-[var(--lp-cream-50)] rounded-2xl shadow-2xl border-2 border-[var(--lp-cream)] p-2"
                >
                  {joinLinks.map(({ href, label, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--lp-cream)] transition-colors group/item"
                    >
                      <span className="w-9 h-9 rounded-full bg-[var(--lp-violet-700)] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[var(--lp-mango)]" />
                      </span>
                      <span>
                        <span className="block font-bold text-[var(--lp-ink)] text-sm leading-tight">
                          {label}
                        </span>
                        <span className="block text-xs text-[var(--lp-ink-soft)] mt-0.5">
                          {desc}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/customer/login"
              className="text-sm font-bold text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--lp-mango)]"
            >
              Sign in
            </Link>
            <Link
              href="/customer"
              className="text-sm font-extrabold bg-[var(--lp-mango)] text-[var(--lp-violet-950)] px-5 py-2.5 rounded-full shadow-[0_3px_0_#c98a06] hover:-translate-y-px hover:shadow-[0_4px_0_#c98a06] active:translate-y-px active:shadow-[0_1px_0_#c98a06] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Order now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--lp-mango)]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-[var(--lp-violet-950)]/60"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[min(20rem,88vw)] lp-doodles shadow-2xl transition-transform duration-300 flex flex-col ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-[72px]">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-5 pb-6 flex-1 overflow-y-auto flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`lp-display text-2xl font-bold px-3 py-2.5 rounded-xl transition-colors ${
                  pathname === link.href
                    ? "bg-white/15 text-[var(--lp-mango)]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <p className="text-[11px] font-extrabold tracking-widest uppercase text-white/60 px-3 mt-5 mb-1">
              Earn with us
            </p>
            {joinLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-white font-bold hover:bg-white/10 transition-colors"
              >
                <Icon className="w-5 h-5 text-[var(--lp-mango)]" />
                {label}
              </Link>
            ))}
          </div>

          <div className="p-5 grid grid-cols-2 gap-3 border-t border-white/15">
            <Link
              href="/customer/login"
              onClick={() => setMobileOpen(false)}
              className="text-center py-3 rounded-full border-2 border-white/40 text-white font-bold text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/customer"
              onClick={() => setMobileOpen(false)}
              className="text-center py-3 rounded-full bg-[var(--lp-mango)] text-[var(--lp-violet-950)] font-extrabold text-sm"
            >
              Order now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
