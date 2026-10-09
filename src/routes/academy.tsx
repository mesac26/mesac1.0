import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { GpaCalculator } from "@/components/GpaCalculator";
import { EmptyState } from "@/components/EmptyState";
import {
  Download,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Clock,
  Code,
  X,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { mockAcademyTracks } from "@/data/mock/academy";
import type { AcademyTrack } from "@/types";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Academy & Skill Tracks — MESAC CUSAT" },
      {
        name: "description",
        content:
          "The MESAC Academy — hands-on skill tracks in CAD, FEA, CFD, CNC machining, robotics, and career guidance for mechanical engineers.",
      },
      { property: "og:title", content: "MESAC Academy — CUSAT" },
      {
        property: "og:description",
        content:
          "Learn the tools of modern mechanical engineering. Calculate GPA with CUSAT grading standards.",
      },
    ],
  }),
  component: AcademyPage,
});

interface EnrollmentFormValues {
  name: string;
  email: string;
  phone: string;
  semesterBranch: string;
  trackId: string;
  statement: string;
}

interface EnrollmentFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  semesterBranch?: string;
}

const INITIAL_FORM: EnrollmentFormValues = {
  name: "",
  email: "",
  phone: "",
  semesterBranch: "Semester 5 B.Tech Mechanical Engineering",
  trackId: "",
  statement: "",
};

