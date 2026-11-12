import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { CursorGlow } from "./CursorGlow";

export function Layout({
  children,
  hideFooter = false,
}: {
  children: ReactNode;
  hideFooter?: boolean;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <SmoothScroll />
      <CursorGlow />
      <Navbar />
      <main className="relative z-0">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
