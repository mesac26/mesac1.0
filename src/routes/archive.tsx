import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { EmptyState } from "@/components/EmptyState";
import { StickyFilterBar } from "@/components/StickyFilterBar";
import { ArchiveDocumentCard } from "@/components/archive/ArchiveDocumentCard";
import { DOCUMENT_TYPE_LABELS } from "@/lib/archive";
import { mockArchiveDocuments } from "@/data/mock/archive";
import type { ArchiveDocument, ArchiveDocumentType } from "@/types";
import {
  Search,
  SlidersHorizontal,
  X,
  BookOpen,
  RotateCcw,
  Layers,
  GraduationCap,
  Calendar,
  FileText,
  Building2,
  ChevronRight,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Academic Archive — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Browse official CUSAT Mechanical Engineering question papers, syllabus schemes, lab manuals, and notes indexed by department, program, semester and subject.",
      },
      { property: "og:title", content: "Academic Archive — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "Explore verified academic documents, previous year question papers, and course syllabus.",
      },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedProgram, setSelectedProgram] = useState<string>("All");
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedScheme, setSelectedScheme] = useState<string>("All");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Derive unique filter options dynamically from mock data
  const departments = useMemo(() => {
    const set = new Set<string>();
    mockArchiveDocuments.forEach((d) => {
      if (d.department) set.add(d.department);
    });
    return ["All", ...Array.from(set)];
  }, []);

  const programs = useMemo(() => {
    const set = new Set<string>();
    mockArchiveDocuments.forEach((d) => {
      if (d.program) set.add(d.program);
    });
    return ["All", ...Array.from(set)];
  }, []);

  const semesters = useMemo(() => {
    const set = new Set<string>();
    mockArchiveDocuments.forEach((d) => {
      if (typeof d.semester === "number") {
        set.add(`Semester ${d.semester}`);
      } else if (d.semester) {
        set.add(String(d.semester));
      }
    });
    // Sort semesters numerically where possible
    return [
      "All",
      ...Array.from(set).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")) || 999;
        const numB = parseInt(b.replace(/\D/g, "")) || 999;
        return numA - numB;
      }),
    ];
  }, []);

  const schemes = useMemo(() => {
    const set = new Set<string>();
    mockArchiveDocuments.forEach((d) => {
      if (d.scheme) set.add(d.scheme);
    });
    return ["All", ...Array.from(set)];
  }, []);

  const documentTypes: Array<{ value: string; label: string }> = [
    { value: "All", label: "All Document Types" },
    { value: "question_paper", label: "Question Papers" },
    { value: "syllabus", label: "Syllabus & Schemes" },
    { value: "notes", label: "Lecture Notes" },
    { value: "lab_manual", label: "Lab Manuals" },
  ];

  // Dynamic subjects based on current department, program & semester selection
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    mockArchiveDocuments.forEach((d) => {
      const matchDept = selectedDepartment === "All" || d.department === selectedDepartment;
      const matchProg = selectedProgram === "All" || d.program === selectedProgram;
      const semStr = typeof d.semester === "number" ? `Semester ${d.semester}` : String(d.semester);
      const matchSem =
        selectedSemester === "All" || semStr === selectedSemester || d.semester === "All Semesters";

      if (matchDept && matchProg && matchSem && d.subject) {
        set.add(d.subject);
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [selectedDepartment, selectedProgram, selectedSemester]);

  // Combined Search and Filter Logic
  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return mockArchiveDocuments.filter((doc) => {
      // 1. Department Filter
      if (selectedDepartment !== "All" && doc.department !== selectedDepartment) {
        return false;
      }

      // 2. Program Filter
      if (selectedProgram !== "All" && doc.program !== selectedProgram) {
        return false;
      }

      // 3. Semester Filter
      if (selectedSemester !== "All") {
        const docSemStr =
          typeof doc.semester === "number" ? `Semester ${doc.semester}` : String(doc.semester);
        if (docSemStr !== selectedSemester && doc.semester !== "All Semesters") {
          return false;
        }
      }

      // 4. Subject Filter
      if (selectedSubject !== "All" && doc.subject !== selectedSubject) {
        return false;
      }

      // 5. Document Type Filter
      if (selectedType !== "All" && doc.type !== selectedType) {
        return false;
      }

      // 6. Scheme Filter
      if (selectedScheme !== "All" && doc.scheme !== selectedScheme) {
        return false;
      }

      // 7. Search Query (Matches ONLY: title, subject name, subject code, tags)
      if (q) {
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchSubject = doc.subject.toLowerCase().includes(q);
        const matchCode = doc.subjectCode ? doc.subjectCode.toLowerCase().includes(q) : false;
        const matchTags = doc.tags ? doc.tags.some((t) => t.toLowerCase().includes(q)) : false;

        if (!matchTitle && !matchSubject && !matchCode && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchQuery,
    selectedDepartment,
    selectedProgram,
    selectedSemester,
    selectedSubject,
    selectedType,
    selectedScheme,
  ]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedDepartment !== "All" ||
    selectedProgram !== "All" ||
    selectedSemester !== "All" ||
    selectedSubject !== "All" ||
    selectedType !== "All" ||
    selectedScheme !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("All");
    setSelectedProgram("All");
    setSelectedSemester("All");
    setSelectedSubject("All");
    setSelectedType("All");
    setSelectedScheme("All");
  };

  return (
    <Layout>
      {/* 1. HERO */}
      <PageHero
        variant="downloads"
        eyebrow="Academic Repository"
        title={
          <>
            ACADEMIC <span className="italic text-gold">ARCHIVE</span>
          </>
        }
        subtitle="Department repository for B.Tech & M.Tech semester question papers, university curriculum schemes, lab manuals, and faculty course notes."
      />

      {/* 2. BROWSE STEPPER / HIERARCHY BAR */}
      <section className="border-b border-border bg-card/60 py-3.5 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
            {/* Department Hierarchy Step */}
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden="true" />
              <span className="text-muted-foreground/80">Dept:</span>
              <select
                aria-label="Filter by department"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedSubject("All");
                }}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>
            </div>
            <ChevronRight className="h-3 w-3 opacity-50 shrink-0" aria-hidden="true" />

            <div className="flex items-center gap-1">
              <span className="text-muted-foreground/80">Program:</span>
              <select
                aria-label="Filter by program"
                value={selectedProgram}
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  setSelectedSubject("All");
                }}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold cursor-pointer"
              >
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p === "All" ? "All Programs" : p}
                  </option>
                ))}
              </select>
            </div>
            <ChevronRight className="h-3 w-3 opacity-50 shrink-0" aria-hidden="true" />

            <div className="flex items-center gap-1">
              <span className="text-muted-foreground/80">Semester:</span>
              <select
                aria-label="Filter by semester"
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedSubject("All");
                }}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold cursor-pointer"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Semesters" : s}
                  </option>
                ))}
              </select>
            </div>
            <ChevronRight className="h-3 w-3 opacity-50 shrink-0" aria-hidden="true" />

            <div className="flex items-center gap-1">
              <span className="text-muted-foreground/80">Subject:</span>
              <select
                aria-label="Filter by subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold max-w-[180px] sm:max-w-[220px] truncate cursor-pointer"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub === "All" ? "All Subjects" : sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <StickyFilterBar className="border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 max-w-md">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <input
                type="text"
                aria-label="Search by document title, subject name, code or tags"
                placeholder="Search title, subject, code (e.g. 19-204), or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/60 pl-10 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-gold min-h-[42px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* QUICK TYPE TABS (DESKTOP) */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
              {documentTypes.map((t) => {
                const active = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSelectedType(t.value)}
                    className={
                      "rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[40px] flex items-center gap-1.5 " +
                      (active
                        ? "gradient-gold text-primary shadow-sm"
                        : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary")
                    }
                  >
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* MOBILE FILTER TRIGGER & RESET BUTTON */}
            <div className="flex items-center gap-2 justify-between md:justify-end">
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px] cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4 text-gold" />
                <span>Filters {hasActiveFilters ? "(Active)" : ""}</span>
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[40px] cursor-pointer"
                  title="Clear all search parameters and filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* EXPANDABLE / MOBILE FILTERS ROW */}
          <div
            className={`pt-3 border-t border-border/60 mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2.5 transition-all ${
              showMobileFilters ? "block" : "hidden lg:grid"
            }`}
          >
            {/* DEPARTMENT SELECT */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Department
              </label>
              <select
                aria-label="Filter by department"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedSubject("All");
                }}
                className="w-full rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold min-h-[38px] cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>
            </div>

            {/* DOCUMENT TYPE SELECT (MOBILE & SECONDARY) */}
            <div className="lg:hidden">
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Document Type
              </label>
              <select
                aria-label="Filter by document type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold min-h-[38px] cursor-pointer"
              >
                {documentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SCHEME SELECT */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Scheme / Regulation
              </label>
              <select
                aria-label="Filter by scheme"
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold min-h-[38px] cursor-pointer"
              >
                {schemes.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Schemes" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* PROGRAM SELECT */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Degree Program
              </label>
              <select
                aria-label="Filter by degree program"
                value={selectedProgram}
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  setSelectedSubject("All");
                }}
                className="w-full rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold min-h-[38px] cursor-pointer"
              >
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p === "All" ? "All Programs" : p}
                  </option>
                ))}
              </select>
            </div>

            {/* SEMESTER SELECT */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Semester
              </label>
              <select
                aria-label="Filter by semester level"
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedSubject("All");
                }}
                className="w-full rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold min-h-[38px] cursor-pointer"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Semesters" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT SELECT */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                Subject
              </label>
              <select
                aria-label="Filter by course subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground font-semibold outline-none focus:ring-1 focus:ring-gold min-h-[38px] truncate cursor-pointer"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub === "All" ? "All Subjects" : sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </StickyFilterBar>

      {/* 4. RESULTS OVERVIEW & DOCUMENTS GRID */}
      <section className="sticky-content-container py-10 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* RESULT COUNT & ACTIVE FILTER BADGES */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Document Catalog
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredDocuments.length === 1
                  ? "1 document found"
                  : `${filteredDocuments.length} documents found`}
                {hasActiveFilters ? " matching your filter selection" : ""}
              </p>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">
                    <span>Search: &quot;{searchQuery}&quot;</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-gold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedProgram !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">
                    <span>{selectedProgram}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProgram("All")}
                      className="hover:text-gold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedSemester !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">
                    <span>{selectedSemester}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSemester("All")}
                      className="hover:text-gold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedType !== "All" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">
                    <span>
                      {DOCUMENT_TYPE_LABELS[selectedType as ArchiveDocumentType] || selectedType}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedType("All")}
                      className="hover:text-gold"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* GRID OF DOCUMENTS */}
          {filteredDocuments.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <Reveal key={doc.id}>
                  <ArchiveDocumentCard document={doc} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No documents match your query"
              description="Try clearing some filter criteria, broadening your search term, or selecting a different semester."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
