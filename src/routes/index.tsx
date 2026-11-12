import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { NotificationBanner } from "@/components/NotificationBanner";
import { PageGearBackground } from "@/components/PageGearBackground";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/EmptyState";
import { mockEvents } from "@/data/mock/events";
import { mockFacultyAdvisors, mockCoreOfficers2026, DEFAULT_FACULTY_IMG } from "@/data/mock/team";
import { mockSiteSettings } from "@/data/mock/site";
import {
  FileText,
  Download,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Calendar,
  Users,
} from "lucide-react";

const hero = "/images/home/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MESAC CUSAT — Mechanical Engineering Students Association" },
      {
        name: "description",
        content:
          "The official student portal of Mechanical Engineering at CUSAT — downloading syllabus PDFs, event rulebooks, lab manuals, question papers, Yantra techfest updates and placements.",
      },
      { property: "og:title", content: "MESAC CUSAT — Engineering Reimagined" },
      {
        property: "og:description",
        content: "The official student platform of Mechanical Engineering at CUSAT.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.2,
      });
      gsap.from(".hero-sub", { y: 24, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });
      gsap.from(".hero-cta", {
        y: 16,
        opacity: 0,
        duration: 0.9,
        delay: 0.85,
        ease: "power3.out",
        stagger: 0.08,
      });
      gsap.from(".hero-orb", {
        scale: 0.6,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.1,
      });

      const onMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(bgRef.current, { x, y, duration: 1.2, ease: "power2.out" });
      };
      const onScroll = () => {
        const s = window.scrollY;
        gsap.to(".hero-image", { yPercent: s * 0.04, duration: 0.4, ease: "none" });
        gsap.to(".hero-copy", {
          yPercent: s * 0.02,
          opacity: Math.max(0, 1 - s / 600),
          duration: 0.4,
          ease: "none",
        });
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
      };
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Filter top 3 featured events from typed mock data
  const featuredEvents = mockEvents.filter((e) => e.isFeatured).slice(0, 3);

  // Committee preview from typed mock data (Faculty Advisor, President, Secretary)
  const previewTeamMembers = [
    {
      role: "FACULTY ADVISOR",
      img: mockFacultyAdvisors[0]?.img || DEFAULT_FACULTY_IMG,
      name: mockFacultyAdvisors[0]?.name || "Dr. BIJU N",
    },
    {
      role: "PRESIDENT",
      img: mockCoreOfficers2026[0]?.img || "https://cdn.corenexis.com/f/iLLZmB21xPv.png",
      name: mockCoreOfficers2026[0]?.name || "JAANAKY RENGITH",
    },
    {
      role: "SECRETARY",
      img: mockCoreOfficers2026[1]?.img || "https://cdn.corenexis.com/f/3pxBon39P0D.png",
      name: mockCoreOfficers2026[1]?.name || "KALIDASAN V R",
    },
  ];

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] w-full overflow-hidden text-white flex flex-col justify-center items-center py-20 sm:py-24"
      >
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          <img
            src={hero}
            alt="MESAC CUSAT Mechanical Building"
            className="hero-image absolute inset-0 h-[115%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.85)_60%,#000000_100%)]" />
        </div>

        <PageGearBackground variant="home" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center items-center px-4 sm:px-6 text-center my-auto">
          <div className="hero-copy flex flex-col items-center">
            {/* OFFICIAL MESAC LOGO EMBLEM */}
            <div className="mb-4 sm:mb-6 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-full bg-gold/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full p-2 bg-white shadow-2xl border-2 border-white/40 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/mesac-real-logo.png"
                    alt="Official MESAC Logo — Mechanical Engineering Students Association of CUSAT"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/mesac-logo-real.png";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              School of Engineering · CUSAT
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-center max-w-5xl mx-auto font-extrabold text-white leading-[1.12] uppercase">
              <span className="block overflow-hidden">
                <span className="hero-line inline-block">MECHANICAL ENGINEERING</span>
              </span>
              <span className="block overflow-hidden mt-1">
                <span className="hero-line inline-block">STUDENTS ASSOCIATION OF CUSAT</span>
              </span>
              <span className="block overflow-hidden mt-1">
                <span className="hero-line inline-block text-gold">(MESAC)</span>
              </span>
            </h1>

            <p className="hero-sub mt-5 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-normal px-2">
              Official Student Body of the Division of Mechanical Engineering at Cochin University
              of Science and Technology.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link
                to="/archive"
                className="hero-cta group inline-flex items-center justify-center gap-2 rounded-xl gradient-gold text-primary px-6 py-3.5 text-xs sm:text-sm font-bold shadow-glass hover:brightness-105 active:scale-95 transition-all w-full sm:w-auto min-h-[44px]"
              >
                <FileText className="h-4 w-4" />
                <span>Explore Academic Archive</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/events"
                className="hero-cta inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 backdrop-blur-md active:scale-95 transition-all w-full sm:w-auto min-h-[44px]"
              >
                Yantra Techfest & Events
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-white/50 select-none">
          Scroll Down
        </div>
      </section>

      {/* 2. REUSABLE ANNOUNCEMENT BANNER */}
      <NotificationBanner config={mockSiteSettings.announcement} />

      {/* 3. ABOUT MESAC PREVIEW */}
      <section className="relative py-16 sm:py-20 bg-background border-b border-border/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            {/* GROUP PHOTO IMAGE FRAME */}
            <div className="relative mb-10 sm:mb-12 overflow-hidden rounded-2xl border border-border bg-card shadow-lg group">
              <img
                src="/images/home/hero.jpg"
                alt="MESAC Committee & Members Group Photo"
                loading="lazy"
                className="w-full h-auto max-h-[520px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow flex items-center justify-between">
                <span>
                  MESAC Committee & Executive Members · Division of Mechanical Engineering, CUSAT
                </span>
              </div>
            </div>

            {/* ABOUT US TEXT */}
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide text-foreground inline-block border-b-2 border-foreground pb-1 mb-6">
                ABOUT US
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-normal text-justify sm:text-center">
                The intention of MESAC is to provide a platform for the students of Mechanical
                Engineering Department by organizing various Technical Seminars, Workshops, Events
                and Competitions. This helps the students to explore and hone their technical and
                creative skills through such co-curricular and extracurricular activities. MESAC
                committee is formed by the current students who are elected by the faculty
                coordinators and students at the general body meeting. This committee handles the
                activities conducted by MESAC. This helps the students to learn a lot about
                importance of team work, team spirit, handling responsibilites and leadership
                qualities.
              </p>
              <div className="mt-8">
                <Link
                  to="/about-mesac"
                  className="inline-flex items-center justify-center rounded-xl bg-foreground text-background px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition shadow-sm min-h-[44px]"
                >
                  Read more
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. FEATURED EVENTS SECTION */}
      <section className="py-16 sm:py-20 bg-secondary/30 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Flagship Programs</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  Featured Events & Workshops
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl">
                  Recent technical workshops, industrial symposiums, and student orientation
                  sessions conducted by MESAC.
                </p>
              </div>

              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gold hover:text-gold/80 transition-colors self-start sm:self-end min-h-[44px]"
              >
                <span>View All Events</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {featuredEvents.length > 0 ? (
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((evt, idx) => (
                  <Reveal key={evt.id} delay={idx * 60}>
                    <EventCard eventItem={evt} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No featured events available"
                description="Upcoming events will be announced shortly. Check our complete calendar for past programs."
                actionText="Explore All Events"
                onAction={() => {}}
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* 6. RESOURCE & DOWNLOADS HUB HIGHLIGHT */}
      <section className="py-16 sm:py-20 bg-background border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="rounded-[2.5rem] border border-border bg-card p-6 sm:p-10 md:p-12 shadow-lift">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1 text-xs font-bold text-gold uppercase tracking-wider mb-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Academic Resource Archive</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-5xl leading-tight text-foreground">
                    All CUSAT Mechanical PDFs <br />
                    <span className="italic text-gold">in one place.</span>
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    Access official B.Tech & M.Tech syllabus schemes, lab manuals, semester question
                    papers, Yantra event rulebooks, department magazines, and placement brochures.
                  </p>
                </div>

                <Link
                  to="/archive"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl gradient-gold text-primary font-bold px-6 sm:px-8 py-3.5 text-xs sm:text-sm shadow-glass hover:brightness-105 active:scale-95 transition-all shrink-0 min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  <span>Open Academic Archive</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 sm:pt-8 border-t border-border">
                {[
                  {
                    title: "B.Tech & M.Tech Syllabus",
                    icon: BookOpen,
                    desc: "2023 Scheme & Subject Credits",
                  },
                  {
                    title: "Lab Manuals & Guides",
                    icon: ShieldCheck,
                    desc: "CNC, Fluid Mechanics & Heat Transfer",
                  },
                  {
                    title: "Previous Question Papers",
                    icon: FileText,
                    desc: "S1 to S8 End-Semester Archives",
                  },
                  {
                    title: "Event & Yantra Rulebooks",
                    icon: Sparkles,
                    desc: "RoboWars & CAD Marathon Rules",
                  },
                ].map((res) => {
                  const Icon = res.icon;
                  return (
                    <div
                      key={res.title}
                      className="rounded-2xl border border-border/80 bg-background/80 p-4 sm:p-5"
                    >
                      <Icon className="h-5 w-5 text-gold mb-2" aria-hidden="true" />
                      <div className="font-semibold text-sm text-foreground">{res.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{res.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. THE TEAM PREVIEW */}
      <section className="relative bg-black text-white">
        <div className="w-full bg-neutral-950/90 py-4 text-center border-y border-white/10 shadow-sm">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-white">
            THE TEAM
          </h2>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
            {previewTeamMembers.map((m, i) => (
              <Reveal key={m.name + i} delay={i * 80}>
                <div className="flex flex-col items-center">
                  <h3 className="mb-4 font-display text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400">
                    {m.role}
                  </h3>
                  <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-xl group">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                    {m.name}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/team"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest transition shadow-sm min-h-[44px]"
            >
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] gradient-hero p-8 sm:p-12 md:p-16 text-white shadow-lift">
              <div className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full blur-3xl bg-[oklch(0.75_0.15_78/0.4)] animate-float-alt" />
              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl leading-[1.08]">
                  Ready to build with CUSAT Mechanical?
                </h2>
                <p className="mt-4 max-w-xl text-white/75 text-sm sm:text-base md:text-lg leading-relaxed">
                  Connect with the MESAC committee for event sponsorships, alumni workshops, or
                  student inquiries.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    to="/archive"
                    className="rounded-xl gradient-gold text-primary font-bold px-6 py-3.5 text-xs sm:text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all text-center min-h-[44px] flex items-center justify-center"
                  >
                    Explore Academic Archive
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm text-white backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all text-center min-h-[44px] flex items-center justify-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
