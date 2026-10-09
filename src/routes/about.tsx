import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import {
  Target,
  Award,
  UserCheck,
  ShieldCheck,
  Users,
  Info,
  ArrowRight,
  BookOpen,
  Wrench,
  GraduationCap,
  Sparkles,
  Building2,
} from "lucide-react";
import { mockDepartmentOverview } from "@/data/mock/department";

const ABOUT_HERO_BG = "https://cdn.corenexis.com/f/3X8Antm4WLq.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MESAC — CUSAT Mechanical Association" },
      {
        name: "description",
        content:
          "The Mechanical Engineering Students Association of CUSAT (MESAC) is a registered student society established in July 2005 at the School of Engineering, CUSAT.",
      },
      { property: "og:title", content: "About MESAC — CUSAT" },
      {
        property: "og:description",
        content:
          "History, objectives, faculty patron, activities, and connection with the Division of Mechanical Engineering, CUSAT.",
      },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  const objectives = [
    "To unite Mechanical engineering students together for the development of their physical, social, intellectual, mental and spiritual manhood and to inspire with them students' community ideals.",
    "To foster and develop programs with view to promote educational, mental, moral and social advancement of students.",
    "To impart skills suitable for various avenues of employment.",
    "To train the students to acquire leadership qualities, to do all services to the community and put effective instruments for sustaining high moral, social and educational values.",
    "To affiliate and manage institutions having objects similar to that of this society.",
  ];

  const activities = [
    {
      title: "Technical Workshops & Hands-on Labs",
      description:
        "Industrial immersion sessions including Daikin HVAC systems, ANSYS FEA/CFD, CNC milling, and 3D printing masterclasses.",
      icon: Wrench,
    },
    {
      title: "Academic Resource Hub & Question Banks",
      description:
        "Comprehensive curation of CUSAT B.Tech & M.Tech syllabus schemes, previous semester question papers, and lab manuals.",
      icon: BookOpen,
    },
    {
      title: "Technical Symposiums & Yantra Techfest",
      description:
        "Flagship student techfest events, robotics challenges (Robowars), design competitions, and technical paper presentations.",
      icon: Sparkles,
    },
    {
      title: "Career Mentorship & Core Placement Drives",
      description:
        "Alumni guidance, resume architecture workshops, technical interview preparation, and core company placement orientations.",
      icon: GraduationCap,
    },
  ];

  return (
    <Layout>
      <PageHero
        variant="team"
        bgImage={ABOUT_HERO_BG}
        eyebrow="Registered Student Association Since 2005"
        title={
          <>
            About <span className="text-gold italic font-serif">MESAC</span>
          </>
        }
        subtitle="Mechanical Engineering Students Association of CUSAT — formally inaugurated on 8th August 2005 by Dr. N.D. Inasu, Pro-Vice Chancellor of CUSAT."
      />

      {/* SUB-NAVIGATION TABS */}
      <StickyFilterBar
        aria-label="About section tabs"
        className="bg-card/95 dark:bg-neutral-950/95 border-b border-border py-4 px-4 backdrop-blur-md shadow-sm"
      >
        <div className="mx-auto max-w-md flex items-center justify-center gap-3">
          <Link
            to="/about"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-primary gradient-gold shadow-sm transition"
          >
            <Info className="h-3.5 w-3.5" />
            <span>About Association</span>
          </Link>
          <Link
            to="/team"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground bg-secondary/60 border border-border/80 hover:bg-secondary transition"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Executive Committee</span>
          </Link>
        </div>
      </StickyFilterBar>

      <section className="sticky-content-container py-16 sm:py-20 bg-background text-foreground relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-16">
          {/* SECTION 1: MAIN ABOUT & HISTORY */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 md:p-12 shadow-lift relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="shrink-0 flex items-center justify-center">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-white p-3 shadow-xl border border-border flex items-center justify-center">
                  <img
                    src="/mesac-real-logo.png"
                    alt="Official MESAC Emblem"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/mesac-logo-real.png";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>History & Establishment</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Empowering Mechanical Engineers at CUSAT
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The Mechanical Engineering Students Association of CUSAT (MESAC) is a registered
                  association established in <strong className="text-foreground">July 2005</strong>.
                  Since its inception, MESAC has functioned as the primary student platform for the
                  Division of Mechanical Engineering, fostering academic excellence, technical
                  creativity, and leadership.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The association was formally inaugurated by{" "}
                  <strong className="text-gold">Dr. N.D. Inasu</strong>, Pro-Vice Chancellor of
                  CUSAT, on <strong className="text-foreground">8th August 2005</strong>.
                </p>
              </div>
            </div>
          </Reveal>

          {/* SECTION 2: OFFICIAL OBJECTIVES */}
          <div>
            <Reveal delay={60}>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lift space-y-6">
                <div className="space-y-2 border-b border-border/80 pb-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gold">
                    <Target className="h-4 w-4" />
                    <span>Constitutional Objectives</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Core Mandate of the Association
                  </h2>
                </div>

                <ul className="space-y-4">
                  {objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3.5 text-muted-foreground text-sm sm:text-base leading-relaxed"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-gold shrink-0 shadow-[0_0_8px_#f59e0b]" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* SECTION 3: KEY ACTIVITIES */}
          <div>
            <Reveal delay={100}>
              <div className="space-y-6">
                <div className="space-y-2 border-b border-border/80 pb-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gold">
                    <Wrench className="h-4 w-4" />
                    <span>Student Programs & Initiatives</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    What We Do at MESAC
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {activities.map((act, i) => {
                    const IconComp = act.icon;
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-border bg-secondary/30 p-6 space-y-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold grid place-items-center">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {act.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* SECTION 4: CONNECTION WITH MECHANICAL DEPARTMENT */}
          <div>
            <Reveal delay={140}>
              <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 shadow-lift space-y-6">
                <div className="space-y-2 border-b border-border/80 pb-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gold">
                    <Building2 className="h-4 w-4" />
                    <span>Departmental Connection</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Division of Mechanical Engineering, CUSAT
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  MESAC operates under the guidance and patronage of the Division of Mechanical
                  Engineering, established in 1995 as the largest division in the School of
                  Engineering. The student association works in direct synergy with faculty mentors
                  and lab divisions to facilitate hands-on learning outside standard classroom
                  hours.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold">
                      Division Mission
                    </span>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {mockDepartmentOverview.mission[0]}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold">
                      Division Vision
                    </span>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {mockDepartmentOverview.vision}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/mechanical-dept"
                    className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline"
                  >
                    <span>Explore Department Overview, Programs & Laboratories</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* SECTION 5: FACULTY PATRON & COORDINATOR */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal delay={180}>
              <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-6 sm:p-8 shadow-lift relative overflow-hidden group hover:border-gold/60 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gold font-bold">
                      Patron
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Dr. P.S. Sreejith
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                  Associate Professor, Division of Mechanical Engineering, School of Engineering,
                  CUSAT
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 p-6 sm:p-8 shadow-lift relative overflow-hidden group hover:border-gold/40 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gold font-bold">
                      Coordinator & Head of Division
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">Dr. Biju N</h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                  Professor & Head of Division, Mechanical Engineering, School of Engineering, CUSAT
                </p>
              </div>
            </Reveal>
          </div>

          {/* SECTION 6: EXECUTIVE COMMITTEE CTA */}
          <div className="pt-4">
            <Reveal delay={260}>
              <Link
                to="/team"
                className="group flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-gold/30 bg-gradient-to-r from-gold/10 via-card to-gold/5 p-6 sm:p-10 shadow-lift hover:border-gold/60 transition-all"
              >
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="h-14 w-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shrink-0">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                      STUDENT LEADERSHIP & ARCHIVE
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-gold transition-colors">
                      Meet the Executive Committee
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Browse current office bearers and previous committees by academic year.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary px-6 py-3 text-xs font-bold uppercase tracking-wider group-hover:brightness-105 transition shrink-0 min-h-[40px]">
                  <span>View Team</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