export function AcademyPage() {
  // Track Detail Modal state
  const [detailTrack, setDetailTrack] = useState<AcademyTrack | null>(null);

  // Enrollment Modal state
  const [enrollingTrack, setEnrollingTrack] = useState<AcademyTrack | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormValues>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<EnrollmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [lastSubmittedTrackTitle, setLastSubmittedTrackTitle] = useState("");

  // Track filter state
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Synchronize form's trackId when an enrolling track is chosen
  useEffect(() => {
    if (enrollingTrack) {
      setFormData((prev) => ({
        ...prev,
        trackId: enrollingTrack.id,
      }));
      setFormErrors({});
      setSubmitted(false);
    }
  }, [enrollingTrack]);

  // Handle ESC key and body overflow lock for modals
  useEffect(() => {
    const isAnyModalOpen = Boolean(detailTrack || enrollingTrack);
    if (!isAnyModalOpen) return;

    const prevOverflow = typeof window !== "undefined" ? window.document.body.style.overflow : "";
    if (typeof window !== "undefined") {
      window.document.body.style.overflow = "hidden";
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailTrack(null);
        setEnrollingTrack(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (typeof window !== "undefined") {
        window.document.body.style.overflow = prevOverflow;
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [detailTrack, enrollingTrack]);

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockAcademyTracks.filter((t) => {
      const matchesLevel = selectedLevel === "All" || t.level === selectedLevel;
      if (!matchesLevel) return false;

      if (!q) return true;

      const title = t.title || t.t || "";
      const desc = t.description || t.d || "";
      const tools = t.tools ? t.tools.join(" ") : "";
      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        tools.toLowerCase().includes(q)
      );
    });
  }, [selectedLevel, searchQuery]);

  // ==========================================
  // CLIENT-SIDE ENROLLMENT FORM VALIDATION
  // ==========================================
  const validateForm = (): boolean => {
    const errors: EnrollmentFormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errors.phone = "Phone / WhatsApp number is required.";
    } else if (phoneDigits.length < 10) {
      errors.phone = "Please enter a valid phone number (at least 10 digits).";
    }

    if (!formData.semesterBranch.trim()) {
      errors.semesterBranch = "Please enter your current semester and branch.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate realistic frontend submission without external APIs
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      const chosenTrack =
        mockAcademyTracks.find((t) => t.id === formData.trackId) || enrollingTrack;
      const trackTitle = chosenTrack?.title || chosenTrack?.t || "Selected Track";
      setLastSubmittedName(formData.name.trim());
      setLastSubmittedTrackTitle(trackTitle);

      toast.success("Interest Recorded (Prototype)", {
        description: `Your interest in ${trackTitle} has been noted in this frontend prototype.`,
      });
    }, 450);
  };

  const handleOpenEnrollFromDetail = (track: AcademyTrack) => {
    setDetailTrack(null);
    setEnrollingTrack(track);
  };

  return (
    <Layout>
      <PageHero
        variant="academic"
        eyebrow="Academy & GPA Tools"
        title={
          <>
            Calculate GPA. <span className="italic text-gold">Master the tools.</span> Build the
            future.
          </>
        }
        subtitle="Calculate your Semester GPA and Cumulative CGPA with CUSAT grading standards, or explore MESAC Academy skill development tracks."
      />

      {/* GPA & CGPA CALCULATOR SECTION */}
      <section id="calculator" className="py-12 sm:py-16 bg-background border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GpaCalculator />
        </div>
      </section>

      {/* ACADEMY SKILL TRACKS HEADER & CONTROLS */}
      <section id="tracks" className="py-16 sm:py-24 relative overflow-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          {/* Section Introduction */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gold">
                <Layers className="h-4 w-4" />
                <span>Industry Immersion & Hands-on Training</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                MESAC Academy <span className="italic text-gold">Skill Tracks</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Six dedicated skill advancement tracks tailored for mechanical engineering
                undergraduates. Bridging theoretical engineering science and industry-grade CAD,
                simulation, CNC, and robotics practices.
              </p>
            </div>

            <div className="text-xs font-mono text-muted-foreground self-start md:self-auto">
              Total tracks:{" "}
              <span className="text-foreground font-bold">
                {mockAcademyTracks.length} Official Tracks
              </span>
            </div>
          </div>

          {/* Controls: Search & Level Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Level Selector */}
            <div
              role="group"
              aria-label="Filter tracks by level"
              className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border/80 self-start sm:self-auto overflow-x-auto"
            >
              {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedLevel === lvl
                      ? "gradient-gold text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, tools, CAD..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* TRACKS GRID */}
          {filteredTracks.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTracks.map((track, idx) => {
                const trackNumber = track.n || String(idx + 1).padStart(2, "0");
                const trackTitle = track.title || track.t;
                const trackDesc = track.description || track.d;
                const toolsList = track.tools || [];
                const pdfLink = track.pdfUrl;

                return (
                  <Reveal key={track.id} delay={idx * 50}>
                    <article className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-8 card-lift h-full transition-all duration-300 hover:border-gold/40">
                      <div>
                        {/* Top Metadata Strip */}
                        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-4">
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
                            TRACK {trackNumber}
                          </span>
                          <div className="flex items-center gap-2">
                            {track.level && (
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                {track.level}
                              </span>
                            )}
                            <span className="text-[11px] font-mono font-bold text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full">
                              {track.duration}
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="mt-5 font-display text-2xl sm:text-3xl font-bold leading-tight text-foreground group-hover:text-gold transition-colors">
                          {trackTitle}
                        </h3>
                        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {trackDesc}
                        </p>

                        {/* Software & Tools Tag List */}
                        {toolsList.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-border/60">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 block mb-2">
                              Tools & Software Covered:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {toolsList.map((tool) => (
                                <span
                                  key={tool}
                                  className="rounded-lg border border-border/80 bg-secondary/50 px-2 py-1 text-[11px] font-medium text-foreground"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Actions Footer */}
                      <div className="mt-8 pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-2">
                        {/* Detail View trigger */}
                        <button
                          type="button"
                          onClick={() => setDetailTrack(track)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-gold" />
                          <span>View Details</span>
                        </button>

                        <div className="flex items-center gap-2 ml-auto">
                          {/* Curriculum PDF (verified link only) */}
                          {pdfLink && (
                            <a
                              href={pdfLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-gold bg-secondary/50 hover:bg-secondary px-2.5 py-1.5 rounded-lg border border-border transition"
                              title="Download official CUSAT curriculum/manual"
                            >
                              <Download className="h-3 w-3" />
                              <span>PDF</span>
                            </a>
                          )}

                          {/* Enroll Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setEnrollingTrack(track);
                              setSubmitted(false);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl gradient-gold text-primary font-bold px-3.5 py-1.5 text-xs shadow-sm hover:brightness-105 active:scale-95 transition cursor-pointer"
                          >
                            <span>Enroll Interest</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No Academy Tracks Found"
              description="No tracks match the selected level filter or search keywords. Try adjusting your query."
              actionText="Reset Filters"
              onAction={() => {
                setSelectedLevel("All");
                setSearchQuery("");
              }}
            />
          )}
        </div>
      </section>

      {/* ========================================================
          TRACK DETAILS MODAL
          ======================================================== */}
      {detailTrack && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="track-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDetailTrack(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-2xl text-foreground flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDetailTrack(null)}
              aria-label="Close track details"
              className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground border border-border transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
                  Track {detailTrack.n || detailTrack.trackCode}
                </span>
                {detailTrack.level && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    · {detailTrack.level} Level
                  </span>
                )}
                {detailTrack.duration && (
                  <span className="text-xs font-mono text-muted-foreground">
                    · {detailTrack.duration}
                  </span>
                )}
              </div>
              <h2
                id="track-detail-title"
                className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-snug"
              >
                {detailTrack.title || detailTrack.t}
              </h2>
            </div>

            {/* Description */}
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-300">
              <p>{detailTrack.description || detailTrack.d}</p>
            </div>

            {/* Modules Covered (if available) */}
            {detailTrack.modules && detailTrack.modules.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border/80">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gold mb-3 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Curriculum & Laboratory Modules</span>
                </h4>
                <ul className="space-y-2">
                  {detailTrack.modules.map((mod, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-gold text-[10px] font-mono font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tools Covered (if available) */}
            {detailTrack.tools && detailTrack.tools.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border/80">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gold mb-3 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" />
                  <span>Software Tools & Standards</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detailTrack.tools.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-xl bg-secondary border border-border text-xs font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
              {detailTrack.pdfUrl ? (
                <a
                  href={detailTrack.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground font-semibold px-4 py-2.5 text-xs border border-border transition min-h-[40px]"
                >
                  <Download className="h-3.5 w-3.5 text-gold" />
                  <span>Download Curriculum PDF</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => handleOpenEnrollFromDetail(detailTrack)}
                className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-5 py-2.5 text-xs shadow-sm hover:brightness-105 active:scale-95 transition min-h-[40px] cursor-pointer"
              >
                <span>Enroll Interest for Track</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ENROLLMENT MODAL (FRONTEND-ONLY)
          ======================================================== */}
      {enrollingTrack && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enrollment-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setEnrollingTrack(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => setEnrollingTrack(null)}
              className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground border border-border transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              /* FRONTEND SUCCESS STATE */
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    Frontend Prototype Recorded
                  </span>
                  <h3
                    id="enrollment-modal-title"
                    className="font-display text-2xl sm:text-3xl font-bold"
                  >
                    Interest Recorded!
                  </h3>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed text-left space-y-2">
                  <p>
                    Thank you, <strong className="text-foreground">{lastSubmittedName}</strong>!
                    Your registration interest for{" "}
                    <strong className="text-gold">{lastSubmittedTrackTitle}</strong> has been
                    received in this frontend prototype.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When official batch registrations open for the semester, notifications and
                    classroom links will be shared via official MESAC announcements.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData(INITIAL_FORM);
                    }}
                    className="rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-4 py-2.5 text-xs transition cursor-pointer"
                  >
                    Register for Another Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnrollingTrack(null)}
                    className="rounded-xl gradient-gold text-primary font-bold px-6 py-2.5 text-xs shadow-sm hover:brightness-105 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* FRONTEND ENROLLMENT FORM */
              <form onSubmit={handleEnrollSubmit} noValidate className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold block">
                    MESAC Academy · Course Interest Registration
                  </span>
                  <h3
                    id="enrollment-modal-title"
                    className="font-display text-2xl font-bold mt-1 text-foreground"
                  >
                    {enrollingTrack.title || enrollingTrack.t}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{enrollingTrack.duration}</span>
                    {enrollingTrack.level && <span>· {enrollingTrack.level}</span>}
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  {/* Track Selection Dropdown */}
                  <div>
                    <label
                      htmlFor="form-track-select"
                      className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                    >
                      Selected Skill Track <span className="text-gold">*</span>
                    </label>
                    <select
                      id="form-track-select"
                      value={formData.trackId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        const matched = mockAcademyTracks.find((t) => t.id === newId);
                        setFormData((prev) => ({ ...prev, trackId: newId }));
                        if (matched) setEnrollingTrack(matched);
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-gold transition cursor-pointer min-h-[42px]"
                    >
                      {mockAcademyTracks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title || t.t} ({t.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student Full Name */}
                  <div>
                    <label
                      htmlFor="student-name"
                      className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                    >
                      Student Full Name <span className="text-gold">*</span>
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        if (formErrors.name)
                          setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="e.g. Sandra VM"
                      aria-invalid={Boolean(formErrors.name)}
                      aria-describedby={formErrors.name ? "name-error" : undefined}
                      className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                        formErrors.name ? "border-red-500/80" : "border-border"
                      }`}
                    />
                    {formErrors.name && (
                      <p
                        id="name-error"
                        className="mt-1 text-xs text-red-400 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="student-email"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Email Address <span className="text-gold">*</span>
                      </label>
                      <input
                        id="student-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          if (formErrors.email)
                            setFormErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="sandra@cusat.ac.in"
                        aria-invalid={Boolean(formErrors.email)}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                        className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                          formErrors.email ? "border-red-500/80" : "border-border"
                        }`}
                      />
                      {formErrors.email && (
                        <p
                          id="email-error"
                          className="mt-1 text-[11px] text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="student-phone"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Phone / WhatsApp <span className="text-gold">*</span>
                      </label>
                      <input
                        id="student-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, phone: e.target.value }));
                          if (formErrors.phone)
                            setFormErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="+91 98470 12345"
                        aria-invalid={Boolean(formErrors.phone)}
                        aria-describedby={formErrors.phone ? "phone-error" : undefined}
                        className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                          formErrors.phone ? "border-red-500/80" : "border-border"
                        }`}
                      />
                      {formErrors.phone && (
                        <p
                          id="phone-error"
                          className="mt-1 text-[11px] text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Semester & Branch */}
                  <div>
                    <label
                      htmlFor="student-sem"
                      className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                    >
                      Semester & Branch <span className="text-gold">*</span>
                    </label>
                    <input
                      id="student-sem"
                      type="text"
                      required
                      value={formData.semesterBranch}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, semesterBranch: e.target.value }));
                        if (formErrors.semesterBranch) {
                          setFormErrors((prev) => ({ ...prev, semesterBranch: undefined }));
                        }
                      }}
                      placeholder="e.g. S5 B.Tech Mechanical Engineering"
                      aria-invalid={Boolean(formErrors.semesterBranch)}
                      aria-describedby={formErrors.semesterBranch ? "sem-error" : undefined}
                      className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                        formErrors.semesterBranch ? "border-red-500/80" : "border-border"
                      }`}
                    />
                    {formErrors.semesterBranch && (
                      <p
                        id="sem-error"
                        className="mt-1 text-xs text-red-400 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>{formErrors.semesterBranch}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  {enrollingTrack.pdfUrl ? (
                    <a
                      href={enrollingTrack.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-gold flex items-center gap-1.5 transition"
                    >
                      <FileText className="h-3.5 w-3.5 text-gold" />
                      <span>Curriculum PDF</span>
                    </a>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setEnrollingTrack(null)}
                      className="rounded-xl border border-border bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground font-medium px-4 py-2.5 text-xs transition cursor-pointer min-h-[38px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl gradient-gold text-primary font-bold px-6 py-2.5 text-xs shadow-glass hover:brightness-105 active:scale-95 transition cursor-pointer min-h-[38px] disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          <span>Recording...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Interest</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
