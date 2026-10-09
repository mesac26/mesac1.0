import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { PageGearBackground } from "@/components/PageGearBackground";
import { EmptyState } from "@/components/EmptyState";
import { AchievementCard } from "@/components/AchievementCard";
import { AchievementDetailModal } from "@/components/AchievementDetailModal";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import { Trophy, Sparkles, ChevronRight, Search, X, Filter, Calendar, Layers } from "lucide-react";
import { mockAchievements } from "@/data/mock/achievements";
import type { Achievement } from "@/types";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "National & International Achievements — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Major competition wins and awards by CUSAT Mechanical Engineering student teams in Formula Bharat, SAE h-BAJA, ISDC, Solar Challenge, and European Rover Challenge.",
      },
      { property: "og:title", content: "Achievements — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "What our student engineering teams have won on national & global stages at SOE CUSAT.",
      },
    ],
  }),
  component: AchievementsPage,
});

export function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Derive available categories dynamically from existing data
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    mockAchievements.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return ["All", ...Array.from(cats)];
  }, []);

  // Derive available years dynamically from existing data
  const availableYears = useMemo(() => {
    const yrs = new Set<string>();
    mockAchievements.forEach((a) => {
      if (a.year) yrs.add(a.year);
    });
    return ["All", ...Array.from(yrs)];
  }, []);

  // Filter achievements by category, year, and search keywords
  const filteredAchievements = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return mockAchievements.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesYear = selectedYear === "All" || item.year === selectedYear;

      if (!matchesCategory || !matchesYear) return false;

      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const teamMatch = item.teamOrStudent.toLowerCase().includes(q);
      const eventMatch = item.eventOrCompetition
        ? item.eventOrCompetition.toLowerCase().includes(q)
        : false;
      const rankMatch = item.rank ? item.rank.toLowerCase().includes(q) : false;
      const bulletMatch = item.bullets
        ? item.bullets.some((b) => b.toLowerCase().includes(q))
        : false;

      return titleMatch || teamMatch || eventMatch || rankMatch || bulletMatch;
    });
  }, [selectedCategory, selectedYear, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedYear("All");
    setSearchQuery("");
  };

  const isFiltered =
    selectedCategory !== "All" || selectedYear !== "All" || searchQuery.trim().length > 0;

  return (
    <Layout>
      {/* HERO SECTION IN FULL BLACK CANVAS */}
      <section className="relative bg-black pt-28 pb-16 sm:pb-20 text-white overflow-hidden border-b border-white/10">
        <PageGearBackground variant="achievements" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* BACKGROUND WATERMARK TROPHY */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Trophy className="h-[500px] w-[500px] text-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>National & Global Recognition</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-wider text-white">
            ACHIEVEMENTS
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Celebrating technical excellence, competitive victories, and groundbreaking research
            built by student engineers at Division of Mechanical Engineering, CUSAT.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/placements"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-neutral-950 hover:bg-neutral-200 transition shadow-md min-h-[44px]"
            >
              <span>View Placements Records</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH CONTROL BAR */}
      <StickyFilterBar className="border-b border-white/10 bg-black/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div
              role="group"
              aria-label="Filter achievements by category"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline-flex items-center gap-1">
                <Filter className="h-3 w-3" /> Category:
              </span>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                    selectedCategory === cat
                      ? "gradient-gold text-primary font-bold shadow-sm"
                      : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Year Selector & Search Input */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              {/* Year Filter Dropdown */}
              <div className="flex items-center gap-1 bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white">
                <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Filter achievements by academic year"
                  className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer pr-1 py-1"
                >
                  <option value="All" className="bg-neutral-950 text-white">
                    All Years
                  </option>
                  {availableYears
                    .filter((y) => y !== "All")
                    .map((year) => (
                      <option key={year} value={year} className="bg-neutral-950 text-white">
                        {year}
                      </option>
                    ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search achievements..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-gold transition min-h-[38px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active status bar */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-neutral-400 font-mono">
            <span>
              Showing {filteredAchievements.length}{" "}
              {filteredAchievements.length === 1 ? "Record" : "Records"}
            </span>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-gold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </StickyFilterBar>

      {/* ACHIEVEMENTS GRID SECTION IN PURE BLACK CANVAS */}
      <section className="sticky-content-container relative bg-black pt-10 pb-20 sm:pt-14 sm:pb-24 text-white min-h-[60vh]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {filteredAchievements.map((item, index) => (
                <Reveal key={item.id} delay={(index % 2) * 80}>
                  <AchievementCard achievement={item} onSelect={setSelectedAchievement} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching achievements found"
              description="No achievements match your selected category, year, or search query. Try adjusting your filter parameters."
              actionText="Reset All Filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </section>

      {/* DETAIL VIEW MODAL */}
      <AchievementDetailModal
        achievement={selectedAchievement}
        isOpen={selectedAchievement !== null}
        onClose={() => setSelectedAchievement(null)}
      />
    </Layout>
  );
}
