import React, { useState, useEffect } from "react";
import type { ArchiveDocument } from "@/types";
import { AlertTriangle, CheckCircle2, X, Send, Loader2 } from "lucide-react";

export interface ReportProblemModalProps {
  document: ArchiveDocument;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportProblemModal({ document, isOpen, onClose }: ReportProblemModalProps) {
  const [problemType, setProblemType] = useState<string>("incorrect_metadata");
  const [description, setDescription] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const prevOverflow = typeof window !== "undefined" ? window.document.body.style.overflow : "";
    window.document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setDescription("");
      setContactEmail("");
      setProblemType("incorrect_metadata");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Frontend-only simulation (no API, no database, no localStorage)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in text-foreground"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-border bg-secondary text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 id="report-modal-title" className="font-display text-2xl font-bold text-foreground">
              Report Recorded (Prototype)
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Your report was recorded in this prototype. In production, issue reports are routed to
              MESAC academic archive student maintainers to verify and refresh repository files.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl gradient-gold text-primary font-bold px-6 py-2.5 text-xs sm:text-sm min-h-[42px] hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="report-modal-title"
                  className="font-display text-xl font-bold text-foreground"
                >
                  Report a Problem
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  Document: <span className="font-semibold text-foreground">{document.title}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label
                  htmlFor="report-problem-type"
                  className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                >
                  Issue Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="report-problem-type"
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[42px] cursor-pointer"
                >
                  <option value="incorrect_metadata">Incorrect Subject, Semester, or Code</option>
                  <option value="wrong_year_scheme">Wrong Exam Year or Scheme</option>
                  <option value="corrupted_file">Corrupted or Illegible Pages</option>
                  <option value="missing_pages">Missing Question Pages / Incomplete File</option>
                  <option value="broken_link">Broken Preview or Download Link</option>
                  <option value="other">Other Academic Discrepancy</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="report-description"
                  className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                >
                  Details & Clarification <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="report-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue (e.g. Page 3 is rotated/missing, or this is 2015 Scheme instead of 2019)..."
                  className="w-full rounded-xl border border-input bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[90px] placeholder:text-muted-foreground/70"
                />
              </div>

              <div>
                <label
                  htmlFor="report-email"
                  className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                >
                  Your Email{" "}
                  <span className="text-muted-foreground/60 text-[10px] lowercase">
                    (optional, for updates)
                  </span>
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. student@cusat.ac.in"
                  className="w-full rounded-xl border border-input bg-card/60 px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[40px] placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-secondary/80 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl gradient-gold text-primary font-bold px-5 py-2 text-xs sm:text-sm min-h-[40px] hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
