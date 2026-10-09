import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { PageGearBackground } from "@/components/PageGearBackground";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { EmptyState } from "@/components/EmptyState";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import { mockPlacements, mockPlacementBrochure } from "@/data/mock";
import type { Placement } from "@/types";
import {
  Building2,
  Users,
  Search,
  FileText,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Layers,
  X,
  Sparkles,
  Calendar,
  Grid3X3,
  ListFilter,
} from "lucide-react";

export const Route = createFileRoute("/placements")({
  head: () => ({
    meta: [
      { title: "Placements & Recruitment Records — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Official placement records, recruiting companies, batchwise hires, and placement brochure for Division of Mechanical Engineering at School of Engineering, CUSAT.",
      },
      { property: "og:title", content: "Placements — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "Verified campus placement records and corporate recruits for CUSAT Mechanical Engineering students.",
      },
    ],
  }),
  component: PlacementsPage,
});

type ViewMode = "students" | "companies";

function PlacementsPage() {
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("students");

  // Derive unique batches that actually exist in the data
  const availableBatches = useMemo(() => {
    const batches = Array.from(new Set(mockPlacements.map((p) => p.academicYear))).sort((a, b) =>
      b.localeCompare(a),
    );
    return ["All", ...batches];
  }, []);

  // Derive unique categories/sectors
  const availableCategories = useMemo(() => {
    const cats = Array.from(
      new Set(mockPlacements.map((p) => p.category).filter(Boolean) as string[]),
    ).sort();
    return ["All", ...cats];
  }, []);

  // Filtered placements based on batch, category, and search query
  const filteredPlacements = useMemo(() => {
    return mockPlacements.filter((item) => {
      const matchesBatch = selectedBatch === "All" || item.academicYear === selectedBatch;
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (item.studentName && item.studentName.toLowerCase().includes(query)) ||
        item.company.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query));

      return matchesBatch && matchesCategory && matchesSearch;
    });
  }, [selectedBatch, selectedCategory, searchQuery]);

  // Group filtered placements by company
  const companyGroups = useMemo(() => {
    const map = new Map<string, Placement[]>();
    for (const item of filteredPlacements) {
      const list = map.get(item.company) || [];
      list.push(item);
      map.set(item.company, list);
    }

    return Array.from(map.entries())
      .map(([company, students]) => ({
        company,
        students,
        count: students.length,
        category: students[0]?.category,
      }))
      .sort((a, b) => b.count - a.count || a.company.localeCompare(b.company));
  }, [filteredPlacements]);

  // Summary statistics computed directly from verified source data
  const overallStats = useMemo(() => {
    const totalRecruits = mockPlacements.length;
    const uniqueCompanies = new Set(mockPlacements.map((p) => p.company)).size;
    const totalBatches = new Set(mockPlacements.map((p) => p.academicYear)).size;
    const coreHires = mockPlacements.filter(
      (p) => p.category === "Core Mechanical" || p.category === "Marine & Shipping",
    ).length;

    return {
      totalRecruits,
      uniqueCompanies,
      totalBatches,
      coreHires,
    };
  }, []);

  const hasActiveFilters =
    selectedBatch !== "All" || selectedCategory !== "All" || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedBatch("All");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <Layout>
      {/* 1. HERO HEADER */}
      <PageHero
        variant="placements"
        eyebrow="Career Milestones"
        title={
          <>
            CAMPUS <span className="italic text-gold">PLACEMENTS</span>
          </>
        }
        subtitle="Verified recruitment drives, batchwise corporate offers, and career achievements of Mechanical Engineering graduates at CUSAT."
      />

      {/* 2. VERIFIED PLACEMENT BROCHURE BANNER */}
      <section className="relative border-b border-border/80 bg-card/60 backdrop-blur-md py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-card via-card/90 to-primary/20 p-5 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30 shadow-inner">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold mb-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Official Publication</span>
                </div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  {mockPlacementBrochure.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {mockPlacementBrochure.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                href={mockPlacementBrochure.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl gradient-gold text-primary font-bold px-5 py-3 text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer min-h-[44px]"
              >
                <span>View Placement Brochure</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED PLACEMENT SUMMARY CARDS */}
      <section className="relative py-10 sm:py-12 bg-background border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Briefcase className="h-3.5 w-3.5 text-gold" />
                <span>Division Placement Records</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Recruitment Highlights in Numbers
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                Aggregated statistics derived directly from verified departmental placement offers.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 text-center shadow-sm card-lift flex flex-col items-center justify-center">
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-gold tracking-tight">
                  <Counter to={overallStats.totalRecruits} suffix="+" />
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-2">
                  Total Student Offers
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Documented across recorded batches
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 text-center shadow-sm card-lift flex flex-col items-center justify-center">
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-gold tracking-tight">
                  <Counter to={overallStats.uniqueCompanies} suffix="+" />
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-2">
                  Recruiting Organizations
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Core, marine, consulting & tech firms
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 text-center shadow-sm card-lift flex flex-col items-center justify-center">
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-gold tracking-tight">
                  <Counter to={overallStats.coreHires} suffix="+" />
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-2">
                  Core & Shipping Roles
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  L&T, Seven Islands, KSB, JSW & MRF
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 text-center shadow-sm card-lift flex flex-col items-center justify-center">
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-gold tracking-tight">
                  <Counter to={overallStats.totalBatches} />
                </div>
                <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-2">
                  Graduating Batches
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  2019-23 through 2022-26 tracked
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. CONTROLS, BATCH SELECTOR & FILTERS */}
      <StickyFilterBar className="border-b border-border bg-background/95 backdrop-blur-md shadow-sm py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-4">
          {/* Top row: Batch selector tabs and View switcher */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Batch Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 hidden sm:inline mr-1">
                Batch:
              </span>
              <div
                role="tablist"
                aria-label="Filter placements by batch"
                className="flex items-center gap-1.5 shrink-0"
              >
                {availableBatches.map((batch) => {
                  const isActive = selectedBatch === batch;
                  return (
                    <button
                      key={batch}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedBatch(batch)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer min-h-[38px] whitespace-nowrap inline-flex items-center justify-center ${
                        isActive
                          ? "gradient-gold text-primary shadow-sm"
                          : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {batch === "All" ? "All Batches" : `${batch} Batch`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Mode Switcher (By Student vs By Company) */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="inline-flex rounded-xl border border-border/80 bg-card p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("students")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer min-h-[34px] ${
                    viewMode === "students"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="View individual placed students"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                  <span>By Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("companies")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer min-h-[34px] ${
                    viewMode === "companies"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="View grouped by recruiting companies"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>By Company</span>
                </button>
              </div>

              <span className="text-xs font-semibold text-muted-foreground hidden md:inline shrink-0">
                {filteredPlacements.length} {filteredPlacements.length === 1 ? "Offer" : "Offers"}
              </span>
            </div>
          </div>

          {/* Bottom row: Search input & Category dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
              />
              <input
                type="text"
                aria-label="Search placements by student name or company"
                placeholder="Search student, company, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-card/70 pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none min-h-[40px] shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label="Clear search input"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category / Sector selector */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0 hidden lg:inline">
                Sector:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-150 cursor-pointer min-h-[34px] ${
                      selectedCategory === cat
                        ? "bg-secondary text-foreground font-bold border border-border"
                        : "border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-full border border-border/80 px-3 py-1 text-[11px] font-semibold text-gold hover:text-amber-300 hover:bg-secondary/60 transition cursor-pointer min-h-[34px] shrink-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </StickyFilterBar>

      {/* 5. PLACEMENTS LISTING SECTION */}
      <section className="sticky-content-container py-12 sm:py-16 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-secondary/15 pointer-events-none" />
        <PageGearBackground variant="placements" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {filteredPlacements.length > 0 ? (
            viewMode === "students" ? (
              /* VIEW MODE: STUDENT CARDS GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {filteredPlacements.map((item, idx) => (
                  <Reveal key={item.id} delay={(idx % 6) * 40}>
                    <div className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm card-lift flex flex-col justify-between hover:border-gold/40 transition-all">
                      <div>
                        {/* CARD HEADER: BADGES & METADATA */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            Batch {item.academicYear}
                          </span>
                          {item.category && (
                            <span className="text-[10px] uppercase font-bold text-gold/90 truncate max-w-[120px]">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* STUDENT AVATAR & NAME */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-2xl bg-secondary border border-border/80 flex items-center justify-center font-display font-black text-gold text-lg shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                            {item.studentName?.charAt(0) || "S"}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display text-sm sm:text-base font-bold text-foreground leading-snug truncate">
                              {item.studentName}
                            </h3>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 truncate">
                              <GraduationCap className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {item.degree || "B.Tech. Mechanical"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RECRUITER / COMPANY SECTION */}
                      <div className="mt-3 pt-3 border-t border-border/60">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                          Recruited by
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gold shrink-0" />
                          <div className="font-display text-xs sm:text-sm font-black text-foreground uppercase tracking-wide truncate">
                            {item.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              /* VIEW MODE: GROUPED BY COMPANY */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyGroups.map((group, idx) => (
                  <Reveal key={group.company} delay={(idx % 6) * 40}>
                    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm card-lift flex flex-col justify-between hover:border-gold/40 transition-all">
                      <div>
                        {/* COMPANY TITLE & OFFER COUNT */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border/80 text-gold shadow-inner">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-display text-base font-extrabold text-foreground tracking-tight leading-snug">
                                {group.company}
                              </h3>
                              {group.category && (
                                <div className="text-[11px] font-semibold text-muted-foreground">
                                  {group.category}
                                </div>
                              )}
                            </div>
                          </div>

                          <span className="rounded-full bg-gold/15 text-gold border border-gold/30 px-2.5 py-0.5 text-xs font-bold shrink-0">
                            {group.count} {group.count === 1 ? "Offer" : "Offers"}
                          </span>
                        </div>

                        {/* STUDENT NAMES LIST */}
                        <div className="mt-4 pt-3 border-t border-border/60">
                          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            <span>Placed Students</span>
                          </div>
                          <ul className="space-y-2">
                            {group.students.map((student) => (
                              <li
                                key={student.id}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-secondary/40 border border-border/40"
                              >
                                <span className="font-semibold text-foreground truncate mr-2">
                                  {student.studentName}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                                  {student.academicYear}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )
          ) : (
            /* EMPTY FILTER RESULT STATE */
            <EmptyState
              title={
                searchQuery
                  ? `No placement records matching "${searchQuery}"`
                  : `No records found for ${selectedBatch} Batch`
              }
              description="Try adjusting your search query, selecting another batch, or clearing the active filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
