import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { PdfViewerModal, PDFDocumentData } from "@/components/PdfViewerModal";
import { EmptyState } from "@/components/EmptyState";
import { FileText, Download, Eye, Search, BookOpen, Award } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads & Resources — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Download official CUSAT Mechanical Engineering syllabus PDFs, lab manuals, question papers, MESAC magazine, and event rulebooks.",
      },
      { property: "og:title", content: "Downloads & Resources — MESAC CUSAT" },
      {
        property: "og:description",
        content: "Access syllabus PDFs, Mechazine, lab manuals and previous question papers.",
      },
    ],
  }),
  component: DownloadsPage,
});

export const PDF_DOCUMENTS: PDFDocumentData[] = [
  {
    id: "syl-btech-2023",
    title: "B.Tech Mechanical Engineering Syllabus (2023 Scheme)",
    category: "Syllabus",
    description:
      "Official curriculum and course outline for Semesters 1 through 8 under CUSAT School of Engineering.",
    fileSize: "2.8 MB",
    year: "2023 Scheme",
    authorOrDept: "Division of Mechanical Engineering, CUSAT",
    pages: 142,
    tags: ["B.Tech", "Curriculum", "2023 Scheme", "S1-S8"],
    contentSections: [
      {
        heading: "Semester 1 & 2 Foundation Courses",
        subtext: "Common engineering sciences and core mechanical fundamentals.",
        items: [
          "23-200-0101 — Engineering Mathematics I & II (Calculus & Linear Algebra)",
          "23-203-0102 — Engineering Physics & Materials Science Lab",
          "23-203-0103 — Engineering Graphics & CAD Fundamentals (SolidWorks)",
          "23-203-0104 — Basic Mechanical Engineering & Machine Workshop Practical",
        ],
      },
      {
        heading: "Semester 3 & 4 Core Mechanical Subjects",
        subtext: "Thermodynamics, Mechanics of Solids, Fluid Mechanics, Kinematics.",
        items: [
          "23-203-0301 — Engineering Thermodynamics (Pure substances & Gas cycles)",
          "23-203-0302 — Mechanics of Solids (Stress-Strain, Bending & Torsion)",
          "23-203-0303 — Metallurgy & Material Testing Laboratory",
          "23-203-0401 — Fluid Mechanics & Hydraulic Machinery (Turbines & Pumps)",
          "23-203-0402 — Manufacturing Process I (Casting, Welding & Forming)",
        ],
      },
      {
        heading: "Semester 5 & 6 Applied Thermal & Design Engineering",
        subtext: "Machine Design, Thermal Engineering, Dynamics & Metrology.",
        items: [
          "23-203-0501 — Design of Machine Elements I (Fasteners, Shafts, Keys)",
          "23-203-0502 — Thermal Engineering (IC Engines, Steam Turbines, Nozzles)",
          "23-203-0601 — Heat & Mass Transfer (Conduction, Convection & Radiation)",
          "23-203-0602 — Dynamics of Machinery (Vibrations, Balancing, Cams)",
        ],
      },
    ],
  },
  {
    id: "syl-btech-2019",
    title: "B.Tech Mechanical Engineering Syllabus (2019 Scheme)",
    category: "Syllabus",
    description:
      "Complete course structure, credits, and syllabus details for the 2019 regulation.",
    fileSize: "3.1 MB",
    year: "2019 Scheme",
    authorOrDept: "Division of Mechanical Engineering, CUSAT",
    pages: 156,
    tags: ["B.Tech", "Curriculum", "2019 Scheme"],
  },
  {
    id: "syl-mtech-thermal",
    title: "M.Tech Thermal Engineering Syllabus",
    category: "Syllabus",
    description:
      "Post-graduate syllabus covering Advanced Heat Transfer, CFD, Combustion, and Energy Systems.",
    fileSize: "1.4 MB",
    year: "2022",
    authorOrDept: "Post Graduate Board of Studies, CUSAT",
    pages: 48,
    tags: ["M.Tech", "Thermal", "PG Course"],
  },
  {
    id: "syl-mtech-iem",
    title: "M.Tech Industrial Engg & Management Syllabus",
    category: "Syllabus",
    description:
      "Curriculum covering Operations Research, Supply Chain, Ergonomics, and Quality Systems.",
    fileSize: "1.2 MB",
    year: "2022",
    authorOrDept: "Post Graduate Board of Studies, CUSAT",
    pages: 42,
    tags: ["M.Tech", "Industrial", "Management"],
  },
  {
    id: "mag-mechazine-2024",
    title: "MECHAZINE 2024 — MESAC Annual Department Magazine",
    category: "Magazines",
    description:
      "Features student research, alumni interviews, technical essays, creative writing, and event showcases.",
    fileSize: "14.5 MB",
    year: "2024 Edition",
    authorOrDept: "MESAC Editorial Board",
    pages: 84,
    tags: ["Magazine", "Mechazine", "Student Work", "2024"],
  },
  {
    id: "mag-newsletter-q3",
    title: "MESAC Gazette — Q3 2024 Technical Bulletin",
    category: "Magazines",
    description:
      "Quarterly update on department research, paper publications, SAE competitions, and industry visits.",
    fileSize: "4.2 MB",
    year: "Q3 2024",
    authorOrDept: "MESAC Media & Publications",
    pages: 24,
    tags: ["Newsletter", "Quarterly", "Research"],
  },
  {
    id: "lab-fluid-mech",
    title: "Fluid Mechanics & Hydraulic Machines Lab Manual",
    category: "Lab Manuals",
    description:
      "Standard operating procedures, formulas, and experiment logs for Venturi meter, turbine tests, and pump characteristics.",
    fileSize: "4.6 MB",
    year: "2024",
    authorOrDept: "Fluid Mechanics Laboratory, CUSAT",
    pages: 52,
    tags: ["Lab Manual", "Fluid Mechanics", "S4 B.Tech"],
  },
  {
    id: "lab-heat-transfer",
    title: "Heat Transfer & Thermal Engineering Lab Manual",
    category: "Lab Manuals",
    description:
      "Conduction, natural/forced convection, radiation apparatus, and thermal conductivity measurement procedures.",
    fileSize: "3.8 MB",
    year: "2023",
    authorOrDept: "Thermal Engineering Lab, CUSAT",
    pages: 44,
    tags: ["Lab Manual", "Thermal", "Heat Transfer", "S6 B.Tech"],
  },
  {
    id: "lab-cad-cam",
    title: "CAD / CAM & CNC Machining Practical Guide",
    category: "Lab Manuals",
    description:
      "SolidWorks design workflows, G-code & M-code programming for CNC Lathe and Milling machines.",
    fileSize: "5.1 MB",
    year: "2024",
    authorOrDept: "CAD/CAM Center, CUSAT SoE",
    pages: 68,
    tags: ["Lab Manual", "CAD/CAM", "CNC", "S7 B.Tech"],
  },
  {
    id: "qp-s5-s8-mech",
    title: "Semester 5 to 8 B.Tech Question Bank (2019-2023)",
    category: "Question Papers",
    description:
      "Previous year University examination question papers for Design of Machine Elements, Heat Transfer, and CAD/CAM.",
    fileSize: "18.2 MB",
    year: "2019-2023",
    authorOrDept: "MESAC Academic Cell",
    pages: 210,
    tags: ["Question Papers", "Exam Bank", "S5-S8", "CUSAT Exams"],
  },
  {
    id: "qp-s1-s4-mech",
    title: "Semester 1 to 4 B.Tech Question Bank (2019-2023)",
    category: "Question Papers",
    description:
      "Previous year papers for Engineering Mechanics, Engineering Graphics, Thermodynamics, and Fluid Mechanics.",
    fileSize: "16.5 MB",
    year: "2019-2023",
    authorOrDept: "MESAC Academic Cell",
    pages: 195,
    tags: ["Question Papers", "Exam Bank", "S1-S4", "Foundations"],
  },
  {
    id: "rule-yantra-2025",
    title: "YANTRA 2025 — Techfest Rulebook & Competition Guidelines",
    category: "Rulebooks",
    description:
      "Official rulebook for RoboWars, CAD Marathon, RC Aircraft Challenge, Paper Presentation, and Water Rocketry.",
    fileSize: "2.4 MB",
    year: "2025",
    authorOrDept: "Yantra Techfest Committee",
    pages: 32,
    tags: ["Yantra", "Rulebook", "Competitions", "Techfest"],
  },
  {
    id: "rule-formula-student",
    title: "Formula Student CUSAT — Design & Technical Specification",
    category: "Rulebooks",
    description:
      "Chassis compliance, powertrain safety limits, and static design judging criteria for student race car.",
    fileSize: "6.7 MB",
    year: "2024",
    authorOrDept: "Formula Student CUSAT Team",
    pages: 76,
    tags: ["Formula Student", "SAE", "Automotive", "Design Spec"],
  },
];

