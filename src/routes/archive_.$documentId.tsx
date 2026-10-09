import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/EmptyState";
import { DocumentPreviewViewer } from "@/components/archive/DocumentPreviewViewer";
import { ReportProblemModal } from "@/components/archive/ReportProblemModal";
import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_STYLES,
} from "@/components/archive/ArchiveDocumentCard";
import { mockArchiveDocuments } from "@/data/mock/archive";
import type { ArchiveDocument, ArchiveDocumentType } from "@/types";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Layers,
  BookOpen,
  GraduationCap,
  Building2,
  Tag,
  Flag,
  Share2,
  HardDrive,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/archive_/$documentId")({
  head: ({ params }) => {
    const doc = mockArchiveDocuments.find((d) => d.id === params.documentId);
    return {
      meta: [
        {
          title: doc
            ? `${doc.title} — MESAC Academic Archive`
            : "Document Details — MESAC Academic Archive",
        },
        {
          name: "description",
          content: doc
            ? `${doc.title} for ${doc.program} Semester ${doc.semester} under ${doc.scheme}. Access in-browser preview and download.`
            : "View and download official academic documents from the MESAC CUSAT repository.",
        },
        {
          property: "og:title",
          content: doc ? `${doc.title} — MESAC CUSAT` : "Archive Document",
        },
      ],
    };
  },
  component: DocumentDetailPage,
});

