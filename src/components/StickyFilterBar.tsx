import { useEffect, useRef, useState, type ReactNode } from "react";

interface StickyFilterBarProps {
  children: ReactNode;
  className?: string;
  topOffset?: number; // Distance in px from the top of the viewport (default: 74px for Navbar)
  id?: string;
  "aria-label"?: string;
}

/**
 * StickyFilterBar:
 * Reusable, responsive sticky container for page filter controls, search bars, and tab switchers.
 * - Dynamically measures its exact occupied height using ResizeObserver (accounting for desktop, tablet,
 *   mobile, filter wrapping, and search bar line breaks).
 * - Maintains proper document flow without causing layout shift or content clipping.
 * - Stays pinned at topOffset (below the floating Navbar) with clean backdrop blur and border.
 * - Sets the CSS custom property `--sticky-filter-height` so adjacent content sections can establish
 *   the exact layout relationship and scroll-margin.
 */
export function StickyFilterBar({
  children,
  className = "",
  topOffset = 74,
  id,
  "aria-label": ariaLabel,
}: StickyFilterBarProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      const h = el.offsetHeight;
      if (h > 0) {
        setMeasuredHeight(h);
        document.documentElement.style.setProperty("--sticky-filter-height", `${h}px`);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        updateHeight();
      });
      observer.observe(el);
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id={id}
      aria-label={ariaLabel}
      style={{
        top: `${topOffset}px`,
      }}
      className={`sticky z-30 w-full transition-[top,background-color] duration-200 ${className}`}
    >
      {children}
    </section>
  );
}
