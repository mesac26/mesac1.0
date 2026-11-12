import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { Event } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  X,
  ExternalLink,
  Images,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatEventDate, extractEventTime, isEventUpcoming } from "@/lib/events";

const FALLBACK_BG = "https://cdn.corenexis.com/f/1l9pScvEDPr.png";

export interface EventDetailModalProps {
  eventItem: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({ eventItem, isOpen, onClose }: EventDetailModalProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset active image index when eventItem changes
  useEffect(() => {
    setActiveImgIdx(0);
  }, [eventItem?.id]);

  if (!isOpen || !eventItem) return null;

  const images = eventItem.images && eventItem.images.length > 0 ? eventItem.images : [FALLBACK_BG];
  const totalImgs = images.length;
  const currentImg = images[activeImgIdx] || FALLBACK_BG;
  const isUpcoming = isEventUpcoming(eventItem);
  const formattedDate = formatEventDate(eventItem.date);
  const eventTime = extractEventTime(eventItem.date);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl text-foreground flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute top-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Event Image Banner with Carousel */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40 shrink-0">
          <img
            src={currentImg}
            alt={`${eventItem.title} - Photo ${activeImgIdx + 1}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_BG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-black/60 pointer-events-none" />

          {/* Badges on Banner */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full glass px-3 py-1 text-xs font-bold text-primary">
              {eventItem.tag}
            </span>
            {isUpcoming ? (
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-3 py-1 text-xs flex items-center gap-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Upcoming Event
              </span>
            ) : (
              <span className="rounded-full bg-white/10 border border-white/15 text-white/90 font-medium px-3 py-1 text-xs backdrop-blur-md">
                Conducted Program
              </span>
            )}
          </div>

          {/* Multi-Image Controls */}
          {totalImgs > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/20">
              <Images className="h-3.5 w-3.5 text-gold mr-1" aria-hidden="true" />
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setActiveImgIdx((prev) => (prev === 0 ? totalImgs - 1 : prev - 1))}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-white px-1 font-mono">
                {activeImgIdx + 1} / {totalImgs}
              </span>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setActiveImgIdx((prev) => (prev === totalImgs - 1 ? 0 : prev + 1))}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          <div>
            <h2
              id="modal-event-title"
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-snug"
            >
              {eventItem.title}
            </h2>

            {/* Date, Time & Metadata Strip */}
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-muted-foreground border-b border-border/80 pb-4">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Calendar className="h-4 w-4 text-gold shrink-0" />
                <span>{formattedDate}</span>
              </div>
              {eventTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold shrink-0" />
                  <span>{eventTime}</span>
                </div>
              )}
              {eventItem.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold shrink-0" />
                  <span>{eventItem.location}</span>
                </div>
              )}
              {eventItem.prizePool && (
                <div className="flex items-center gap-1.5 text-gold font-bold">
                  <Trophy className="h-4 w-4 shrink-0" />
                  <span>Prize Pool: {eventItem.prizePool}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description & Details */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-neutral-300">
            <p>{eventItem.desc}</p>
            {eventItem.fullDetails && <p className="text-neutral-400">{eventItem.fullDetails}</p>}
          </div>

          {/* Coordinator */}
          {eventItem.coordinator && (
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  Coordinator & Resource Team
                </span>
                <span className="font-semibold text-sm text-foreground">
                  {eventItem.coordinator}
                </span>
              </div>
            </div>
          )}

          {/* Prerequisites (if available) */}
          {eventItem.prerequisites && eventItem.prerequisites.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-2 font-mono">
                Prerequisites & Requirements
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-muted-foreground">
                {eventItem.prerequisites.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Registration Link: ONLY displayed when a valid registration link exists */}
              {eventItem.registrationUrl && (
                <a
                  href={eventItem.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl gradient-gold text-primary font-bold px-6 py-2.5 text-xs sm:text-sm hover:brightness-105 active:scale-95 transition min-h-[40px] shadow-sm"
                >
                  <span>Register for Event</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {/* Gallery Album Link: ONLY displayed when an associated gallery album exists */}
              {eventItem.galleryAlbumId && (
                <Link
                  to="/gallery"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 text-xs sm:text-sm border border-white/20 transition min-h-[40px]"
                >
                  <Images className="h-4 w-4 text-gold" />
                  <span>View Photo Album</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground font-medium px-4 py-2 text-xs sm:text-sm transition min-h-[40px] cursor-pointer ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
