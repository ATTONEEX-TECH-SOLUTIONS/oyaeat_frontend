import { Smartphone } from "lucide-react";

const stores = [
  { name: "Google Play", kicker: "Get it on" },
  { name: "App Store", kicker: "Download on the" },
];

export default function DownloadBand() {
  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="px-5 lg:px-10 py-16 lg:py-20 scroll-mt-20"
    >
      <div className="max-w-[1400px] mx-auto lp-doodles rounded-[2rem] px-6 sm:px-12 py-12 lg:py-14 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center overflow-hidden">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 text-[var(--lp-mango)] text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            Mobile app
          </span>
          <h2
            id="download-heading"
            className="lp-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] text-[var(--lp-cream)]"
          >
            Your next meal is{" "}
            <span className="text-[var(--lp-mango)]">a tap away.</span>
          </h2>
          <p className="mt-3 text-white/80 font-medium max-w-md">
            The OyaEat app is on its way. Until then, order from any browser and
            track your rider live.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--lp-violet-950)] border-2 border-dashed border-[var(--lp-mango)]/60 p-5">
          <p className="lp-display text-lg font-bold text-[var(--lp-cream)] mb-3">
            Download the app
          </p>
          <div className="flex flex-wrap gap-3">
            {stores.map((s) => (
              <span
                key={s.name}
                aria-label={`${s.name} - coming soon`}
                className="inline-flex items-center gap-3 rounded-xl bg-black border border-white/25 px-4 py-2 opacity-90"
              >
                <Smartphone className="w-6 h-6 text-white" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block text-[10px] uppercase tracking-wide text-white/70">
                    {s.kicker}
                  </span>
                  <span className="block text-base font-bold text-white">
                    {s.name}
                  </span>
                </span>
                <span className="ml-1 rounded-full bg-[var(--lp-mango)] text-[var(--lp-violet-950)] text-[10px] font-extrabold uppercase px-2 py-0.5">
                  Soon
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
