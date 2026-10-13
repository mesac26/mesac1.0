import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  Edit,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Upload,
  ExternalLink,
  X,
  FileCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { mockArchiveDocuments } from "@/data/mock/archive";
import { mockArchiveHealthIssues, mockArchiveReports } from "@/data/mock/admin";
import type { ArchiveDocument, ArchiveDocumentType } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/archive")({
  head: () => ({
    meta: [
      { title: "Academic Archive Manager — MESAC Admin" },
      {
        name: "description",
        content: "Manage CUSAT Mechanical question papers, syllabi, notes, and academic documents.",
      },
    ],
  }),
  component: AdminArchivePage,
});

export function AdminArchivePage() {
  const [documents, setDocuments] = useState<ArchiveDocument[]>(mockArchiveDocuments);
  const [activeTab, setActiveTab] = useState<"documents" | "health" | "reports">("documents");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedScheme, setSelectedScheme] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ArchiveDocument | null>(null);
  const [replacingDoc, setReplacingDoc] = useState<ArchiveDocument | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ArchiveDocument | null>(null);
  const [isBulkTagModalOpen, setIsBulkTagModalOpen] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [bulkTagInput, setBulkTagInput] = useState("");

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    title: "",
    department: "Mechanical Engineering",
    program: "B.Tech",
    semester: 5,
    subject: "",
    subjectCode: "",
    scheme: "2019 Scheme",
    examYear: 2024,
    examMonth: "Nov/Dec",
    type: "question_paper" as ArchiveDocumentType,
    tags: "",
    driveFileId: "drive-placeholder-id",
  });

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSem = selectedSemester === "all" || doc.semester.toString() === selectedSemester;
      const matchesType = selectedType === "all" || doc.type === selectedType;
      const matchesScheme = selectedScheme === "all" || doc.scheme === selectedScheme;
      const matchesProgram = selectedProgram === "all" || doc.program === selectedProgram;

      return matchesSearch && matchesSem && matchesType && matchesScheme && matchesProgram;
    });
  }, [documents, searchQuery, selectedSemester, selectedType, selectedScheme, selectedProgram]);

  const handleOpenAddModal = () => {
    setFormData({
      title: "",
      department: "Mechanical Engineering",
      program: "B.Tech",
      semester: 5,
      subject: "",
      subjectCode: "",
      scheme: "2019 Scheme",
      examYear: 2024,
      examMonth: "Nov/Dec",
      type: "question_paper",
      tags: "CUSAT, S5, ME",
      driveFileId: "1DriveNewFileId",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (doc: ArchiveDocument) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      department: doc.department,
      program: doc.program,
      semester: typeof doc.semester === "number" ? doc.semester : parseInt(doc.semester) || 1,
      subject: doc.subject,
      subjectCode: doc.subjectCode,
      scheme: doc.scheme,
      examYear: doc.examYear,
      examMonth: doc.examMonth,
      type: doc.type,
      tags: doc.tags.join(", "),
      driveFileId: doc.driveFileId,
    });
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingDoc) {
      // Update existing
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === editingDoc.id
            ? {
                ...d,
                title: formData.title,
                department: formData.department,
                program: formData.program,
                semester: formData.semester,
                subject: formData.subject,
                subjectCode: formData.subjectCode,
                scheme: formData.scheme,
                examYear: formData.examYear,
                examMonth: formData.examMonth,
                type: formData.type,
                tags: tagArray,
              }
            : d,
        ),
      );
      setEditingDoc(null);
    } else {
      // Add new
      const newDoc: ArchiveDocument = {
        id: `doc-${Date.now()}`,
        title:
          formData.title ||
          `${formData.subject} — ${formData.type.replace("_", " ").toUpperCase()}`,
        department: formData.department,
        program: formData.program,
        semester: formData.semester,
        subject: formData.subject,
        subjectCode: formData.subjectCode,
        scheme: formData.scheme,
        examYear: formData.examYear,
        examMonth: formData.examMonth,
        type: formData.type,
        tags: tagArray,
        driveFileId: formData.driveFileId,
        preview: {
          fileType: "pdf",
          fileSize: "1.4 MB",
          pageCount: 4,
        },
        download: {
          directDownloadAvailable: true,
          downloadCount: 0,
        },
      };
      setDocuments((prev) => [newDoc, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingDocId) {
      setDocuments((prev) => prev.filter((d) => d.id !== deletingDocId));
      setDeletingDocId(null);
    }
  };

  const handleBulkTagApply = () => {
    if (!bulkTagInput.trim()) return;
    const newTags = bulkTagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setDocuments((prev) =>
      prev.map((d) => {
        if (selectedDocIds.includes(d.id)) {
          return {
            ...d,
            tags: Array.from(new Set([...d.tags, ...newTags])),
          };
        }
        return d;
      }),
    );
    setSelectedDocIds([]);
    setBulkTagInput("");
    setIsBulkTagModalOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDocIds(filteredDocuments.map((d) => d.id));
    } else {
      setSelectedDocIds([]);
    }
  };

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <AdminPageHeader
          title="Academic Archive Manager"
          description="High-priority repository for university question papers, scheme syllabi, and study notes."
          badge="Launch Priority"
        >
          <div className="flex flex-wrap items-center gap-2">
            {selectedDocIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBulkTagModalOpen(true)}
                className="text-xs h-9 rounded-xl border-amber-500/30 text-amber-600 dark:text-amber-400"
              >
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                <span>Bulk Tag ({selectedDocIds.length})</span>
              </Button>
            )}
            <Button
              onClick={handleOpenAddModal}
              className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4 shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Add Document</span>
            </Button>
          </div>
        </AdminPageHeader>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "documents"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Archive Records ({documents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "health"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Health Check ({mockArchiveHealthIssues.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "reports"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <HelpCircle className="h-4 w-4 text-rose-500" />
            <span>Problem Reports ({mockArchiveReports.length})</span>
          </button>
        </div>

        {/* Tab 1: Documents Management */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
                  <Input
                    placeholder="Search by title, subject name, subject code, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Semester Filter */}
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                  >
                    <option value="all">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s.toString()}>
                        Semester {s}
                      </option>
                    ))}
                  </select>

                  {/* Document Type Filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                  >
                    <option value="all">All Document Types</option>
                    <option value="question_paper">Question Paper</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="notes">Notes</option>
                    <option value="lab_manual">Lab Manual</option>
                  </select>

                  {/* Scheme Filter */}
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                  >
                    <option value="all">All Schemes</option>
                    <option value="2019 Scheme">2019 Scheme</option>
                    <option value="2015 Scheme">2015 Scheme</option>
                    <option value="2023 Scheme">2023 Scheme</option>
                  </select>

                  {(selectedSemester !== "all" ||
                    selectedType !== "all" ||
                    selectedScheme !== "all" ||
                    searchQuery !== "") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSemester("all");
                        setSelectedType("all");
                        setSelectedScheme("all");
                        setSearchQuery("");
                      }}
                      className="text-xs h-10 px-3 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Document Listing (Desktop Table + Mobile Cards) */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      <th className="p-3 pl-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            selectedDocIds.length === filteredDocuments.length &&
                            filteredDocuments.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-neutral-300"
                          aria-label="Select all documents"
                        />
                      </th>
                      <th className="p-3">Document Title & Subject</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Scheme</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Exam Period</th>
                      <th className="p-3">Tags</th>
                      <th className="p-3 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-neutral-500">
                          <FileText className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                          <p className="font-semibold text-sm">No archive records found</p>
                          <p className="text-xs mt-1">
                            Try adjusting your search query or filters.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredDocuments.map((doc) => {
                        const isSelected = selectedDocIds.includes(doc.id);
                        return (
                          <tr
                            key={doc.id}
                            className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition ${
                              isSelected ? "bg-amber-500/5 dark:bg-amber-500/10" : ""
                            }`}
                          >
                            <td className="p-3 pl-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectDoc(doc.id)}
                                className="rounded border-neutral-300"
                                aria-label={`Select ${doc.title}`}
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                                {doc.title}
                              </div>
                              <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                                <span>{doc.subject}</span>
                                {doc.subjectCode && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono">{doc.subjectCode}</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-neutral-700 dark:text-neutral-300">
                              Sem {doc.semester}
                            </td>
                            <td className="p-3 text-neutral-600 dark:text-neutral-400">
                              {doc.scheme}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  doc.type === "question_paper"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                                    : doc.type === "syllabus"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                }`}
                              >
                                {doc.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-3 text-neutral-600 dark:text-neutral-400">
                              {doc.type === "question_paper"
                                ? `${doc.examMonth} ${doc.examYear}`
                                : "N/A (Syllabus)"}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {doc.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-right pr-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setPreviewDoc(doc)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  title="Quick Preview"
                                  aria-label="Preview document"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditModal(doc)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  title="Edit Metadata"
                                  aria-label="Edit document metadata"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setReplacingDoc(doc)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  title="Replace File"
                                  aria-label="Replace file"
                                >
                                  <Upload className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingDocId(doc.id)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  title="Delete Document"
                                  aria-label="Delete document"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Health Check */}
        {activeTab === "health" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/10 p-4 text-xs flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm text-neutral-900 dark:text-neutral-100">
                  Drive Indexing & Storage Health Status
                </span>
                <p className="mt-1 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  The health check diagnoses broken sharing links, invalid Google Drive IDs, and
                  metadata discrepancies.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
              {mockArchiveHealthIssues.map((issue) => (
                <div key={issue.documentId} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === "error"
                            ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {issue.documentTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {issue.message}
                    </p>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      Subject: {issue.subject} · Checked:{" "}
                      {new Date(issue.lastChecked).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-xl shrink-0"
                    onClick={() => {
                      const doc = documents.find((d) => d.id === issue.documentId) || documents[0];
                      handleOpenEditModal(doc);
                    }}
                  >
                    Fix Metadata
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Problem Reports */}
        {activeTab === "reports" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {mockArchiveReports.map((report) => (
              <div
                key={report.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                      {report.issueType.replace("_", " ")}
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {report.documentTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {report.description}
                  </p>
                  <div className="text-[11px] text-neutral-400">
                    Reported by {report.reportedBy} ({report.reporterEmail}) on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      report.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {report.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-xl"
                    onClick={() => {
                      const doc = documents.find((d) => d.id === report.documentId) || documents[0];
                      setReplacingDoc(doc);
                    }}
                  >
                    Replace PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Document Dialog */}
      <Dialog
        open={isAddModalOpen || editingDoc !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingDoc(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingDoc ? "Edit Archive Document Metadata" : "Add New Academic Archive Document"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in syllabus, subject, and exam metadata for indexing in the CUSAT repository.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDocument} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="doc-title" className="text-xs font-semibold">
                  Document Title *
                </Label>
                <Input
                  id="doc-title"
                  placeholder="e.g. Fluid Machinery — Regular Exam QP"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-type" className="text-xs font-semibold">
                  Document Type *
                </Label>
                <select
                  id="doc-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ArchiveDocumentType })
                  }
                  className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="question_paper">Question Paper</option>
                  <option value="syllabus">Syllabus</option>
                  <option value="notes">Notes</option>
                  <option value="lab_manual">Lab Manual</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-semester" className="text-xs font-semibold">
                  Semester *
                </Label>
                <select
                  id="doc-semester"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })
                  }
                  className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-subject" className="text-xs font-semibold">
                  Subject Name *
                </Label>
                <Input
                  id="doc-subject"
                  placeholder="e.g. Mechanics of Solids"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-subject-code" className="text-xs font-semibold">
                  Subject Code
                </Label>
                <Input
                  id="doc-subject-code"
                  placeholder="e.g. 19-204-0303"
                  value={formData.subjectCode}
                  onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-scheme" className="text-xs font-semibold">
                  Scheme / Syllabus Year *
                </Label>
                <select
                  id="doc-scheme"
                  value={formData.scheme}
                  onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="2019 Scheme">2019 Scheme</option>
                  <option value="2015 Scheme">2015 Scheme</option>
                  <option value="2023 Scheme">2023 Scheme</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-program" className="text-xs font-semibold">
                  Academic Program *
                </Label>
                <select
                  id="doc-program"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="B.Tech">B.Tech Mechanical Engineering</option>
                  <option value="M.Tech">M.Tech Advanced Mechanical</option>
                  <option value="Ph.D.">Doctoral / Research</option>
                </select>
              </div>

              {/* Conditional Exam Year/Month: Only for question papers */}
              {formData.type === "question_paper" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="doc-exam-year" className="text-xs font-semibold">
                      Exam Year *
                    </Label>
                    <Input
                      id="doc-exam-year"
                      type="number"
                      value={formData.examYear}
                      onChange={(e) =>
                        setFormData({ ...formData, examYear: parseInt(e.target.value) || 2024 })
                      }
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="doc-exam-month" className="text-xs font-semibold">
                      Exam Month / Session *
                    </Label>
                    <Input
                      id="doc-exam-month"
                      placeholder="e.g. Nov/Dec or April/May"
                      value={formData.examMonth}
                      onChange={(e) => setFormData({ ...formData, examMonth: e.target.value })}
                      className="text-xs h-9 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="doc-tags" className="text-xs font-semibold">
                  Search Tags (Comma-separated)
                </Label>
                <Input
                  id="doc-tags"
                  placeholder="e.g. CUSAT, Semester 5, Regular, Fluid Machinery"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              {!editingDoc && (
                <div className="space-y-1.5 sm:col-span-2 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-neutral-400 mb-1" />
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Select PDF File
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    PDF files up to 25MB. Real upload will stream directly to Google Drive via
                    backend integration.
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    className="mt-2 text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#7c1d28] file:text-white"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDoc(null);
                }}
                className="text-xs h-9 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
              >
                {editingDoc ? "Save Changes" : "Save & Index Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Replace File Modal */}
      <Dialog open={replacingDoc !== null} onOpenChange={(open) => !open && setReplacingDoc(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Replace Document PDF</DialogTitle>
            <DialogDescription className="text-xs">
              Upload a new scan or corrected version for: {replacingDoc?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl text-center space-y-2">
            <Upload className="h-6 w-6 mx-auto text-neutral-400" />
            <div className="text-xs font-semibold">Choose new PDF file</div>
            <input type="file" accept=".pdf" className="text-xs text-neutral-500" />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReplacingDoc(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setReplacingDoc(null);
              }}
              className="bg-[#7c1d28] text-white text-xs font-bold rounded-xl"
            >
              Confirm Replacement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* On-Demand Document Preview Modal */}
      <Dialog open={previewDoc !== null} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span>{previewDoc?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewDoc?.subject} ({previewDoc?.scheme}) · Semester {previewDoc?.semester}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-8 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-[#7c1d28] dark:text-amber-400" />
            <div className="font-semibold text-sm">PDF Preview Viewer Interface</div>
            <p className="text-xs text-neutral-500 max-w-md">
              On-demand viewer configured. Preloading full PDFs for every document in the table is
              disabled to maintain optimal browser performance.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Link
                to={`/archive/${previewDoc?.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#7c1d28] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#63141f]"
              >
                <span>Open Public Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewDoc(null)}
              className="text-xs rounded-xl"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Tag Dialog */}
      <Dialog open={isBulkTagModalOpen} onOpenChange={setIsBulkTagModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Bulk Tag Documents</DialogTitle>
            <DialogDescription className="text-xs">
              Add tags to {selectedDocIds.length} selected academic archive documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-xs font-semibold">Tags to Append (Comma separated)</Label>
            <Input
              placeholder="e.g. 2019-Scheme, Verified-QP, Midterm"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              className="text-xs h-9 rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkTagModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleBulkTagApply}
              className="bg-[#7c1d28] text-white text-xs font-bold rounded-xl"
            >
              Apply Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingDocId !== null}
        title="Delete Archive Document"
        description="Are you sure you want to remove this academic document from the repository? This will un-index the question paper and disable student downloads."
        confirmLabel="Yes, Delete Record"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingDocId(null)}
      />
    </AdminLayout>
  );
}
