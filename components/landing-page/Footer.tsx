import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-[#1a3d32] py-16 px-6 lg:px-10 text-white border-t border-white/10">
            <div className="max-w-[1400px] mx-auto">

                {/* Top row: brand + newsletter */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-12 border-b border-white/10">

                    {/* Brand */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-[#2d5f4f] font-black text-sm leading-none">O</span>
                            </div>
                            <span className="text-xl font-black tracking-tight">OyaEat</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-5">
                            Better chow, no wahala. Hot local food and essentials delivered sharp sharp to your door across Abuja.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                              {
                                label: "Facebook",
                                href: "#",
                                icon: (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                  </svg>
                                ),
                              },
                              {
                                label: "Instagram",
                                href: "#",
                                icon: (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
                                  </svg>
                                ),
                              },
                              {
                                label: "X / Twitter",
                                href: "#",
                                icon: (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                  </svg>
                                ),
                              },
                            ].map(({ label, href, icon }) => (
                              <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
                              >
                                {icon}
                              </a>
                            ))} 
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="max-w-sm w-full">
                        <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Stay in the loop</p>
                        <h4 className="text-lg font-black text-white mb-1 leading-tight">
                            Get deals before everyone else.
                        </h4>
                        <p className="text-white/50 text-sm mb-4">
                            Weekly offers, new restaurants, and promos — straight to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors font-medium"
                            />
                            <button className="px-4 py-2.5 bg-white text-[#1a3d32] text-sm font-black rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-12 border-b border-white/10">
                    <div>
                        <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-white/65 font-medium">
                            <li><Link href="/about" className="hover:text-white transition-colors duration-150">Our Story</Link></li>
                            <li><Link href="/features" className="hover:text-white transition-colors duration-150">Features</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-white transition-colors duration-150">How it Works</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors duration-150">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Earn with Us</h4>
                        <ul className="space-y-3 text-sm text-white/65 font-medium">
                            <li><Link href="/rider" className="hover:text-white transition-colors duration-150">Become a Rider</Link></li>
                            <li><Link href="/partner-signup" className="hover:text-white transition-colors duration-150">Become a Partner</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors duration-150">Join the Team</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Support</h4>
                        <ul className="space-y-3 text-sm text-white/65 font-medium">
                            <li><Link href="/support" className="hover:text-white transition-colors duration-150">Contact Support</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors duration-150">FAQs</Link></li>
                            <li>
                                <a href="mailto:info@oyaeat.com" className="hover:text-white transition-colors duration-150">
                                    info@oyaeat.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35 font-medium">
                    <span>© {new Date().getFullYear()} OyaEat. All rights reserved.</span>
                    <div className="flex items-center gap-5">
                        <Link href="/privacy" className="hover:text-white/70 transition-colors duration-150">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white/70 transition-colors duration-150">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white/70 transition-colors duration-150">Cookies</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
