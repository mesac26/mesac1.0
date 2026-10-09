import { Link } from "@tanstack/react-router";
import { Linkedin } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white/80 border-t border-white/10 transition-colors">
      {/* BACKGROUND ACCENTS — FULL BLACK WITH AMBER ACCENT */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl bg-neutral-900" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full blur-3xl bg-amber-500/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* LEFT COLUMN: ONLY LOGOS (CUSAT SOE, INSTAGRAM, LINKEDIN) — NO WRITING */}
          <div className="flex items-center gap-4">
            {/* CUSAT / SOE LOGO */}
            <a
              href="https://soe.cusat.ac.in"
              target="_blank"
              rel="noreferrer"
              aria-label="School of Engineering, CUSAT Website"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-white/40 p-1.5 shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110 hover:border-amber-400/80"
              title="School of Engineering, Cochin University of Science and Technology (CUSAT)"
            >
              <img
                src="/cusat-crest.png"
                alt="Cochin University of Science and Technology (CUSAT) Official Emblem"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </a>

            {/* INSTAGRAM LOGO */}
            <a
              href="https://www.instagram.com/mesa_cusat?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              aria-label="MESAC CUSAT Instagram Profile"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-rose-950/40 transition-transform duration-200 hover:scale-110"
              title="MESAC Instagram"
            >
              <InstagramIcon className="h-6 w-6 text-white" />
            </a>

            {/* LINKEDIN LOGO */}
            <a
              href="https://www.linkedin.com/company/mesa-cusat"
              target="_blank"
              rel="noreferrer"
              aria-label="MESAC CUSAT LinkedIn Organization Page"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0077b5] shadow-lg shadow-sky-950/40 transition-transform duration-200 hover:scale-110"
              title="MESAC LinkedIn"
            >
              <Linkedin className="h-6 w-6 text-white" />
            </a>
          </div>

          {/* RIGHT COLUMN: RESTORED ORIGINAL FOOTER INFO (WITHOUT COCHIN ADDRESS / DIVIDER) */}
          <div className="space-y-2 text-xs text-white/70 leading-relaxed text-center md:text-right">
            <div className="font-semibold text-white">
              Copyright © {new Date().getFullYear()} MESAC CUSAT
            </div>
            <div className="font-medium text-white/90">
              Division of Mechanical Engineering, CUSAT
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 pt-1 text-[11px] text-white/60">
              <Link to="/about" className="hover:text-amber-400 transition">
                About
              </Link>
              <span>·</span>
              <Link to="/contact" className="hover:text-amber-400 transition">
                Contact
              </Link>
              <span>·</span>
              <Link
                to="/about-mesac"
                className="hover:text-white uppercase font-bold text-amber-400"
              >
                DISCLAIMER
              </Link>
              <span>·</span>
              <Link to="/privacy" className="hover:text-amber-400 transition">
                Privacy Policy
              </Link>
            </div>
            <div>All rights reserved</div>
            <div>Designed, Hosted and Maintained by MESAC COMMITTEE</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
