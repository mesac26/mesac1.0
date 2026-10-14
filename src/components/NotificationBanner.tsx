import React from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, ArrowRight } from "lucide-react";

export interface AnnouncementConfig {
  active?: boolean;
  enabled?: boolean;
  title?: string;
  badge?: string;
  description?: string;
  message?: string;
  linkText?: string;
  href?: string;
  icon?: string;
}

// Configuration for active announcement banner. Set `active: true` when a new notification/registration is live.
const CURRENT_ANNOUNCEMENT: AnnouncementConfig = {
  active: true,
  badge: "Announcement",
  title: "MESAC Committee 2026-27 Announced",
  message: "Explore upcoming flagship workshops, technical seminars, and student initiatives.",
  linkText: "View Events & Details",
  href: "/events",
  icon: "📣",
};

export function NotificationBanner({
  config = CURRENT_ANNOUNCEMENT,
}: {
  config?: AnnouncementConfig;
}) {
  const isLive = config.active ?? config.enabled ?? false;
  const message = config.description || config.message;

  if (!config || !isLive || (!message && !config.title)) {
    return null;
  }

  const isInternal = config.href && config.href.startsWith("/") && !config.href.startsWith("//");

  const Content = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-card via-card/95 to-secondary/80 border border-gold/30 p-3 sm:px-5 sm:py-3 shadow-md backdrop-blur-md transition-all hover:border-gold/60">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 text-center sm:text-left">
        <span className="shrink-0 text-base" aria-hidden="true">
          {config.icon || "📣"}
        </span>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {config.badge && (
            <span className="rounded-full bg-gold/15 text-gold border border-gold/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {config.badge}
            </span>
          )}
          {config.title && (
            <span className="font-display text-xs sm:text-sm font-bold text-foreground">
              {config.title}
            </span>
          )}
          {message && (
            <span className="text-xs text-muted-foreground font-normal">
              {config.title ? `— ${message}` : message}
            </span>
          )}
        </div>
      </div>

      {config.linkText && config.href && (
        <div className="shrink-0 inline-flex items-center gap-1.5 rounded-xl gradient-gold text-primary px-3.5 py-1.5 text-xs font-bold shadow-sm transition hover:brightness-105 active:scale-95">
          <span>{config.linkText}</span>
          {isInternal ? <ArrowRight className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
        </div>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Association Announcements"
      className="w-full bg-background/80 py-2.5 px-3 sm:px-6 border-y border-border/80"
    >
      <div className="mx-auto max-w-6xl">
        {config.href ? (
          isInternal ? (
            <Link to={config.href} className="block group cursor-pointer">
              {Content}
            </Link>
          ) : (
            <a
              href={config.href}
              target="_blank"
              rel="noreferrer"
              className="block group cursor-pointer"
            >
              {Content}
            </a>
          )
        ) : (
          Content
        )}
      </div>
    </aside>
  );
}
