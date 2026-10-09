import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { EventDetailModal } from "@/components/EventDetailModal";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import { Calendar, Search, X, Sparkles, Filter, History } from "lucide-react";
import { mockEvents } from "@/data/mock/events";
import { isEventUpcoming } from "@/lib/events";
import type { Event } from "@/types";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Workshops — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Conducted workshops, seminars, industrial immersion visits, DAAD sessions, and technical events by MESAC at CUSAT.",
      },
      { property: "og:title", content: "Events — MESAC CUSAT" },
      { property: "og:description", content: "What we build, host and celebrate at MESAC." },
    ],
  }),
  component: EventsPage,
});

const HERO_BG = "https://cdn.corenexis.com/f/1l9pScvEDPr.png";

type EventScope = "all" | "upcoming" | "past";

export function EventsPage() {
  const [scope, setScope] = useState<EventScope>("all");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Derive upcoming vs past dynamically based on event date calculation
  const { allUpcoming, allPast } = useMemo(() => {
    const upcoming: Event[] = [];
    const past: Event[] = [];

    mockEvents.forEach((evt) => {
      if (isEventUpcoming(evt)) {
        upcoming.push(evt);
      } else {
        past.push(evt);
      }
    });

    return { allUpcoming: upcoming, allPast: past };
  }, []);

  // Derive unique categories from existing event data without hardcoding
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    mockEvents.forEach((e) => {
      if (e.tag) tags.add(e.tag);
    });
    return ["All", ...Array.from(tags)];
  }, []);

  // Simple, robust search filter matching title, description, tag, and location
  const filteredUpcoming = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allUpcoming.filter((e) => {
      const matchesTag = selectedTag === "All" || e.tag === selectedTag;
      if (!matchesTag) return false;

      if (!q) return true;

      return (
        e.title.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q) ||
        (e.fullDetails && e.fullDetails.toLowerCase().includes(q)) ||
        (e.tag && e.tag.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.coordinator && e.coordinator.toLowerCase().includes(q))
      );
    });
  }, [allUpcoming, selectedTag, searchQuery]);

  const filteredPast = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPast.filter((e) => {
      const matchesTag = selectedTag === "All" || e.tag === selectedTag;
      if (!matchesTag) return false;

      if (!q) return true;

      return (
        e.title.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q) ||
        (e.fullDetails && e.fullDetails.toLowerCase().includes(q)) ||
        (e.tag && e.tag.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.coordinator && e.coordinator.toLowerCase().includes(q))
      );
    });
  }, [allPast, selectedTag, searchQuery]);

  const totalFilteredCount =
    scope === "upcoming"
      ? filteredUpcoming.length
      : scope === "past"
        ? filteredPast.length
        : filteredUpcoming.length + filteredPast.length;

  const resetAllFilters = () => {
    setSelectedTag("All");
    setSearchQuery("");
  };

  return (
    <Layout>
      <PageHero
        variant="events"
        bgImage={HERO_BG}
        eyebrow="Events & Workshops"
        title={
          <>
            EVENTS & <span className="italic text-gold">WORKSHOPS</span>
          </>
        }
        subtitle="Bridging academic curriculum and modern industry practices through experiential learning."
      />

      {/* FILTER & SEARCH CONTROL BAR */}
      <StickyFilterBar className="border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-3">
          {/* Top Row: Scope Switcher + Search Input */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Scope Switcher (All / Upcoming / Past) */}
            <div
              role="tablist"
              aria-label="Filter events by status"
              className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border/80 self-start md:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={scope === "all"}
                onClick={() => setScope("all")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  scope === "all"
                    ? "gradient-gold text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                All Events ({mockEvents.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={scope === "upcoming"}
                onClick={() => setScope("upcoming")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  scope === "upcoming"
                    ? "gradient-gold text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <span>Upcoming</span>
                <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {allUpcoming.length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={scope === "past"}
                onClick={() => setScope("past")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  scope === "past"
                    ? "gradient-gold text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <span>Past Events</span>
                <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-mono">
                  {allPast.length}
                </span>
              </button>
            </div>

            {/* Simple Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, topic, or venue..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Tag Pills + Active Match Counter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-border/40">
            <div
              role="group"
              aria-label="Filter events by category tags"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline-flex items-center gap-1">
                <Filter className="h-3 w-3" /> Tag:
              </span>
              {availableTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gold text-primary font-bold shadow-sm"
                        : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {(selectedTag !== "All" || searchQuery) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-gold hover:underline font-mono ml-2 whitespace-nowrap cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="text-xs text-muted-foreground self-end sm:self-auto font-mono">
              Showing {totalFilteredCount} {totalFilteredCount === 1 ? "event" : "events"}
            </div>
          </div>
        </div>
      </StickyFilterBar>

      {/* EVENTS CONTENT SECTIONS */}
      <section className="sticky-content-container py-12 sm:py-20 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/20 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
          {/* SECTION 1: UPCOMING EVENTS (SHOWN ON 'ALL' OR 'UPCOMING' SCOPE) */}
          {(scope === "all" || scope === "upcoming") && (
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-border/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      Upcoming Events & Announcements
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Upcoming technical workshops, guest lectures, and student chapter initiatives.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {filteredUpcoming.length} Scheduled
                </span>
              </div>

              {filteredUpcoming.length > 0 ? (
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredUpcoming.map((evt, idx) => (
                    <Reveal key={evt.id} delay={idx * 40}>
                      <EventCard eventItem={evt} onSelect={setSelectedEvent} />
                    </Reveal>
                  ))}
                </div>
              ) : scope === "upcoming" ? (
                /* Empty state when user specifically selected Upcoming tab */
                <EmptyState
                  title={
                    selectedTag !== "All" || searchQuery
                      ? "No upcoming events match your filters"
                      : "No Upcoming Events Scheduled"
                  }
                  description={
                    selectedTag !== "All" || searchQuery
                      ? "No upcoming events match the current search or tag selection. Try clearing your filters."
                      : "We are currently organizing upcoming workshops, guest lectures, and techfest programs. Stay tuned for official announcements!"
                  }
                  icon={<Calendar className="h-7 w-7 text-gold" />}
                  actionText={
                    selectedTag !== "All" || searchQuery ? "Reset Filters" : "Browse Past Events"
                  }
                  onAction={
                    selectedTag !== "All" || searchQuery ? resetAllFilters : () => setScope("past")
                  }
                />
              ) : (
                /* Notice banner on 'all' view when no upcoming events are active */
                <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-6 sm:p-8 text-center flex flex-col items-center justify-center">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                    No Upcoming Events Currently Scheduled
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
                    Upcoming events will be announced shortly. Explore our conducted programs and
                    workshops below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: PAST EVENTS (SHOWN ON 'ALL' OR 'PAST' SCOPE) */}
          {(scope === "all" || scope === "past") && (
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-border/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold/15 text-gold">
                    <History className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      Past Events & Conducted Workshops
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Explore conducted programs, industry immersion visits, and guest lectures.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground">
                  {filteredPast.length} Conducted
                </span>
              </div>

              {filteredPast.length > 0 ? (
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPast.map((evt, idx) => (
                    <Reveal key={evt.id} delay={idx * 30}>
                      <EventCard
                        eventItem={evt}
                        onSelect={setSelectedEvent}
                        showUpcomingBadge={false}
                      />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No past events match your criteria"
                  description="Try adjusting your tag filter or search keywords to find past conducted workshops and seminars."
                  actionText="Clear All Filters"
                  onAction={resetAllFilters}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* EVENT DETAIL MODAL */}
      <EventDetailModal
        eventItem={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      />
    </Layout>
  );
}
