"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/spalsh_oyaeat (3).png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
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
     { href: "/restaurant/login", label: "Vendor" },
    { href: "/features", label: "Features" },
    { href: "/downloads", label: "Downloads" },
    { href: "/how-it-works", label: "How it works" },
   
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-20">
        
        {/* Logo with Text - BIGGER */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-26 h-26 transition-transform duration-300 group-hover:scale-110">
            {/* <Image
              src={logo}
              alt="OyaEat Logo"
              fill
              className="object-contain"
              priority
            /> */}
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black leading-none tracking-tight">
              <span className="text-[#2d5f4f]">Oya</span>
              <span className={`transition-colors duration-300 ${scrolled ? "text-gray-800" : "text-gray-900"}`}>Eat</span>
            </span>
            <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${scrolled ? "text-gray-500" : "text-gray-600"}`}>
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
                    : scrolled 
                      ? "text-gray-800 hover:text-[#2d5f4f]"
                      : "text-gray-900 hover:text-[#2d5f4f]"
                }`}
              >
                {link.label}

                {/* Animated underline */}
                <span
                  className={`absolute bottom-0 left-0 h-1 bg-[#2d5f4f] rounded-full transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