function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePdf, setActivePdf] = useState<PDFDocumentData | null>(null);

  const categories = [
    "All",
    "Syllabus",
    "Magazines",
    "Lab Manuals",
    "Question Papers",
    "Rulebooks",
  ];

  const filteredDocs = PDF_DOCUMENTS.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <PageHero
        variant="downloads"
        eyebrow="Downloads & PDFs"
        title={
          <>
            Official <span className="italic text-gold">MESAC & CUSAT</span> Library.
          </>
        }
        subtitle="Access all official Mechanical Engineering syllabus PDFs, lab manuals, university question paper archives, Mechazine publications, and event rulebooks."
      />

      {/* QUICK STATS & SEARCH */}
      <section className="py-12 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground">
                <FileText className="h-4 w-4 text-gold" />
                <span>{PDF_DOCUMENTS.length} Official Documents</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground">
                <BookOpen className="h-4 w-4 text-gold" />
                <span>2019 & 2023 CUSAT Schemes</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground">
                <Award className="h-4 w-4 text-gold" />
                <span>Mechazine & Gazette Issues</span>
              </div>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full md:w-80">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <input
                type="text"
                aria-label="Search syllabus, lab manuals, papers"
                placeholder="Search syllabus, lab manuals, papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 min-h-[40px]"
              />
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div
            role="tablist"
            aria-label="Filter documents by category"
            className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={
                    "rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[40px] inline-flex items-center justify-center " +
                    (active
                      ? "gradient-gold text-primary shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary")
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOCUMENT GRID */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {filteredDocs.length === 0 ? (
            <EmptyState
              title={
                searchQuery
                  ? `No documents matching "${searchQuery}"`
                  : `No ${selectedCategory} documents found`
              }
              description="Try adjusting your search terms or selecting a different category from above."
              actionText="Reset filters"
              onAction={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc, idx) => (
                <Reveal key={doc.id} delay={idx * 40}>
                  <div className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 card-lift h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold text-gold">
                          {doc.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {doc.fileSize} · {doc.pages} Pages
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-2xl group-hover:text-gold transition-colors leading-snug">
                        {doc.title}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {doc.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {doc.tags?.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border/80 pt-4 flex items-center justify-between">
                      <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                        {doc.authorOrDept}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePdf(doc)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition"
                        >
                          <Eye className="h-3.5 w-3.5 text-gold" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={() => setActivePdf(doc)}
                          className="inline-flex items-center gap-1.5 rounded-full gradient-gold px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm hover:brightness-105 transition"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Get PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PDF PREVIEW MODAL */}
      <PdfViewerModal document={activePdf} onClose={() => setActivePdf(null)} />
    </Layout>
  );
}
