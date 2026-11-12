import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Event } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Images,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { formatEventDate, extractEventTime, isEventUpcoming } from "@/lib/events";

const FALLBACK_BG = "https://cdn.corenexis.com/f/1l9pScvEDPr.png";

export interface EventCardProps {
  eventItem: Event;
  className?: string;
  onSelect?: (event: Event) => void;
  showUpcomingBadge?: boolean;
}

export function EventCard({
  eventItem,
  className = "",
  onSelect,
  showUpcomingBadge = true,
}: EventCardProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const images = eventItem.images && eventItem.images.length > 0 ? eventItem.images : [FALLBACK_BG];
  const totalImgs = images.length;
  const currentImg = images[currentImgIdx] || FALLBACK_BG;
  const isUpcoming = isEventUpcoming(eventItem);
  const formattedDate = formatEventDate(eventItem.date);
  const eventTime = extractEventTime(eventItem.date);

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border border-border/80 card-lift h-full transition-all duration-300 hover:border-gold/40 ${className}`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* IMAGE AREA */}
          <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
            <img
              src={currentImg}
              alt={`${eventItem.title} - Photo ${currentImgIdx + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_BG;
              }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Tag & Status Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5">
              {eventItem.tag && (
                <div className="rounded-full glass px-3 py-1 text-xs font-semibold text-primary">
                  {eventItem.tag}
                </div>
              )}
              {showUpcomingBadge && isUpcoming && (
                <div className="rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-bold px-2.5 py-0.5 text-[10px] flex items-center gap-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Upcoming</span>
                </div>
              )}
            </div>

            {/* Date Badge */}
            {eventItem.date && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <div className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white flex items-center gap-1.5 border border-white/10 font-mono">
                  <Calendar className="h-3 w-3 text-gold" aria-hidden="true" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            )}

            {/* Prize Pool */}
            {eventItem.prizePool && (
              <div className="absolute bottom-4 left-4 rounded-full bg-gold/90 text-primary font-bold px-3 py-1 text-xs flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{eventItem.prizePool}</span>
              </div>
            )}

            {/* Multi-Image Controls */}
            {totalImgs > 1 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2 py-1 border border-white/15">
                <Images className="h-3 w-3 text-gold mr-1" aria-hidden="true" />
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIdx((prev) => (prev === 0 ? totalImgs - 1 : prev - 1));
                  }}
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Previous photo"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="text-[10px] font-semibold text-white px-1">
                  {currentImgIdx + 1}/{totalImgs}
                </span>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIdx((prev) => (prev === totalImgs - 1 ? 0 : prev + 1));
                  }}
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Next photo"
                >
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* CARD TEXT BODY */}
          <div className="p-5 sm:p-6">
            <h3
              onClick={() => onSelect?.(eventItem)}
              className={`font-display text-xl sm:text-2xl group-hover:text-gold transition-colors leading-snug ${
                onSelect ? "cursor-pointer" : ""
              }`}
            >
              {eventItem.title}
            </h3>

            {eventTime && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gold/90 font-mono">
                <Clock className="h-3 w-3" />
                <span>{eventTime}</span>
              </div>
            )}

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {eventItem.desc}
            </p>

            <div className="mt-4 pt-4 border-t border-border/80 space-y-2 text-xs text-muted-foreground">
              {eventItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden="true" />
                  <span className="truncate">{eventItem.location}</span>
                </div>
              )}
              {eventItem.coordinator && (
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden="true" />
                  <span className="truncate">{eventItem.coordinator}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD ACTIONS FOOTER */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
          {/* Details trigger button */}
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(eventItem)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-amber-300 transition py-1 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Associated Gallery Album Link: ONLY displayed when a verified album exists */}
            {eventItem.galleryAlbumId && (
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition"
                title="View Gallery Photo Album"
              >
                <Images className="h-3 w-3 text-gold" />
                <span>Album</span>
              </Link>
            )}

            {/* Registration Action: ONLY displayed when a verified registration URL exists */}
            {eventItem.registrationUrl && (
              <a
                href={eventItem.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold gradient-gold text-primary px-3 py-1.5 rounded-lg shadow-sm hover:brightness-105 active:scale-95 transition"
              >
                <span>Register</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
