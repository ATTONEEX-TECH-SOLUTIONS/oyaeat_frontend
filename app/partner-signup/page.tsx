import Image from "next/image";
import Link from "next/link";
import PartnerForm from "@/components/partner-signup/login/PartnerForm";
import PartnerSolutions from "@/components/partner-signup/login/PartnerSolutions";
import PartnerFAQ from "@/components/partner-signup/login/PartnerFAQ";
import { solutions, testimonials, faqs } from "@/lib/data/data";

import logo from "@/public/spalsh_oyaeat (3).png";
import chefImage from "@/public/vendor.png";
import { Star, Mail, Phone, MapPin } from "lucide-react";

export default function PartnerSignup() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/restaurant/login", label: "Sign in" },
    { href: "/features", label: "Features" },
    { href: "/downloads", label: "Downloads" },
    { href: "/how-it-works", label: "How it works" },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-[#e8f5f1] to-[#d4ebe5]">
      
      {/* RESTORED: Your Original Navbar Layout */}
      <nav className="fixed top-0 w-full z-50 bg-transparent">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="text-3xl font-black leading-none tracking-tight">
                <span className="text-[#2d5f4f]">Oya</span>
                <span className="text-gray-900">Eat</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-gray-600">
                Fast Delivery
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-bold text-base text-gray-900 hover:text-[#2d5f4f] transition-all duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-1 bg-[#2d5f4f] rounded-full transition-all duration-300 ease-out w-0 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button className="lg:hidden text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Form Block Grid */}
      <div className="flex-1 flex flex-col lg:flex-row pt-20">
        <div className="lg:w-1/2 w-full px-6 lg:px-16 py-12 lg:py-20 flex items-center">
          <div className="w-full max-w-xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Build your business<br />online with OyaEat
            </h1>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start selling through OyaEat</h2>
              <p className="text-gray-700 mb-8">Registering on OyaEat has never been easier. Become a partner now.</p>

              <PartnerForm />

              <p className="text-xs text-gray-600 text-center mt-4">
                By continuing, you agree to our{" "}
                <Link href="#" className="text-[#2d5f4f] hover:underline font-medium">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="text-[#2d5f4f] hover:underline font-medium">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Brand Hero Showcase Side */}
        <div className="lg:w-1/2 w-full relative min-h-[400px] lg:min-h-screen overflow-hidden bg-transparent">
          <div className="absolute top-0 left-0 w-24 lg:w-32 h-full bg-[#FDB750] -skew-x-12 transform origin-top-left z-0" />
          <div className="absolute bottom-0 right-0 w-24 lg:w-32 h-full bg-[#FDB750] -skew-x-12 transform origin-bottom-right z-0" />
          
          <div className="relative h-full flex items-center justify-center p-8 lg:p-16 z-10">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-[#c8574a]/20 rounded-full blur-xl scale-95" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[85%] h-[85%]">
                  <Image
                    src={chefImage}
                    alt="Partner chef"
                    fill
                    priority
                    sizes="(max-w-7xl) 50vw, 100vw"
                    className="object-cover rounded-[3rem] shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <PartnerSolutions data={solutions} />

      {/* Partner Endorsements Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What our partners say</h2>
            <p className="text-xl text-gray-600">Join thousands of successful businesses already growing with OyaEat</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#2d5f4f] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-white/80">{testimonial.business}</p>
                  </div>
                </div>
                <div className="flex mb-4 gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FDB750] fill-[#FDB750]" />
                  ))}
                </div>
                <p className="text-white italic text-sm leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Grid */}
      <PartnerFAQ data={faqs} />

      {/* Dark Universal Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-black tracking-tight"><span className="text-[#2d5f4f]">Oya</span>Eat</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Nigeria's fastest growing food delivery platform. Connecting customers with their favorite restaurants.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">How it Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">For Partners</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">Partner Registration</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Partner Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> partners@oyaeat.com</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +234 800 123 4567</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-medium">
            <p>© {new Date().getFullYear()} OyaEat. All rights reserved.</p>
            <div className="flex gap-6 mt-2 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
