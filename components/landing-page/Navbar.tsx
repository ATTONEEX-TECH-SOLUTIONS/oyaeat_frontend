"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Bike, Store, Briefcase, Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/downloads", label: "Downloads" },
    { href: "/how-it-works", label: "How it works" },
  ];

  const joinLinks = [
    { href: "/rider", label: "Become a Rider", icon: Bike, desc: "Earn on your schedule" },
    { href: "/partner-signup", label: "Become a Partner", icon: Store, desc: "Grow your restaurant" },
    { href: "/careers", label: "Careers", icon: Briefcase, desc: "Join our core team" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-[#2d5f4f] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm leading-none">O</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight">
                <span className="text-[#2d5f4f]">Oya</span>
                <span className={`transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-gray-900"}`}>Eat</span>
              </span>
              <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 transition-colors duration-300 ${scrolled ? "text-gray-400" : "text-gray-500"}`}>
                Fast Delivery
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-semibold text-sm transition-colors duration-200 py-1.5 group ${
                    isActive
                      ? "text-[#2d5f4f]"
                      : scrolled
                      ? "text-gray-700 hover:text-[#2d5f4f]"
                      : "text-gray-800 hover:text-[#2d5f4f]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#2d5f4f] rounded-full transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Earn with Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 font-semibold text-sm transition-colors duration-200 py-1.5 ${
                  dropdownOpen
                    ? "text-[#2d5f4f]"
                    : scrolled
                    ? "text-gray-700 hover:text-[#2d5f4f]"
                    : "text-gray-800 hover:text-[#2d5f4f]"
                }`}
              >
                Earn with Us
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute right-0 top-full pt-3 w-64 transition-all duration-200 origin-top-right ${
                  dropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 overflow-hidden">
                  {joinLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 bg-[#2d5f4f]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#2d5f4f] transition-colors">
                          <Icon className="w-4 h-4 text-[#2d5f4f] group-hover/item:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/customer/login"
              className={`text-sm font-semibold transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-black/5 ${
                scrolled ? "text-gray-700" : "text-gray-800"
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/customer"
              className="text-sm font-bold bg-[#2d5f4f] text-white px-4 py-2 rounded-lg hover:bg-[#234a3d] transition-colors duration-200"
            >
              Order Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={`w-5 h-5 ${scrolled ? "text-gray-800" : "text-gray-900"}`} />
            ) : (
              <Menu className={`w-5 h-5 ${scrolled ? "text-gray-800" : "text-gray-900"}`} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-20 pb-6 px-5 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    isActive ? "bg-[#2d5f4f]/10 text-[#2d5f4f]" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-2 border-t border-gray-100" />
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-3 mb-1">Earn with Us</p>
            {joinLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#2d5f4f]" />
                  <span className="font-semibold text-sm text-gray-700">{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-4 px-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700"
              >
                Sign in
              </Link>
              <Link
                href="/partner-signup"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 bg-[#2d5f4f] rounded-lg text-sm font-bold text-white"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;