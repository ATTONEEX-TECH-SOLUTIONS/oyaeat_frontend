import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, Store, Briefcase } from "lucide-react";
import riderImage from "@/public/rider.png";
import chefImage from "@/public/vendor.png";
import careersImage from "@/public/career.png";
import { SectionHeading } from "./SectionHeading";

const opportunities = [
  {
    image: riderImage,
    icon: Bike,
    eyebrow: "Flexible hours",
    title: "Become a rider",
    description:
      "Earn on your own schedule. Deliver across Abuja and get paid weekly.",
    cta: "Start earning",
    href: "/rider/login",
  },
  {
    image: chefImage,
    icon: Store,
    eyebrow: "Grow your business",
    title: "Become a partner",
    description:
      "Reach thousands of hungry customers in Abuja. Zero upfront cost to get started.",
    cta: "Get started",
    href: "/partner-signup",
  },
  {
    image: careersImage,
    icon: Briefcase,
    eyebrow: "Join the team",
    title: "Build with us",
    description:
      "Help shape the future of food delivery in Africa. Engineering, ops, design - we're hiring.",
    cta: "View openings",
    href: "/careers",
  },
];

const LetsDoItTogether = () => {
  return (
    <section className="bg-[var(--lp-violet-950)] py-16 lg:py-24 px-5 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          tone="dark"
          eyebrow="Opportunities"
          title="Let's do it together."
          subtitle="Whether you ride, cook, or build, there's a place for you in the OyaEat family."
        />

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {opportunities.map(
            ({ image, icon: Icon, eyebrow, title, description, cta, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="group h-full flex flex-col items-center text-center bg-[var(--lp-violet-800)] rounded-[2rem] px-6 pt-8 pb-7 border-2 border-white/10 hover:border-[var(--lp-mango)] hover:-translate-y-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lp-mango)]"
                >
                  <span className="relative w-44 h-44 mb-6">
                    <span className="absolute inset-0 rounded-full bg-[var(--lp-cream)] border-[6px] border-[var(--lp-mango)] overflow-hidden">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="176px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </span>
                    <span className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full bg-[var(--lp-mango)] text-[var(--lp-violet-950)] flex items-center justify-center shadow-[0_3px_0_#c98a06]">
                      <Icon className="w-5 h-5" />
                    </span>
                  </span>

                  <span className="text-xs font-extrabold tracking-widest uppercase text-[var(--lp-mango)]">
                    {eyebrow}
                  </span>
                  <span className="lp-display mt-1 text-3xl font-extrabold text-[var(--lp-cream)] leading-tight">
                    {title}
                  </span>
                  <span className="mt-2 mb-6 text-white/75 font-medium leading-relaxed max-w-xs">
                    {description}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-[var(--lp-cream)] text-[var(--lp-violet-900)] font-extrabold text-sm px-6 py-3 group-hover:bg-[var(--lp-mango)] transition-colors">
                    {cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
};

export default LetsDoItTogether;