function DocumentDetailPage() {
  const { documentId } = Route.useParams();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const documentItem = useMemo(() => {
    return mockArchiveDocuments.find((d) => d.id === documentId);
  }, [documentId]);

  if (!documentItem) {
    return (
      <Layout>
        <div className="py-32 px-4 sm:px-6 mx-auto max-w-4xl">
          <EmptyState
            title="Document Not Found"
            description={`The requested document reference "${documentId}" does not exist in the active academic index.`}
            actionText="Return to Academic Archive"
            onAction={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/archive";
              }
            }}
          />
        </div>
      </Layout>
    );
  }

  const typeStyle = DOCUMENT_TYPE_STYLES[documentItem.type] || DOCUMENT_TYPE_STYLES.question_paper;
  const typeLabel = DOCUMENT_TYPE_LABELS[documentItem.type] || documentItem.type.replace("_", " ");

  const isDownloadAvailable = Boolean(
    documentItem.download?.directDownloadAvailable && documentItem.download?.url,
  );

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Document link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!isDownloadAvailable) {
      toast.info("Download is pending official storage indexing by MESAC maintainers.");
      return;
    }
    toast.success(`Starting download: ${documentItem.title}`);
  };

  return (
    <Layout>
      <div className="pt-28 sm:pt-32 pb-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* TOP NAVIGATION & ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Archive</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px] cursor-pointer"
                title="Copy shareable link to this document"
              >
                <Share2 className="h-3.5 w-3.5 text-gold" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px] cursor-pointer"
                title="Report issue with this document"
              >
                <Flag className="h-3.5 w-3.5 text-gold" />
                <span>Report Problem</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT HEADER BANNER */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${typeStyle.badge}`}
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{typeLabel}</span>
              </span>

              <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-foreground">
                {documentItem.program} ·{" "}
                {typeof documentItem.semester === "number"
                  ? `Semester ${documentItem.semester}`
                  : documentItem.semester}
              </span>

              {documentItem.scheme && (
                <span className="rounded-full bg-secondary/60 border border-border/60 px-3 py-0.5 text-xs text-muted-foreground">
                  {documentItem.scheme}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
              {documentItem.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
                <span className="font-semibold text-foreground">{documentItem.subject}</span>
                {documentItem.subjectCode && (
                  <span className="font-mono text-xs text-muted-foreground">
                    ({documentItem.subjectCode})
                  </span>
                )}
              </div>

              {(documentItem.examYear || documentItem.examMonth) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
                  <span>
                    Exam Session: {documentItem.examMonth ? `${documentItem.examMonth} ` : ""}
                    {documentItem.examYear || ""}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
                <span>{documentItem.department}</span>
              </div>
            </div>
          </div>

          {/* MAIN GRID: PREVIEW VIEWER & METADATA DETAILS */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* LEFT / CENTER: PDF PREVIEW VIEWER */}
            <div className="lg:col-span-8">
              <DocumentPreviewViewer
                document={documentItem}
                onReportProblem={() => setIsReportModalOpen(true)}
              />
            </div>

            {/* RIGHT SIDEBAR: DOCUMENT SPECIFICATIONS & DOWNLOAD */}
            <div className="lg:col-span-4 space-y-6">
              {/* PRIMARY DOWNLOAD CARD */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
                <h3 className="font-display text-base font-bold text-foreground mb-4">
                  Document Actions
                </h3>

                <div className="space-y-3">
                  {isDownloadAvailable ? (
                    <a
                      href={documentItem.download.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleDownload}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-gold text-primary font-bold px-5 py-3 text-sm shadow-md hover:brightness-105 active:scale-95 transition-all min-h-[44px]"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download File</span>
                    </a>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-muted/40 text-muted-foreground px-5 py-3 text-sm font-semibold cursor-not-allowed min-h-[44px]"
                      >
                        <Download className="h-4 w-4 opacity-50" />
                        <span>Download Unavailable</span>
                      </button>
                      <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
                        This file is registered in the metadata index but awaiting cloud repository
                        syncing.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[42px] cursor-pointer"
                  >
                    <Flag className="h-3.5 w-3.5 text-gold" />
                    <span>Report Missing/Incorrect File</span>
                  </button>
                </div>

                <div className="mt-5 pt-4 border-t border-border/80 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Verified Academic Source</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  {documentItem.download?.downloadCount && (
                    <div className="flex items-center justify-between">
                      <span>Total Downloads</span>
                      <span className="font-semibold text-foreground">
                        {documentItem.download.downloadCount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILED SPECIFICATIONS */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
                <h3 className="font-display text-base font-bold text-foreground mb-4">
                  Archive Specifications
                </h3>

                <dl className="space-y-3 text-xs">
                  {documentItem.department && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Department</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.department}
                      </dd>
                    </div>
                  )}

                  {documentItem.program && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Program & Degree</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.program}
                      </dd>
                    </div>
                  )}

                  {documentItem.semester && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Semester</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {typeof documentItem.semester === "number"
                          ? `Semester ${documentItem.semester}`
                          : documentItem.semester}
                      </dd>
                    </div>
                  )}

                  {documentItem.subject && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Subject</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.subject}
                      </dd>
                    </div>
                  )}

                  {documentItem.subjectCode && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Subject Code</dt>
                      <dd className="font-mono font-semibold text-foreground text-right">
                        {documentItem.subjectCode}
                      </dd>
                    </div>
                  )}

                  {documentItem.scheme && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Curriculum Scheme</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.scheme}
                      </dd>
                    </div>
                  )}

                  {(documentItem.examYear || documentItem.examMonth) && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">Examination Term</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.examMonth ? `${documentItem.examMonth} ` : ""}
                        {documentItem.examYear || ""}
                      </dd>
                    </div>
                  )}

                  {documentItem.preview?.fileSize && (
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <dt className="text-muted-foreground">File Size</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.preview.fileSize}
                      </dd>
                    </div>
                  )}

                  {documentItem.preview?.pageCount && (
                    <div className="flex justify-between py-1">
                      <dt className="text-muted-foreground">Page Count</dt>
                      <dd className="font-semibold text-foreground text-right">
                        {documentItem.preview.pageCount} Pages
                      </dd>
                    </div>
                  )}
                </dl>

                {/* TAGS */}
                {documentItem.tags && documentItem.tags.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border/80">
                    <span className="block text-[11px] font-semibold text-muted-foreground mb-2">
                      Academic Index Tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {documentItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[11px] text-foreground bg-secondary/80 border border-border/80 rounded-md px-2 py-0.5"
                        >
                          <Tag className="h-3 w-3 text-gold" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT PROBLEM MODAL */}
      <ReportProblemModal
        document={documentItem}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </Layout>
  );
}
