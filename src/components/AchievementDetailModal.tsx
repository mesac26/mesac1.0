import { useEffect } from "react";
import type { Achievement } from "@/types";
import {
  Trophy,
  Calendar,
  X,
  Users,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  ImageOff,
} from "lucide-react";

export interface AchievementDetailModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementDetailModal({
  achievement,
  isOpen,
  onClose,
}: AchievementDetailModalProps) {
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

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !achievement) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-achievement-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn motion-reduce:animate-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl text-foreground flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close achievement details"
          className="absolute top-4 right-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Supporting Image Frame (if available) */}
        {achievement.image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950 shrink-0">
            <img
              src={achievement.image}
              alt={achievement.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-black/20 to-transparent pointer-events-none" />

            {/* Team & Year Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500/90 text-slate-950 font-bold px-3 py-1 text-xs shadow-md">
                {achievement.teamOrStudent}
              </span>
              <span className="rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs font-mono font-semibold text-white/90 border border-white/10">
                {achievement.year}
              </span>
            </div>

            {/* Rank Tag if available */}
            {achievement.rank && (
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-gold/90 text-primary font-bold px-3.5 py-1 text-xs flex items-center gap-1.5 shadow-md">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>{achievement.rank}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gold mb-2">
              <span className="uppercase tracking-wider font-semibold">{achievement.category}</span>
              <span>•</span>
              <span>{achievement.year}</span>
            </div>

            <h2
              id="modal-achievement-title"
              className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug"
            >
              {achievement.title}
            </h2>
          </div>

          {/* Metadata Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                  Team / Honouree
                </span>
                <span className="font-bold text-sm text-white">{achievement.teamOrStudent}</span>
              </div>
            </div>

            {achievement.eventOrCompetition && (
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block">
                    Event / Competition
                  </span>
                  <span className="font-semibold text-sm text-white truncate max-w-[200px] block">
                    {achievement.eventOrCompetition}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bullets / Verified Highlights */}
          {achievement.bullets && achievement.bullets.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-3 font-mono flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Key Highlights & Results</span>
              </h4>
              <ul className="space-y-2">
                {achievement.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-200">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl bg-secondary/80 hover:bg-secondary text-white font-medium px-5 py-2 text-xs sm:text-sm transition min-h-[40px] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
