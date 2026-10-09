import { useState } from "react";
import type { Achievement } from "@/types";
import { Trophy, Calendar, Sparkles, ArrowRight, ImageOff } from "lucide-react";

export interface AchievementCardProps {
  achievement: Achievement;
  onSelect?: (achievement: Achievement) => void;
  className?: string;
}

export function AchievementCard({ achievement, onSelect, className = "" }: AchievementCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-950/75 border border-white/10 p-5 sm:p-6 transition-all duration-300 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-black/50 card-lift h-full motion-reduce:transition-none motion-reduce:hover:transform-none ${className}`}
    >
      <div>
        {/* Supporting Image Frame */}
        {achievement.image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/15 bg-black/60 shadow-lg mb-5">
            {!imgError ? (
              <img
                src={achievement.image}
                alt={achievement.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-muted-foreground">
                <ImageOff className="h-8 w-8 text-gold/60 mb-1.5" />
                <span className="text-xs font-mono">Image Record</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Team / Honouree Badge */}
            <div className="absolute top-3 left-3 rounded-md bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-950 shadow">
              {achievement.teamOrStudent}
            </div>

            {/* Year Tag */}
            <div className="absolute top-3 right-3 rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-mono font-semibold text-white/90 border border-white/10">
              {achievement.year}
            </div>

            {/* Rank / Position badge if present */}
            {achievement.rank && (
              <div className="absolute bottom-2.5 left-3">
                <span className="rounded-md bg-gold/90 text-primary font-bold px-2 py-0.5 text-[10px] flex items-center gap-1 shadow">
                  <Trophy className="h-3 w-3" />
                  <span>{achievement.rank}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Card Header when no image exists */}
        {!achievement.image && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="rounded-md bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-950 shadow">
              {achievement.teamOrStudent}
            </span>
            <span className="text-xs font-mono text-gold/80">{achievement.year}</span>
          </div>
        )}

        {/* Title */}
        <h3
          onClick={() => onSelect?.(achievement)}
          className={`font-display text-lg sm:text-xl font-bold leading-snug text-white tracking-wide group-hover:text-amber-300 transition-colors ${
            onSelect ? "cursor-pointer" : ""
          }`}
        >
          {achievement.title}
        </h3>

        {/* Bullets / Highlights */}
        {achievement.bullets && achievement.bullets.length > 0 && (
          <ul className="mt-3.5 space-y-1.5 pl-1 text-xs sm:text-sm font-normal text-slate-200">
            {achievement.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold select-none">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] font-mono text-gold/80 uppercase tracking-wider">
          {achievement.category}
        </span>

        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(achievement)}
            aria-label={`View details for ${achievement.title}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white transition py-1 cursor-pointer min-h-[44px]"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </article>
  );
}
