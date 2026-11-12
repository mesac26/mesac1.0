import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import {
  ShieldCheck,
  FileText,
  Lock,
  Database,
  Calculator,
  ExternalLink,
  Mail,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Information Policy — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Privacy and data information for the official student portal of Mechanical Engineering Students Association (MESAC), CUSAT.",
      },
      { property: "og:title", content: "Privacy Policy — MESAC CUSAT" },
      {
        property: "og:description",
        content: "Frontend data handling, local storage, and privacy notice for the MESAC website.",
      },
    ],
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <Layout>
      <PageHero
        variant="academic"
        eyebrow="Website Information Notice"
        title={
          <>
            Privacy & <span className="italic text-gold">Data Notice</span>
          </>
        }
        subtitle="Transparent information regarding frontend data handling, browser storage, academic calculators, and external links on the MESAC student portal."
      />

      <section className="py-16 sm:py-24 bg-background text-foreground relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
          {/* NOTICE INTRO CARD */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lift space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold">
                <ShieldCheck className="h-4 w-4" />
                <span>Student Association Portal</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Overview & Purpose
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                This website is maintained by the Mechanical Engineering Students Association
                (MESAC), Division of Mechanical Engineering, School of Engineering, Cochin
                University of Science and Technology (CUSAT). This policy explains how information
                is handled across our frontend web pages, calculators, and interactive forms.
              </p>
            </div>
          </Reveal>

          {/* POLICY SECTIONS */}
          <div className="space-y-8">
            {/* 1. ACADEMIC CALCULATOR DATA */}
            <Reveal delay={40}>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Section 1
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      GPA / CGPA Calculator & Academic Tools
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  All course titles, semester credits, raw marks, and letter grades entered into the
                  MESAC Semester GPA and Cumulative CGPA calculators are processed entirely inside
                  your personal web browser using client-side JavaScript. This data is never sent
                  to, stored on, or analyzed by any external server or tracking network.
                </p>
              </div>
            </Reveal>

            {/* 2. FORM SUBMISSIONS */}
            <Reveal delay={80}>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Section 2
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Contact Inquiries & Course Interest Forms
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The interactive contact and MESAC Academy interest registration forms on this
                  website operate as frontend interface prototypes. Information entered into these
                  forms is validated on your device and provides immediate feedback. To submit
                  formal academic requests or official departmental correspondence, please contact
                  the student committee or department faculty directly through official university
                  communication channels.
                </p>
              </div>
            </Reveal>

            {/* 3. BROWSER STORAGE & PREFERENCES */}
            <Reveal delay={120}>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Section 3
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Local Browser Storage & Cookies
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The portal uses standard browser local storage strictly for client-side user
                  interface state (such as preserving dark or light mode display preferences). The
                  website does not employ third-party advertising cookies, cross-site trackers, or
                  commercial profiling scripts.
                </p>
              </div>
            </Reveal>

            {/* 4. EXTERNAL LINKS */}
            <Reveal delay={160}>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Section 4
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      External Links & University Portals
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  This site includes outbound hyperlinks to the official School of Engineering
                  portal (<code>soe.cusat.ac.in</code>), Cochin University admissions, official
                  social profiles (Instagram, LinkedIn), and embedded Google Maps for campus
                  navigation. These external platforms operate independently under their respective
                  terms and privacy policies.
                </p>
              </div>
            </Reveal>

            {/* 5. CONTACT & QUESTIONS */}
            <Reveal delay={200}>
              <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card to-gold/5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gold font-bold">
                      Section 5
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Questions & Contact
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  If you have questions, corrections, or inquiries regarding website information,
                  please contact the MESAC student association leads:
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:mesactechnical@gmail.com"
                    className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>mesactechnical@gmail.com</span>
                  </a>
                  <span className="text-muted-foreground">·</span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-gold transition"
                  >
                    <span>Visit Contact Directory</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
