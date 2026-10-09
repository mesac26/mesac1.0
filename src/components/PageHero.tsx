import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { PageGearBackground, type GearVariant } from "./PageGearBackground";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  bgImage,
  variant = "default",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  bgImage?: string;
  variant?: GearVariant;
}) {
  return (
    <section className="relative overflow-hidden gradient-hero pt-32 pb-16 sm:pt-40 sm:pb-24 text-white">
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Hero Background"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--background)] via-black/60 to-black/80" />
        </div>
      )}
      <PageGearBackground variant={variant} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {eyebrow && (
          <Reveal>
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              {eyebrow}
            </div>
          </Reveal>
        )}
        <Reveal delay={60}>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] max-w-4xl break-words tracking-tight">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={120}>
            <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
