"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Bike, Store, Briefcase } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span className="text-3xl font-black leading-none tracking-tight">
              <span className="text-[#2d5f4f]">Oya</span>
              <span className={`transition-colors duration-300 ${scrolled ? "text-gray-800" : "text-gray-900"}`}>Eat</span>
            </span>
            <span className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 ${scrolled ? "text-gray-500" : "text-gray-600"}`}>
              Fast Delivery
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-bold text-base transition-all duration-300 py-2 group ${
                  isActive 
                    ? "text-[#2d5f4f]" 
                    : scrolled ? "text-gray-800 hover:text-[#2d5f4f]" : "text-gray-900 hover:text-[#2d5f4f]"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-1 bg-[#2d5f4f] rounded-full transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}

          {/* Interactive Dropdown for Rider, Partner, and Careers */}
          <div 
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`flex items-center gap-1 font-bold text-base transition-all duration-300 py-2 ${
                dropdownOpen ? "text-[#2d5f4f]" : scrolled ? "text-gray-800 hover:text-[#2d5f4f]" : "text-gray-900 hover:text-[#2d5f4f]"
              }`}
            >
              Earn with Us
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-[#2d5f4f]" : ""}`} />
            </button>

            {/* Dropdown Card */}
            <div
              className={`absolute right-0 top-full w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-300 origin-top-right ${
                dropdownOpen ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-95 pointer-events-none -translate-y-2"
              }`}
            >
              {joinLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item"
                  >
                    <div className="p-2 bg-[#2d5f4f]/10 rounded-lg group-hover/item:bg-[#2d5f4f] transition-colors">
                      <Icon className="w-5 h-5 text-[#2d5f4f] group-hover/item:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm group-hover/item:text-[#2d5f4f] transition-colors">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
