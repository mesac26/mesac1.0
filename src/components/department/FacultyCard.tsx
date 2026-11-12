import type { FacultyMember } from "@/types";
import { Mail, Phone, GraduationCap, Building2 } from "lucide-react";

interface FacultyCardProps {
  faculty: FacultyMember;
}

export function FacultyCard({ faculty }: FacultyCardProps) {
  const initials = faculty.name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm card-lift flex flex-col justify-between hover:border-gold/40 transition-all h-full">
      <div>
        {/* Top Header: Monogram/SlNo and Division Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            {faculty.img ? (
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-border/80 bg-secondary shrink-0">
                <img
                  src={faculty.img}
                  alt={faculty.name}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="h-11 w-11 rounded-xl bg-secondary border border-border/80 flex items-center justify-center font-display font-black text-gold text-sm shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                {initials || "ME"}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                {faculty.department || "Mechanical Engineering"}
              </span>
              {faculty.slNo && (
                <span className="text-[10px] font-mono font-semibold text-gold/90">
                  REF #ME-{faculty.slNo < 10 ? `0${faculty.slNo}` : faculty.slNo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Name and Designation */}
        <h3 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-gold transition-colors">
          {faculty.name}
        </h3>
        <div className="text-xs font-semibold text-gold/95 mt-1">{faculty.role}</div>

        {/* Specialization */}
        {faculty.specialization && (
          <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
            <span className="text-[11px] font-semibold text-foreground/80 block mb-0.5">
              Area of Specialization:
            </span>
            <p className="line-clamp-2">{faculty.specialization}</p>
          </div>
        )}

        {/* Qualification if available */}
        {faculty.qualification && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 text-gold shrink-0" />
            <span>{faculty.qualification}</span>
          </div>
        )}
      </div>

      {/* Contact Section: strictly respects showContact flag for privacy */}
      <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
        {faculty.showContact && (faculty.email || faculty.phone) ? (
          <div className="space-y-1.5">
            {faculty.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                <a
                  href={`mailto:${faculty.email}`}
                  className="hover:text-gold transition truncate font-medium underline-offset-2 hover:underline"
                >
                  {faculty.email}
                </a>
              </div>
            )}
            {faculty.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                <a href={`tel:${faculty.phone}`} className="hover:text-gold transition font-medium">
                  {faculty.phone}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span>Division of Mechanical Engineering, CUSAT</span>
          </div>
        )}
      </div>
    </div>
  );
}
