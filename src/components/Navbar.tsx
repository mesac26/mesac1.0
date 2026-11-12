import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Users, Info } from "lucide-react";

// Gallery is now placed where Team was; Team is nested inside About MESAC
const links = [
  { to: "/", label: "HOME" },
  { to: "/events", label: "EVENTS" },
  { to: "/academy", label: "ACADEMY" },
  { to: "/archive", label: "ARCHIVE" },
  { to: "/mechanical-dept", label: "MECHANICAL DEPT." },
  { to: "/placements", label: "PLACEMENTS" },
  { to: "/achievements", label: "ACHIEVEMENTS" },
  { to: "/gallery", label: "GALLERY" },
  { to: "/alumni", label: "ALUMNI" },
  { to: "/about-mesac", label: "ABOUT MESAC" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAboutDropdownOpen(false);
  }, [pathname]);

  const isHeaderActive = scrolled || open;

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-40 transition-all duration-300 " +
        (isHeaderActive
          ? "py-2 sm:py-2.5 bg-background/85 dark:bg-black/85 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "py-3 sm:py-4 bg-transparent")
      }
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <nav
          className={
            "flex items-center justify-between rounded-full px-4 sm:px-6 py-2 transition-all duration-300 backdrop-blur-xl " +
            (isHeaderActive
              ? "bg-card/95 dark:bg-neutral-950/95 border border-border shadow-glass"
              : "bg-card/80 dark:bg-black/80 border border-border/80 shadow-sm")
          }
        >
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden bg-white shadow-sm border border-border/80 flex items-center justify-center p-0.5 transition-opacity duration-200 group-hover:opacity-90 shrink-0">
              <img
                src="/mesac-real-logo.png"
                alt="MESAC Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/mesac-logo-real.png";
                }}
              />
            </div>
            <span className="font-display text-base font-extrabold tracking-tight text-foreground uppercase select-none">
              MESAC
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden xl:flex items-center gap-1">
            {links.map((l) => {
              const active =
                pathname === l.to ||
                (l.to === "/about-mesac" && pathname.startsWith("/about-mesac")) ||
                (l.to === "/archive" && pathname.startsWith("/archive"));

              // Special dropdown for ABOUT MESAC containing Team
              if (l.to === "/about-mesac") {
                return (
                  <div
                    key={l.to}
                    className="relative"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <Link
                      to={l.to}
                      className={
                        "relative flex items-center gap-1 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-150 rounded-full whitespace-nowrap " +
                        (active
                          ? "text-foreground font-bold bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60")
                      }
                    >
                      <span>{l.label}</span>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </Link>

                    {aboutDropdownOpen && (
                      <div className="absolute top-full right-0 pt-2 w-56 animate-fade-in">
                        <div className="rounded-2xl border border-border bg-card/95 dark:bg-neutral-950/95 p-2 shadow-xl backdrop-blur-xl">
                          <Link
                            to="/about-mesac"
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors duration-150"
                          >
                            <Info className="h-3.5 w-3.5 text-gold" />
                            <span>About Association</span>
                          </Link>
                          <Link
                            to="/about-mesac/team"
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors duration-150"
                          >
                            <Users className="h-3.5 w-3.5 text-amber-400" />
                            <span>Executive Committee & Team</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    "relative inline-flex items-center px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-150 rounded-full whitespace-nowrap " +
                    (active
                      ? "text-foreground font-bold bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60")
                  }
                >
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center rounded-full gradient-gold text-primary px-4 py-2 text-xs sm:text-sm font-semibold hover:brightness-105 active:scale-95 transition-all duration-150 shadow-sm min-h-[38px]"
            >
              Contact
            </Link>
            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="xl:hidden grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center rounded-full border border-border bg-card text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={
                    "absolute inset-x-0 top-0 h-0.5 bg-foreground transition-transform " +
                    (open ? "translate-y-1.5 rotate-45" : "")
                  }
                />
                <span
                  className={
                    "absolute inset-x-0 top-1.5 h-0.5 bg-foreground transition-opacity " +
                    (open ? "opacity-0" : "")
                  }
                />
                <span
                  className={
                    "absolute inset-x-0 top-3 h-0.5 bg-foreground transition-transform " +
                    (open ? "-translate-y-1.5 -rotate-45" : "")
                  }
                />
              </span>
            </button>
          </div>
        </nav>

        {/* MOBILE NAVIGATION DROPDOWN */}
        <div
          className={
            "xl:hidden overflow-hidden transition-[max-height,opacity] duration-300 " +
            (open ? "max-h-[720px] opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none")
          }
        >
          <div className="rounded-3xl border border-border bg-card/95 dark:bg-black/95 p-4 shadow-xl backdrop-blur-xl">
            <div className="grid gap-1">
              {links.map((l) => {
                const active =
                  pathname === l.to ||
                  (l.to === "/about-mesac" && pathname.startsWith("/about-mesac")) ||
                  (l.to === "/archive" && pathname.startsWith("/archive"));

                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={
                      "rounded-2xl px-4 py-3 min-h-[44px] flex items-center text-sm font-semibold tracking-wide uppercase transition-colors duration-150 " +
                      (active
                        ? "bg-secondary text-foreground font-bold"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
                    }
                  >
                    {l.label}
                  </Link>
                );
              })}
              {/* Nested Team link under About MESAC for mobile */}
              <Link
                to="/about-mesac/team"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-2.5 min-h-[44px] text-xs font-semibold tracking-wide uppercase text-amber-400/90 pl-8 flex items-center gap-2 hover:bg-secondary/40 transition-colors duration-150"
              >
                <Users className="h-3.5 w-3.5" />
                <span>→ Executive Committee & Team</span>
              </Link>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-2xl gradient-gold text-primary px-4 py-3 min-h-[44px] flex items-center justify-center text-sm font-semibold text-center shadow-sm active:scale-95 transition-all duration-150"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
