import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import {
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Users,
  Sparkles,
  BookOpen,
  User,
  Info,
  Calendar,
  Search,
  SlidersHorizontal,
  GraduationCap,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";
import {
  mockFacultyAdvisors,
  mockCoreOfficers2026,
  mockDepartmentHeads2026,
  DEFAULT_GROUP_BANNER,
  getCurrentAcademicCommittee,
  getPastCommittees,
  CURRENT_ACADEMIC_YEAR,
} from "@/data/mock/team";
import type { TeamMember, FacultyMember, AcademicYear, HistoricalOfficer } from "@/types";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Executive Committee & Team — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Meet the MESAC committee — the student leaders and faculty advisors running the Mechanical Engineering Students Association at CUSAT.",
      },
      { property: "og:title", content: "Team — MESAC CUSAT" },
      { property: "og:description", content: "The MESAC executive committee at CUSAT." },
    ],
  }),
  component: TeamPage,
});

/**
 * Robust photo card for an active committee member with fallback when
 * images are unavailable or fail to load.
 */
function MemberPhotoCard({
  member,
  highlightTier = false,
}: {
  member: TeamMember;
  highlightTier?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !member.img || imgError;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-card border border-border card-lift flex flex-col h-full transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:shadow-black/40">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex flex-col justify-end p-4">
        {!showFallback ? (
          <img
            src={member.img}
            alt={member.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-tr from-amber-500/20 via-gold/30 to-amber-300/10 border border-gold/40 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform duration-500">
              <User className="h-10 w-10 sm:h-12 sm:w-12 text-gold/80" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gold/80 font-mono font-semibold">
              MESAC {member.academicYear}
            </span>
          </div>
        )}

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

        {/* Member Details */}
        <div className="relative z-10 text-white">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span
              className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border backdrop-blur-sm ${
                highlightTier
                  ? "bg-gold/20 text-gold border-gold/40 shadow-sm shadow-gold/20"
                  : "bg-black/75 text-gold border-gold/20"
              }`}
            >
              {member.role}
            </span>
            {member.tier === "core" && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-300 bg-white/10 px-1.5 py-0.5 rounded">
                Core
              </span>
            )}
          </div>
          <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow">
            {member.name}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
            Term {member.academicYear}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Faculty Advisor Spotlight Card
 */
function FacultyAdvisorCard({ advisor }: { advisor: FacultyMember }) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !advisor.img || imgError;

  return (
    <div className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-card border border-gold/30 bg-gradient-to-br from-card via-card to-amber-950/20 card-lift shadow-2xl shadow-black/50">
      <div className="relative aspect-[4/5] md:w-64 shrink-0 overflow-hidden bg-neutral-900">
        {!showFallback ? (
          <img
            src={advisor.img}
            alt={advisor.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-neutral-900 to-black">
            <GraduationCap className="h-16 w-16 text-gold/70 mb-2" />
            <span className="text-xs font-mono text-gold/60 uppercase tracking-widest">
              Faculty Advisor
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:from-transparent md:to-transparent pointer-events-none" />
      </div>

      <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold mb-2">
          <ShieldCheck className="h-4 w-4" />
          <span>{advisor.role}</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {advisor.name}
        </h3>
        <p className="text-sm sm:text-base font-medium text-neutral-200 mt-2">
          {advisor.designation}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{advisor.department}</p>
        {advisor.qualification && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
              Credentials:
            </span>
            <span className="text-xs font-semibold text-gold/90 font-mono">
              {advisor.qualification}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamPage() {
  // Dynamically derived academic year data
  const currentCommittee = useMemo(() => getCurrentAcademicCommittee(), []);
  const pastCommittees = useMemo(() => getPastCommittees(), []);

  // Archive UI Controls
  const [selectedYear, setSelectedYear] = useState<string>("2025-26");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    "2025-26": true,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleAccordion = (year: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const expandAllAccordions = () => {
    const allExpanded: Record<string, boolean> = {};
    pastCommittees.forEach((c) => {
      allExpanded[c.year] = true;
    });
    setOpenAccordions(allExpanded);
  };

  const collapseAllAccordions = () => {
    setOpenAccordions({});
  };

  // Archive search filtering across historical records
  const filteredArchiveResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;

    const matches: Array<{
      year: string;
      advisor: string;
      officer: HistoricalOfficer;
      category: "core" | "members";
    }> = [];

    pastCommittees.forEach((comm) => {
      comm.core.forEach((officer) => {
        if (
          officer.name.toLowerCase().includes(query) ||
          officer.role.toLowerCase().includes(query)
        ) {
          matches.push({
            year: comm.year,
            advisor: comm.advisor,
            officer,
            category: "core",
          });
        }
      });
      if (comm.members) {
        comm.members.forEach((member) => {
          if (
            member.name.toLowerCase().includes(query) ||
            member.role.toLowerCase().includes(query)
          ) {
            matches.push({
              year: comm.year,
              advisor: comm.advisor,
              officer: member,
              category: "members",
            });
          }
        });
      }
    });

    return matches;
  }, [searchQuery, pastCommittees]);

  const activeArchiveCommittee = useMemo(() => {
    return pastCommittees.find((c) => c.year === selectedYear) || pastCommittees[0];
  }, [pastCommittees, selectedYear]);

  return (
    <Layout>
      <PageHero
        variant="team"
        eyebrow="Leadership & Administration"
        title={
          <>
            THE <span className="italic text-gold">TEAM</span>
          </>
        }
        subtitle="School of Engineering, Cochin University of Science and Technology (CUSAT)"
      />

      {/* SUB-NAVIGATION TABS */}
      <StickyFilterBar className="bg-black/95 border-b border-white/10 py-4 px-4 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-md flex items-center justify-center gap-3">
          <Link
            to="/about-mesac"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white/70 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition"
          >
            <Info className="h-3.5 w-3.5" />
            <span>About Association</span>
          </Link>
          <Link
            to="/about-mesac/team"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/25 transition"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Executive Committee</span>
          </Link>
        </div>
      </StickyFilterBar>

      {/* OBJECTIVE TEXT & ACTIVE TERM SUMMARY */}
      <section className="sticky-content-container bg-black py-12 px-6 border-b border-white/10 text-white text-center">
        <div className="mx-auto max-w-4xl space-y-4">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300 font-normal">
            The objective of MESAC is to provide a platform for the students of Mechanical
            Engineering Department by organizing various Technical Seminars, Workshops, Events and
            Competitions. This helps the students to explore and hone their technical and creative
            skills through such co-curricular and extracurricular activities.
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300 font-normal">
            MESAC committee is formed by the current students who are elected by the faculty
            coordinators and students at the general body meeting. This committee handles the
            activities conducted by MESAC.
          </p>

          {/* ACTIVE TERM STATS PILLS */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 px-4 py-1.5 text-gold font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span>Active Term: {currentCommittee.year}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-neutral-300">
              <Award className="h-3.5 w-3.5 text-gold" />
              <span>{mockCoreOfficers2026.length} Core Officers</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-neutral-300">
              <Users className="h-3.5 w-3.5 text-gold" />
              <span>{mockDepartmentHeads2026.length} Division Heads</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-20">
          {/* GROUP PHOTO BANNER */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl group">
              <img
                src={DEFAULT_GROUP_BANNER}
                alt="MESAC Committee & Members Group Photo"
                className="w-full h-auto max-h-[600px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-widest text-gold font-extrabold mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>General Body & Executive Council</span>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold">
                  MESAC Committee & Executive Members ({currentCommittee.year})
                </div>
                <p className="text-xs sm:text-sm text-white/80 mt-1">
                  School of Engineering, Cochin University of Science and Technology (CUSAT)
                </p>
              </div>
            </div>
          </Reveal>

          {/* FACULTY ADVISOR */}
          <div>
            <Reveal>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                <ShieldCheck className="h-4 w-4" />
                <span>Faculty Direction</span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl text-white">
                Faculty Advisor.
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Guiding MESAC initiatives and academic excellence across the department.
              </p>
            </Reveal>

            <div className="mt-8 max-w-3xl">
              {mockFacultyAdvisors.map((advisor) => (
                <Reveal key={advisor.id}>
                  <FacultyAdvisorCard advisor={advisor} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* CURRENT COMMITTEE SECTION (VISUALLY EMPHASIZED) */}
          <div className="relative rounded-3xl border border-gold/30 bg-gradient-to-b from-amber-950/15 via-black to-black p-6 sm:p-10 shadow-2xl">
            {/* Visual Accent Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                  <Award className="h-4 w-4 text-gold" />
                  <span>Current Executive Leadership</span>
                </div>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl text-white">
                  MESAC COMMITTEE {currentCommittee.year}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Elected student representatives for the {currentCommittee.year} academic term.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/40 px-4 py-2 text-gold text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold/10">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <span>Active Executive Committee</span>
              </div>
            </div>

            {/* CORE OFFICERS GRID */}
            <div>
              <Reveal>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  <span>Core Executive Council</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-6">
                  Principal Officers
                </h3>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mockCoreOfficers2026.map((m, i) => (
                  <Reveal key={m.id} delay={i * 40}>
                    <MemberPhotoCard member={m} highlightTier={true} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* DEPARTMENT HEADS & COORDINATORS */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <Reveal>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold mb-2">
                  <Users className="h-4 w-4 text-gold" />
                  <span>Division Coordinators</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">
                  Department Heads & Leads ({currentCommittee.year})
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Spearheading technical events, marketing, editorial publications, academics, PR,
                  and creative media.
                </p>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mockDepartmentHeads2026.map((d, i) => (
                  <Reveal key={d.id} delay={i * 30}>
                    <MemberPhotoCard member={d} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* PREVIOUS COMMITTEES ARCHIVE SECTION (ORGANIZED BY ACADEMIC YEAR) */}
          <div className="pt-10 border-t border-border">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                    <BookOpen className="h-4 w-4" />
                    <span>Historical Archive</span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl text-white">
                    Previous MESAC Committees
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                    Browse historical committees organized by academic session. Honoring the
                    dedicated student leaders who served MESAC across past terms at SOE CUSAT.
                  </p>
                </div>

                {/* Quick Search across historical records */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search past leaders or roles..."
                    className="w-full pl-10 pr-9 py-2 rounded-xl bg-card border border-border text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-gold transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Reveal>

            {/* ARCHIVE SEARCH RESULTS VIEW (WHEN SEARCHING) */}
            {filteredArchiveResults ? (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">
                    Search Results for &ldquo;{searchQuery}&rdquo; ({filteredArchiveResults.length}{" "}
                    {filteredArchiveResults.length === 1 ? "match" : "matches"})
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-gold hover:underline font-mono"
                  >
                    Clear Filter
                  </button>
                </div>

                {filteredArchiveResults.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No historical committee members found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {filteredArchiveResults.map((item, idx) => (
                      <div
                        key={`${item.year}-${item.officer.name}-${idx}`}
                        className="rounded-xl border border-border/60 bg-neutral-900/60 p-4 hover:border-gold/30 transition"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                            {item.officer.role}
                          </span>
                          <span className="font-mono text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                            {item.year}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-white">{item.officer.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          Advisor: {item.advisor}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* STANDARD ARCHIVE BROWSING WITH YEAR SELECTION UX */
              <div className="space-y-8">
                {/* YEAR SELECTION CONTROLS (PILL TABS & MOBILE SELECT) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/60 border border-border p-3 rounded-2xl backdrop-blur-sm">
                  {/* Segmented Year Pills (Desktop / Tablet) */}
                  <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {pastCommittees.map((comm) => {
                      const isActive = selectedYear === comm.year;
                      return (
                        <button
                          key={comm.id}
                          type="button"
                          onClick={() => setSelectedYear(comm.year)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                            isActive
                              ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {comm.year}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setSelectedYear("all")}
                      className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                        selectedYear === "all"
                          ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Years Timeline
                    </button>
                  </div>

                  {/* Mobile Select Dropdown */}
                  <div className="sm:hidden flex items-center gap-2">
                    <label htmlFor="year-select" className="text-xs font-bold text-gold uppercase">
                      Academic Year:
                    </label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="flex-1 rounded-xl bg-neutral-900 border border-border px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      {pastCommittees.map((comm) => (
                        <option key={comm.id} value={comm.year}>
                          {comm.year} Committee
                        </option>
                      ))}
                      <option value="all">All Years (Timeline View)</option>
                    </select>
                  </div>

                  {/* Accordion Expand/Collapse Controls for Timeline Mode */}
                  {selectedYear === "all" && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={expandAllAccordions}
                        className="text-[11px] font-semibold text-gold/80 hover:text-gold px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
                      >
                        Expand All
                      </button>
                      <span className="text-white/20">|</span>
                      <button
                        type="button"
                        onClick={collapseAllAccordions}
                        className="text-[11px] font-semibold text-white/60 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
                      >
                        Collapse All
                      </button>
                    </div>
                  )}
                </div>

                {/* VIEW 1: DEDICATED SELECTED YEAR SHOWCASE (WHEN A SPECIFIC YEAR IS ACTIVE) */}
                {selectedYear !== "all" && activeArchiveCommittee && (
                  <div className="rounded-3xl border border-border bg-card/80 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold mb-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Academic Session {activeArchiveCommittee.year}</span>
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                          MESAC Executive Committee ({activeArchiveCommittee.year})
                        </h3>
                        <div className="mt-2 text-xs font-mono text-gold/90 bg-black/40 border border-gold/20 inline-block px-3 py-1 rounded-lg">
                          Faculty Direction: {activeArchiveCommittee.advisor}
                        </div>
                      </div>

                      {/* Switch to Previous/Next year helpers */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-xs text-muted-foreground mr-1">Other Terms:</span>
                        {pastCommittees
                          .filter((c) => c.year !== selectedYear)
                          .slice(0, 3)
                          .map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedYear(c.year)}
                              className="text-xs font-mono text-white/70 hover:text-gold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition"
                            >
                              {c.year}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Core Officers for the Selected Year */}
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                        <Award className="h-3.5 w-3.5 text-gold" />
                        <span>Core Officers</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {activeArchiveCommittee.core.map((officer) => (
                          <div
                            key={officer.role}
                            className="rounded-2xl border border-border/60 bg-neutral-900/50 p-4 hover:border-gold/30 transition card-lift"
                          >
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                              {officer.role}
                            </span>
                            <span className="font-bold text-base text-white mt-0.5 block">
                              {officer.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Department Heads for Selected Year (if present) */}
                    {activeArchiveCommittee.members &&
                      activeArchiveCommittee.members.length > 0 && (
                        <div className="pt-6 border-t border-border/60">
                          <div className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-gold" />
                            <span>Department & Activity Leads</span>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {activeArchiveCommittee.members.map((member) => (
                              <div
                                key={member.role}
                                className="rounded-2xl border border-border/60 bg-neutral-900/50 p-4 hover:border-gold/30 transition card-lift"
                              >
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                                  {member.role}
                                </span>
                                <span className="font-medium text-sm text-white mt-0.5 block">
                                  {member.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* VIEW 2: COMPLETE CHRONOLOGICAL ACCORDION TIMELINE */}
                {selectedYear === "all" && (
                  <div className="space-y-4">
                    {pastCommittees.map((comm) => {
                      const isOpen = !!openAccordions[comm.year];
                      return (
                        <div
                          key={comm.id}
                          className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300"
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleAccordion(comm.year)}
                            className="flex w-full items-center justify-between p-5 sm:p-6 text-left hover:bg-neutral-900/60 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="font-display text-xl sm:text-2xl font-bold text-gold">
                                {comm.year}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Executive Committee ({comm.core.length} Core Officers)
                              </span>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gold" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="border-t border-border/50 p-6 bg-black/30 space-y-6">
                              <div className="text-xs font-mono text-gold/80 tracking-wider">
                                Faculty Advisor: {comm.advisor}
                              </div>

                              <div>
                                <div className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-3">
                                  Core Officers
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                  {comm.core.map((officer) => (
                                    <div
                                      key={officer.role}
                                      className="rounded-xl border border-border/40 bg-card/60 p-3"
                                    >
                                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                                        {officer.role}
                                      </span>
                                      <span className="font-medium text-sm text-white">
                                        {officer.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {comm.members && comm.members.length > 0 && (
                                <div>
                                  <div className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-3">
                                    Department & Activity Leads
                                  </div>
                                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {comm.members.map((member) => (
                                      <div
                                        key={member.role}
                                        className="rounded-xl border border-border/40 bg-card/60 p-3"
                                      >
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                                          {member.role}
                                        </span>
                                        <span className="font-medium text-sm text-white">
                                          {member.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
