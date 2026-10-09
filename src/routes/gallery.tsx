import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { PageGearBackground } from "@/components/PageGearBackground";
import { Reveal } from "@/components/Reveal";
import { EmptyState } from "@/components/EmptyState";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import {
  Download,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Maximize2,
  FolderArchive,
  ArrowRight,
  ArrowLeft,
  Images,
  ImageOff,
  ExternalLink,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { mockGalleryAlbums, mockGalleryImages } from "@/data/mock/gallery";
import { mockEvents } from "@/data/mock/events";
import type { GalleryImage, GalleryAlbum } from "@/types";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Campus Gallery & Media Archive — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Visual archive of workshops, technical sessions, guest lectures, and student community milestones from Mechanical Engineering, School of Engineering, CUSAT.",
      },
      { property: "og:title", content: "Campus Gallery — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "Moments, technical workshops, industry visits, and achievements from the Mechanical Engineering Students Association at CUSAT.",
      },
    ],
  }),
  component: GalleryPage,
});

export function GalleryPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Check URL query parameters for direct album links on mount (e.g. /gallery?album=album-workshops-2025)
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const albumParam = params.get("album");
      if (albumParam && mockGalleryAlbums.some((a) => a.id === albumParam)) {
        setSelectedAlbumId(albumParam);
      }
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    mockGalleryAlbums.forEach((a) => set.add(a.category));
    mockGalleryImages.forEach((img) => set.add(img.category));
    return ["All", ...Array.from(set)];
  }, []);

  // Filtered albums based on category & search query
  const filteredAlbums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockGalleryAlbums.filter((album) => {
      const matchesCategory = activeCategory === "All" || album.category === activeCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        album.title.toLowerCase().includes(q) ||
        (album.description && album.description.toLowerCase().includes(q)) ||
        album.category.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  // Active selected album record
  const selectedAlbum: GalleryAlbum | null = useMemo(() => {
    if (!selectedAlbumId) return null;
    return mockGalleryAlbums.find((a) => a.id === selectedAlbumId) || null;
  }, [selectedAlbumId]);

  // Images for the currently selected album (or all images matching filters if no album selected)
  const albumImages = useMemo(() => {
    if (selectedAlbumId) {
      return mockGalleryImages.filter((img) => img.albumId === selectedAlbumId);
    }
    const q = searchQuery.trim().toLowerCase();
    return mockGalleryImages.filter((img) => {
      const matchesCategory = activeCategory === "All" || img.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        img.label.toLowerCase().includes(q) ||
        (img.description && img.description.toLowerCase().includes(q)) ||
        img.category.toLowerCase().includes(q)
      );
    });
  }, [selectedAlbumId, activeCategory, searchQuery]);

  // Lookup related event for the selected album (if an actual relationship exists)
  const relatedEvent = useMemo(() => {
    if (!selectedAlbum?.relatedEventId) return null;
    return mockEvents.find((e) => e.id === selectedAlbum.relatedEventId) || null;
  }, [selectedAlbum]);

  // Current image in lightbox
  const currentLightboxImage =
    lightboxIndex !== null && lightboxIndex >= 0 && lightboxIndex < albumImages.length
      ? albumImages[lightboxIndex]
      : null;

  // Handle image error fallback
  const handleImageError = useCallback((id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  // Download image (strictly enabled only when an actual URL exists)
  const handleDownload = (item: GalleryImage) => {
    if (!item.src) {
      toast.error("No valid image file available for download.");
      return;
    }
    toast.success("Downloading photograph...", { description: item.label });
    const link = document.createElement("a");
    link.href = item.src;
    link.download = `MESAC_${item.label.replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || albumImages.length === 0) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : albumImages.length - 1));
  }, [lightboxIndex, albumImages.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || albumImages.length === 0) return;
    setLightboxIndex((prev) => (prev !== null && prev < albumImages.length - 1 ? prev + 1 : 0));
  }, [lightboxIndex, albumImages.length]);

  // Keyboard navigation & body scroll locking for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const prevOverflow = typeof document !== "undefined" ? document.body.style.overflow : "";
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = prevOverflow;
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <Layout>
      <PageHero
        variant="gallery"
        eyebrow="Media Archive & Memories"
        title={
          <>
            CAMPUS <span className="italic text-gold">GALLERY</span>
          </>
        }
        subtitle="Preserving moments, technical workshops, industry visits, and achievements from Mechanical Engineering at CUSAT."
      />

      {/* FILTER & SEARCH BAR */}
      <StickyFilterBar className="border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
          {/* Breadcrumb / View Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {selectedAlbum ? (
              <button
                type="button"
                onClick={() => setSelectedAlbumId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-amber-300 transition py-1.5 px-3 rounded-full bg-gold/10 border border-gold/30 cursor-pointer shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Albums</span>
              </button>
            ) : (
              <div
                role="tablist"
                aria-label="Filter gallery by category"
                className="flex items-center gap-1.5 overflow-x-auto"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] inline-flex items-center justify-center ${
                      activeCategory === cat
                        ? "gradient-gold text-primary shadow-sm"
                        : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative w-full sm:w-64">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
              />
              <input
                type="text"
                aria-label="Search gallery albums or photos"
                placeholder={selectedAlbum ? "Search this album..." : "Search gallery..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-card/60 pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none min-h-[38px] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </StickyFilterBar>

      {/* MAIN GALLERY VIEW */}
      <section className="sticky-content-container py-12 sm:py-16 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/20 pointer-events-none" />
        <PageGearBackground variant="gallery" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          {/* VIEW A: SINGLE ALBUM VIEW (WHEN AN ALBUM IS OPENED) */}
          {selectedAlbum ? (
            <div className="space-y-8 animate-fadeIn">
              {/* Album Header & Related Event Association */}
              <div className="rounded-3xl border border-border bg-card/75 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-full bg-gold/15 text-gold border border-gold/30 px-3 py-1 text-xs font-bold font-mono">
                        {selectedAlbum.category}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70 font-mono">
                        {selectedAlbum.date}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70 font-mono">
                        {albumImages.length} Photographs
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground">
                      {selectedAlbum.title}
                    </h2>
                    {selectedAlbum.description && (
                      <p className="mt-2 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                        {selectedAlbum.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAlbumId(null)}
                    className="inline-flex items-center gap-2 self-start md:self-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Albums</span>
                  </button>
                </div>

                {/* Related Department Event Association (ONLY if an actual relationship exists) */}
                {relatedEvent && (
                  <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-amber-950/20 via-card to-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold font-mono">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Associated Department Event</span>
                      </div>
                      <div className="font-display text-base sm:text-lg font-bold text-white mt-0.5">
                        {relatedEvent.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>Date: {relatedEvent.date}</span>
                        <span>•</span>
                        <span>Venue: {relatedEvent.location}</span>
                      </div>
                    </div>

                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-4 py-2 text-xs hover:brightness-105 active:scale-95 transition shrink-0 self-start sm:self-auto min-h-[38px]"
                    >
                      <span>Explore Event</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Photos Grid for this Album */}
              {albumImages.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {albumImages.map((img, idx) => {
                    const hasError = !!imageErrors[img.id];
                    return (
                      <Reveal key={img.id} delay={(idx % 6) * 40}>
                        <div
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 motion-reduce:transition-none motion-reduce:hover:transform-none"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                            {!hasError && img.src ? (
                              <img
                                src={img.src}
                                alt={img.label}
                                loading="lazy"
                                onError={() => handleImageError(img.id)}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                              />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-muted-foreground">
                                <ImageOff className="h-8 w-8 text-gold/60 mb-2" />
                                <span className="text-xs font-mono">Image Unavailable</span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                            {/* Top Badge */}
                            <div className="absolute top-3 left-3">
                              <span className="rounded-full bg-black/60 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-white/90 border border-white/10 font-mono">
                                {img.date}
                              </span>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity motion-reduce:opacity-100">
                              {img.src && !hasError && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(img);
                                  }}
                                  aria-label={`Download ${img.label}`}
                                  className="rounded-full bg-black/70 hover:bg-gold hover:text-neutral-950 backdrop-blur p-2 text-white border border-white/10 transition cursor-pointer"
                                  title="Download photograph"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <div className="rounded-full bg-black/70 backdrop-blur p-2 text-white border border-white/10">
                                <Maximize2 className="h-3.5 w-3.5" />
                              </div>
                            </div>

                            {/* Bottom Caption */}
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <h4 className="font-display text-base font-bold group-hover:text-gold transition-colors leading-snug line-clamp-2">
                                {img.label}
                              </h4>
                              {img.description && (
                                <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                                  {img.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No photographs found in this album"
                  description="There are currently no photos indexed under this album."
                  actionText="Back to Albums"
                  onAction={() => setSelectedAlbumId(null)}
                />
              )}
            </div>
          ) : (
            /* VIEW B: ALL ALBUMS OVERVIEW */
            <div className="space-y-16">
              {/* ALBUMS SECTION */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold mb-1">
                      <FolderArchive className="h-4 w-4" />
                      <span>Photo Collections</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground">
                      Featured Photo Albums
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Select an album to browse photographs from MESAC student chapters, technical
                      workshops, and guest lectures.
                    </p>
                  </div>

                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-card border border-border text-muted-foreground self-start sm:self-auto">
                    {filteredAlbums.length} {filteredAlbums.length === 1 ? "Album" : "Albums"}
                  </span>
                </div>

                {filteredAlbums.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAlbums.map((album, idx) => {
                      const hasCoverError = !!imageErrors[album.id];
                      const eventLink = album.relatedEventId
                        ? mockEvents.find((e) => e.id === album.relatedEventId)
                        : null;

                      return (
                        <Reveal key={album.id} delay={idx * 60}>
                          <div
                            onClick={() => setSelectedAlbumId(album.id)}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 cursor-pointer card-lift h-full motion-reduce:transition-none motion-reduce:hover:transform-none"
                          >
                            <div>
                              {/* Album Cover Photo */}
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                                {!hasCoverError && album.coverImage ? (
                                  <img
                                    src={album.coverImage}
                                    alt={album.title}
                                    loading="lazy"
                                    onError={() => handleImageError(album.id)}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                  />
                                ) : (
                                  <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-muted-foreground">
                                    <FolderArchive className="h-10 w-10 text-gold/60 mb-2" />
                                    <span className="text-xs font-mono">{album.title}</span>
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5">
                                  <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-gold border border-gold/30">
                                    {album.category}
                                  </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                  <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-semibold text-white/90 border border-white/10 flex items-center gap-1.5">
                                    <Images className="h-3 w-3 text-gold" />
                                    <span>{album.imageCount} Photos</span>
                                  </span>
                                </div>

                                <div className="absolute bottom-3 left-4 text-xs font-mono text-gold flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3" />
                                  <span>{album.date}</span>
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-5 sm:p-6 space-y-2">
                                <h3 className="font-display text-xl sm:text-2xl font-bold group-hover:text-gold transition-colors leading-snug">
                                  {album.title}
                                </h3>
                                {album.description && (
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {album.description}
                                  </p>
                                )}

                                {eventLink && (
                                  <div className="pt-2 text-[11px] font-mono text-gold/90 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3 text-gold shrink-0" />
                                    <span className="truncate">Event: {eventLink.title}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Footer Action */}
                            <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-gold group-hover:text-amber-300 transition">
                              <span>Open Album</span>
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                            </div>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    title={searchQuery ? `No albums matching "${searchQuery}"` : "No albums found"}
                    description="Try selecting another category or clearing your search keywords."
                    actionText="Reset Filters"
                    onAction={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                  />
                )}
              </div>

              {/* ALL PHOTOS STREAM HIGHLIGHT */}
              <div className="pt-12 border-t border-border/80">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold mb-1">
                      <Images className="h-4 w-4" />
                      <span>Archive Stream</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      All Photographs
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Explore individual photographs across all verified collections and workshops.
                    </p>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">
                    {albumImages.length} Photographs
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {albumImages.map((img, idx) => {
                    const hasError = !!imageErrors[img.id];
                    return (
                      <Reveal key={`stream-${img.id}`} delay={(idx % 6) * 40}>
                        <div
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 motion-reduce:transition-none motion-reduce:hover:transform-none"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                            {!hasError && img.src ? (
                              <img
                                src={img.src}
                                alt={img.label}
                                loading="lazy"
                                onError={() => handleImageError(img.id)}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                              />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-muted-foreground">
                                <ImageOff className="h-8 w-8 text-gold/60 mb-2" />
                                <span className="text-xs font-mono">Image Unavailable</span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            <div className="absolute top-3 left-3">
                              <span className="rounded-full bg-black/60 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-white/90 border border-white/10 font-mono">
                                {img.category}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity motion-reduce:opacity-100">
                              {img.src && !hasError && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(img);
                                  }}
                                  aria-label={`Download ${img.label}`}
                                  className="rounded-full bg-black/70 hover:bg-gold hover:text-neutral-950 backdrop-blur p-2 text-white border border-white/10 transition cursor-pointer"
                                  title="Download photograph"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <div className="rounded-full bg-black/70 backdrop-blur p-2 text-white border border-white/10">
                                <Maximize2 className="h-3.5 w-3.5" />
                              </div>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <h4 className="font-display text-base font-bold group-hover:text-gold transition-colors leading-snug line-clamp-2">
                                {img.label}
                              </h4>
                              <div className="text-[11px] font-mono text-gold/90 mt-0.5">
                                {img.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ACCESSIBLE FULLSCREEN LIGHTBOX MODAL */}
      {currentLightboxImage &&
        isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-image-title"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn motion-reduce:animate-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-white">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono border border-white/15">
                  {(lightboxIndex ?? 0) + 1} / {albumImages.length}
                </span>
                <span className="text-sm font-semibold hidden md:inline text-white/90 truncate max-w-md">
                  {currentLightboxImage.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Download button: STRICTLY enabled only when a real image URL exists */}
                {currentLightboxImage.src && !imageErrors[currentLightboxImage.id] && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(currentLightboxImage);
                    }}
                    aria-label={`Download image ${currentLightboxImage.label}`}
                    className="rounded-full bg-white/10 hover:bg-gold hover:text-neutral-950 p-2.5 text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Download original photograph"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close image viewer"
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Close (Escape)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Prev / Next Navigation Controls */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo (Left arrow)"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 sm:p-3.5 text-white transition cursor-pointer z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Previous photo (Left arrow)"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo (Right arrow)"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 sm:p-3.5 text-white transition cursor-pointer z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Next photo (Right arrow)"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Lightbox Image & Info Container */}
            <div
              className="relative max-h-[85vh] max-w-[90vw] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentLightboxImage.src && !imageErrors[currentLightboxImage.id] ? (
                <img
                  src={currentLightboxImage.src}
                  alt={currentLightboxImage.label}
                  onError={() => handleImageError(currentLightboxImage.id)}
                  className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
              ) : (
                <div className="h-64 w-80 rounded-2xl bg-neutral-900 border border-border flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <ImageOff className="h-12 w-12 text-gold/60 mb-2" />
                  <span className="text-sm font-mono">Image could not be loaded</span>
                </div>
              )}

              <div className="mt-4 text-center text-white max-w-xl px-4">
                <div className="text-xs font-mono text-gold mb-1">
                  {currentLightboxImage.date} • {currentLightboxImage.category}
                </div>
                <h3
                  id="lightbox-image-title"
                  className="font-display text-lg sm:text-2xl font-bold leading-snug"
                >
                  {currentLightboxImage.label}
                </h3>
                {currentLightboxImage.description && (
                  <p className="mt-1 text-xs sm:text-sm text-white/70 leading-relaxed">
                    {currentLightboxImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Layout>
  );
}
