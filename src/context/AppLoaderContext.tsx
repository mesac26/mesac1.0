import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import { Single3DRealisticGear } from "../components/Single3DRealisticGear";

export interface AppLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const AppLoaderContext = createContext<AppLoaderContextType>({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export function useAppLoader() {
  const context = useContext(AppLoaderContext);
  if (!context) {
    throw new Error("useAppLoader must be used within an AppLoaderProvider");
  }
  return context;
}

interface AppLoaderProviderProps {
  children: ReactNode;
}

/**
 * AppLoaderProvider:
 * Centralized context that manages the 3D gear transition overlay.
 * Appears reliably EVERY SINGLE TIME the user navigates between pages:
 * 1. Instantly captures link clicks and route changes.
 * 2. Centers the authentic 3D steel gear with dark frosted blur.
 * 3. Smoothly resets and dismisses once the new page content has rendered.
 */
export function AppLoaderProvider({ children }: AppLoaderProviderProps) {
  const { pathname, isPending } = useRouterState({
    select: (s) => ({
      pathname: s.location.pathname,
      isPending: s.status === "pending" || s.isLoading,
    }),
  });

  const [active, setActive] = useState(false);
  const [fading, setFading] = useState(false);

  const prevPathRef = useRef(pathname);
  const activeRef = useRef(false);
  const holdTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);

  const clearAllTimers = useCallback(() => {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (watchdogTimerRef.current) window.clearTimeout(watchdogTimerRef.current);
    holdTimerRef.current = null;
    fadeTimerRef.current = null;
    watchdogTimerRef.current = null;
  }, []);

  const triggerTransition = useCallback(() => {
    clearAllTimers();
    activeRef.current = true;
    setActive(true);
    setFading(false);

    // Keep gear rotating smoothly (~280ms) to conceal transition lag and render content
    holdTimerRef.current = window.setTimeout(() => {
      setFading(true);
      fadeTimerRef.current = window.setTimeout(() => {
        activeRef.current = false;
        setActive(false);
        setFading(false);
      }, 160);
    }, 280);

    // Hard safety watchdog: guarantees overlay dismisses within 650ms max
    watchdogTimerRef.current = window.setTimeout(() => {
      setFading(true);
      window.setTimeout(() => {
        activeRef.current = false;
        setActive(false);
        setFading(false);
      }, 140);
    }, 650);
  }, [clearAllTimers]);

  const showLoader = useCallback(() => {
    triggerTransition();
  }, [triggerTransition]);

  const hideLoader = useCallback(() => {
    if (!activeRef.current) return;
    setFading(true);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      activeRef.current = false;
      setActive(false);
      setFading(false);
    }, 140);
  }, []);

  // 1. Initial Page Load Transition
  useEffect(() => {
    triggerTransition();
  }, [triggerTransition]);

  // 2. Trigger on EVERY Route / Page Change
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      triggerTransition();
    }
  }, [pathname, triggerTransition]);

  // 3. Trigger when Router enters Pending State (e.g. async components / data loaders)
  useEffect(() => {
    if (isPending && !activeRef.current) {
      triggerTransition();
    }
  }, [isPending, triggerTransition]);

  // 4. Instant Link Click Capture: Trigger immediately on user click to any new route
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      // Check if it's an internal route link and not an anchor hash (#) or external
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !target.hasAttribute("download") &&
        target.getAttribute("target") !== "_blank"
      ) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.pathname !== window.location.pathname) {
            triggerTransition();
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [triggerTransition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <AppLoaderContext.Provider value={{ isLoading: active, showLoader, hideLoader }}>
      {children}

      {/* Centralized 3D Gear Transition Overlay */}
      <div
        className={`fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm transition-opacity duration-150 ${
          active && !fading
            ? "opacity-100 pointer-events-auto"
            : fading
              ? "opacity-0 pointer-events-none"
              : "opacity-0 pointer-events-none select-none invisible"
        }`}
        aria-hidden={!active}
        style={{ willChange: "opacity" }}
      >
        <div
          className={`flex flex-col items-center gap-3 transition-transform duration-150 ${
            active && !fading ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Centered Single High-Quality 3D Steel Gear */}
          <div className="relative flex items-center justify-center">
            <Single3DRealisticGear size={135} speedSeconds={2.0} active={active} />
          </div>

          {/* Clean Industrial Typography */}
          <div className="flex flex-col items-center gap-0.5 select-none">
            <span className="font-display text-base sm:text-lg tracking-[0.25em] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-300 drop-shadow-[0_0_12px_rgba(200,225,255,0.4)]">
              MESAC
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-slate-400 font-semibold">
              MECHANICAL ENGINEERING
            </span>
          </div>
        </div>
      </div>
    </AppLoaderContext.Provider>
  );
}
