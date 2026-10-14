import type { ArchiveDocumentType } from "@/types";

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
