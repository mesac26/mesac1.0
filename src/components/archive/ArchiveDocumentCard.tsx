import React from "react";
import { Link } from "@tanstack/react-router";
import type { ArchiveDocument, ArchiveDocumentType } from "@/types";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  BookOpen,
  Award,
  Layers,
  Tag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export interface ArchiveDocumentCardProps {
  document: ArchiveDocument;
  onPreviewClick?: (doc: ArchiveDocument) => void;
  className?: string;
}

export const DOCUMENT_TYPE_LABELS: Record<ArchiveDocumentType, string> = {
  question_paper: "Question Paper",
  syllabus: "Syllabus",
  notes: "Lecture Notes",
  lab_manual: "Lab Manual",
};

export const DOCUMENT_TYPE_STYLES: Record<
  ArchiveDocumentType,
  { badge: string; iconColor: string }
> = {
  question_paper: {
    badge: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    iconColor: "text-amber-500",
  },
  syllabus: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    iconColor: "text-blue-400",
  },
  notes: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  lab_manual: {
    badge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    iconColor: "text-purple-400",
  },
};

export function ArchiveDocumentCard({
  document,
  onPreviewClick,
  className = "",
}: ArchiveDocumentCardProps) {
  const typeStyle = DOCUMENT_TYPE_STYLES[document.type] || DOCUMENT_TYPE_STYLES.question_paper;
  const typeLabel = DOCUMENT_TYPE_LABELS[document.type] || document.type.replace("_", " ");

  const isDownloadAvailable = Boolean(
    document.download?.directDownloadAvailable && document.download?.url,
  );

  const handleDownload = (e: React.MouseEvent) => {
    if (!isDownloadAvailable) {
      e.preventDefault();
      toast.info("Download file source is pending Google Drive storage indexing.");
      return;
    }
    toast.success(`Starting download: ${document.title}`);
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm card-lift transition-all hover:border-gold/50 ${className}`}
    >
      <div>
        {/* TOP ROW: TYPE BADGE & PROGRAM / SEMESTER */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${typeStyle.badge}`}
          >
            <FileText className="h-3 w-3" aria-hidden="true" />
            <span>{typeLabel}</span>
          </span>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-foreground text-[11px]">
              {document.program}
            </span>
            {document.semester && (
              <span className="rounded-md bg-secondary/60 px-2 py-0.5 text-muted-foreground text-[11px]">
                {typeof document.semester === "number"
                  ? `Sem ${document.semester}`
                  : document.semester}
              </span>
            )}
          </div>
        </div>

        {/* DOCUMENT TITLE */}
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-gold transition-colors">
          <Link
            to="/archive/$documentId"
            params={{ documentId: document.id }}
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-gold rounded"
          >
            {document.title}
          </Link>
        </h3>

        {/* SUBJECT & CODE */}
        <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden="true" />
          <span className="text-foreground font-semibold line-clamp-1">{document.subject}</span>
          {document.subjectCode && (
            <span className="font-mono text-[11px] text-muted-foreground shrink-0">
              ({document.subjectCode})
            </span>
          )}
        </div>

        {/* METADATA CHIPS (SCHEME & EXAM SESSION) */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {document.scheme && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/40 border border-border/60 px-2 py-0.5">
              <Layers className="h-3 w-3 text-gold/80" aria-hidden="true" />
              <span>{document.scheme}</span>
            </span>
          )}

          {(document.examYear || document.examMonth) && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/40 border border-border/60 px-2 py-0.5">
              <Calendar className="h-3 w-3 text-gold/80" aria-hidden="true" />
              <span>
                {document.examMonth ? `${document.examMonth} ` : ""}
                {document.examYear || ""}
              </span>
            </span>
          )}

          {document.preview?.fileSize && (
            <span className="text-muted-foreground/80 px-1">{document.preview.fileSize}</span>
          )}
        </div>

        {/* TAGS */}
        {document.tags && document.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
            {document.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/90 bg-secondary/30 rounded px-1.5 py-0.5"
              >
                <Tag className="h-2.5 w-2.5 text-gold/70" aria-hidden="true" />
                <span>{tag}</span>
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{document.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BUTTONS */}
      <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between gap-2">
        <Link
          to="/archive/$documentId"
          params={{ documentId: document.id }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px] cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
          <span>View Details</span>
        </Link>

        {isDownloadAvailable ? (
          <a
            href={document.download.url}
            target="_blank"
            rel="noreferrer"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl gradient-gold text-primary font-bold px-3.5 py-2 text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all min-h-[40px] cursor-pointer"
            title="Download PDF document"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 text-muted-foreground px-3 py-2 text-xs font-medium min-h-[40px] cursor-not-allowed opacity-80"
            title="File download pending indexing"
          >
            <Download className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            <span>Unavailable</span>
          </button>
        )}
      </div>
    </article>
  );
}
