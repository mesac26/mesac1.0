import React, { useState } from "react";
import type { ArchiveDocument } from "@/types";
import {
  FileText,
  Download,
  AlertCircle,
  ExternalLink,
  Maximize2,
  FileQuestion,
  ShieldCheck,
  Flag,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

export interface DocumentPreviewViewerProps {
  document: ArchiveDocument;
  onReportProblem?: () => void;
  className?: string;
}

export function DocumentPreviewViewer({
  document,
  onReportProblem,
  className = "",
}: DocumentPreviewViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previewUrl = document.preview?.url;
  const isPreviewAvailable = Boolean(previewUrl && previewUrl.trim().length > 0);
  const isDownloadAvailable = Boolean(
    document.download?.directDownloadAvailable && document.download?.url,
  );

  const handleDownloadClick = () => {
    if (!isDownloadAvailable) {
      toast.info("Download is pending official storage indexing by MESAC maintainers.");
      return;
    }
    toast.success(`Starting download: ${document.title}`);
  };

  return (
    <div
      className={`rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm flex flex-col ${className}`}
    >
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-card/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground line-clamp-1">
              Document Preview
            </span>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              {document.preview?.pageCount && <span>{document.preview.pageCount} Pages</span>}
              {document.preview?.fileSize && (
                <>
                  <span>•</span>
                  <span>{document.preview.fileSize}</span>
                </>
              )}
              {document.scheme && (
                <>
                  <span>•</span>
                  <span>{document.scheme}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPreviewAvailable && (
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer min-h-[36px]"
              title={isFullscreen ? "Exit full view" : "Expand preview"}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isFullscreen ? "Collapse" : "Expand"}</span>
            </button>
          )}

          {isDownloadAvailable ? (
            <a
              href={document.download.url}
              target="_blank"
              rel="noreferrer"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-1.5 rounded-xl gradient-gold text-primary font-bold px-3.5 py-1.5 text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all min-h-[36px]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/50 text-muted-foreground px-3.5 py-1.5 text-xs font-medium cursor-not-allowed min-h-[36px]"
              title="Download unavailable for this preview record"
            >
              <Download className="h-3.5 w-3.5 opacity-60" />
              <span>Download Unavailable</span>
            </button>
          )}

          {onReportProblem && (
            <button
              type="button"
              onClick={onReportProblem}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer min-h-[36px]"
              title="Report a problem with this file"
            >
              <Flag className="h-3 w-3" />
              <span className="hidden md:inline">Report</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEWER CANVAS */}
      <div
        className={`relative w-full bg-neutral-950/90 transition-all ${
          isFullscreen ? "h-[750px] sm:h-[850px]" : "h-[450px] sm:h-[550px]"
        }`}
      >
        {isPreviewAvailable ? (
          <div className="relative h-full w-full">
            <iframe
              src={previewUrl}
              title={`Preview of ${document.title}`}
              className="h-full w-full border-0"
              loading="lazy"
              allow="autoplay"
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white/80">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold mb-4 border border-white/10">
              <FileQuestion className="h-7 w-7" aria-hidden="true" />
            </div>
            <h4 className="font-display text-lg sm:text-xl font-bold text-white">
              Preview Unavailable
            </h4>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-white/70 leading-relaxed">
              An interactive in-browser preview is currently unavailable for this document.
              {isDownloadAvailable
                ? " You can still download the complete file directly using the download button above."
                : " File synchronization from the academic Drive repository is currently pending for this record."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {isDownloadAvailable && (
                <a
                  href={document.download.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleDownloadClick}
                  className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-4 py-2 text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all min-h-[40px]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Document</span>
                </a>
              )}

              {onReportProblem && (
                <button
                  type="button"
                  onClick={onReportProblem}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 text-white px-4 py-2 text-xs font-semibold hover:bg-white/20 transition-colors min-h-[40px] cursor-pointer"
                >
                  <Flag className="h-3.5 w-3.5 text-gold" />
                  <span>Report Missing Preview</span>
                </button>
              )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-[11px] text-white/50 border-t border-white/10 pt-4 max-w-sm">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
              <span>
                MESAC Academic Repository · Verified syllabus, question papers & lab guides
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NOTICE */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-card px-4 py-2.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileCheck className="h-3.5 w-3.5 text-gold shrink-0" />
          <span>
            {document.subject} ({document.subjectCode || "N/A"}) · {document.program}{" "}
            {document.semester ? `Sem ${document.semester}` : ""}
          </span>
        </div>

        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-gold hover:underline font-medium ml-auto"
          >
            <span>Open in new tab</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
