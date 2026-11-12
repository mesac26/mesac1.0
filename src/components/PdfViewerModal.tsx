import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

export interface PDFDocumentData {
  id: string;
  title: string;
  category:
    "Syllabus" | "Magazines" | "Lab Manuals" | "Question Papers" | "Rulebooks" | "Brochures";
  description: string;
  fileSize?: string;
  year?: string;
  authorOrDept?: string;
  pages?: number;
  tags?: string[];
  contentSections?: {
    heading: string;
    subtext?: string;
    items?: string[];
  }[];
}

interface PdfViewerModalProps {
  document: PDFDocumentData | null;
  onClose: () => void;
}

export function PdfViewerModal({ document, onClose }: PdfViewerModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  useEffect(() => {
    if (!document) return;
    const prevOverflow = typeof window !== "undefined" ? window.document.body.style.overflow : "";
    if (typeof window !== "undefined") {
      window.document.body.style.overflow = "hidden";
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (typeof window !== "undefined") {
        window.document.body.style.overflow = prevOverflow;
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [document, onClose]);

  if (!document) return null;

  const totalPages = document.pages || 4;
  const year = document.year || "2024-2025";
  const publisher = document.authorOrDept || "Division of Mechanical Engineering, CUSAT";

  // Generate downloadable PDF using jsPDF
  const generateAndDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(18, 24, 38);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(212, 175, 55); // Gold
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("COCHIN UNIVERSITY OF SCIENCE AND TECHNOLOGY", 15, 15);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("School of Engineering — Division of Mechanical Engineering", 15, 23);
      doc.text(
        `Official Document Archive · Ref: MESAC/${document.category.toUpperCase()}/${year}`,
        15,
        29,
      );

      // Document Title Box
      doc.setTextColor(20, 25, 35);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(document.title, 15, 48);

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        `Category: ${document.category} | Publisher: ${publisher} | Scheme/Year: ${year}`,
        15,
        55,
      );

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 58, 195, 58);

      // Description & Overview
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);

      const splitDesc = doc.splitTextToSize(`Description: ${document.description}`, 180);
      doc.text(splitDesc, 15, 66);

      let currentY = 66 + splitDesc.length * 6;

      // Render Content Sections
      const sections = document.contentSections || defaultSections(document);

      sections.forEach((sec, idx) => {
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(18, 24, 38);
        doc.text(`${idx + 1}. ${sec.heading}`, 15, currentY);
        currentY += 7;

        if (sec.subtext) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(70, 70, 70);
          const splitSub = doc.splitTextToSize(sec.subtext, 175);
          doc.text(splitSub, 18, currentY);
          currentY += splitSub.length * 5 + 3;
        }

        if (sec.items && sec.items.length > 0) {
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 30, 30);
          sec.items.forEach((item) => {
            if (currentY > 270) {
              doc.addPage();
              currentY = 20;
            }
            const splitItem = doc.splitTextToSize(`• ${item}`, 170);
            doc.text(splitItem, 22, currentY);
            currentY += splitItem.length * 4.5;
          });
          currentY += 4;
        }
      });

      // Footer Stamp
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      doc.setDrawColor(212, 175, 55);
      doc.rect(15, currentY + 10, 180, 22);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(18, 24, 38);
      doc.text("VERIFIED DIGITAL COPY — MESAC ACADEMIC & RESEARCH CELL, CUSAT", 20, currentY + 19);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | School of Engineering, CUSAT, Kalamassery - 682022`,
        20,
        currentY + 26,
      );

      doc.save(`${document.id || "CUSAT_MESAC_Document"}.pdf`);
      toast.success("PDF Downloaded Successfully!", {
        description: `${document.title} (${document.fileSize || "PDF Document"}) saved to your device.`,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Generating printable PDF document...");
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: `${document.title} - CUSAT Mechanical MESAC Archive`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
      className="fixed inset-0 z-[120] flex flex-col bg-black/90 backdrop-blur-md animate-fade-in text-foreground"
    >
      {/* TOOLBAR HEADER */}
      <div className="flex items-center justify-between border-b border-border bg-card/90 px-3 sm:px-6 py-2.5 sm:py-3 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl gradient-gold grid place-items-center text-primary font-bold shrink-0">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gold">
              <span>{document.category}</span>
              <span>•</span>
              <span className="truncate">{publisher}</span>
            </div>
            <h2
              id="pdf-viewer-title"
              className="font-display text-sm sm:text-base md:text-lg font-bold truncate text-foreground"
            >
              {document.title}
            </h2>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
            title="Share Document"
            aria-label="Share document link"
          >
            <Share2 className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span className="hidden lg:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
            title="Print Document"
            aria-label="Print document"
          >
            <Printer className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={generateAndDownloadPDF}
            className="inline-flex items-center gap-1.5 rounded-full gradient-gold text-primary font-bold px-3 sm:px-4 py-1.5 text-xs shadow-sm hover:brightness-105 transition cursor-pointer"
            aria-label="Download PDF"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Download</span>
            <span className="inline xs:hidden sm:hidden">PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-secondary text-foreground hover:bg-muted ml-1 sm:ml-2 cursor-pointer"
            title="Close Viewer (Esc)"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* DOCUMENT CANVAS CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-muted/40 scrollbar-thin">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          className="w-full max-w-3xl rounded-2xl bg-card border border-border p-6 sm:p-12 shadow-lift transition-transform duration-200"
        >
          {/* CUSAT HEADER */}
          <div className="border-b-2 border-gold pb-6 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-gold">
                Cochin University of Science and Technology
              </span>
              <span className="h-2 w-2 rounded-full bg-gold" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              SCHOOL OF ENGINEERING
            </h1>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Division of Mechanical Engineering · Kalamassery, Kochi - 682022
            </div>
            <div className="mt-2 text-[10px] uppercase font-mono text-muted-foreground/80">
              NBA Accredited Program | MESAC Official Academic Repository
            </div>
          </div>

          {/* DOCUMENT METADATA BAR */}
          <div className="my-6 rounded-xl bg-secondary/60 p-4 border border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Document ID: </span>
              <span className="font-mono font-bold text-foreground">
                MESAC-{document.id.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Scheme / Session: </span>
              <span className="font-semibold text-gold">{year}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Verification: </span>
              <span className="font-semibold text-emerald-500 inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Official Copy
              </span>
            </div>
          </div>

          {/* PAGE CONTENT SIMULATION */}
          <div className="space-y-8 text-foreground/90 leading-relaxed text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold">
                {document.category} Details
              </span>
              <h2 className="font-display text-2xl font-bold mt-1 text-foreground">
                {document.title}
              </h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{document.description}</p>
            </div>

            {/* SECTIONS */}
            {(document.contentSections || defaultSections(document)).map((section, idx) => (
              <div key={section.heading} className="space-y-3 pt-4 border-t border-border/60">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="text-gold font-mono">{idx + 1}.</span>
                  <span>{section.heading}</span>
                </h3>

                {section.subtext && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{section.subtext}</p>
                )}

                {section.items && section.items.length > 0 && (
                  <ul className="grid gap-2 sm:grid-cols-1 pt-1">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg bg-background p-3 border border-border/70 text-xs"
                      >
                        <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* FOOTER SIGNATURE & STAMP */}
          <div className="mt-12 border-t-2 border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              <div className="font-semibold text-foreground">Dr. Tide P S</div>
              <div>Faculty Advisor, MESAC CUSAT</div>
              <div className="text-[10px] text-muted-foreground">
                Division of Mechanical Engineering
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-semibold text-foreground">Dr. Biju N</div>
              <div>Head of Division, Mechanical Engg</div>
              <div className="text-[10px] text-muted-foreground">School of Engineering, CUSAT</div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE NAV FOOTER */}
      <div className="border-t border-border bg-card/90 px-6 py-3 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Verified Document • CUSAT SoE Archives</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-border hover:bg-secondary disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-border hover:bg-secondary disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Fallback dynamic section data if not provided
function defaultSections(doc: PDFDocumentData) {
  if (doc.category === "Syllabus") {
    return [
      {
        heading: "Course Structure & Semester Credit Allocation",
        subtext: "Approved by CUSAT Academic Council under Choice Based Credit System (CBCS).",
        items: [
          "103ME01 — Applied Thermodynamics & Heat Engines (4 Credits)",
          "103ME02 — Mechanics of Solids & FEA Foundations (4 Credits)",
          "103ME03 — Fluid Power Systems & Hydraulics (3 Credits)",
          "103ME04 — CAD / CAM & Kinematics of Machinery (4 Credits)",
          "103ME05 — Industrial Engineering, Operations & Lean Management (3 Credits)",
        ],
      },
      {
        heading: "Module Breakdown & Prescribed Textbooks",
        subtext:
          "Required modules and university recommended textbooks for CUSAT Mechanical examinations.",
        items: [
          "Module I: First & Second Law analysis, Entropy generation, Rankine and Regenerative Steam Cycles.",
          "Module II: Conduction, Convective heat transfer coefficients, Nusselt number correlations, Heat Exchangers.",
          "Module III: Kinematic synthesis, Gear trains, Cam profile generation, Balancing of rotating masses.",
          "Recommended Texts: Engineering Thermodynamics by P.K. Nag | Mechanics of Materials by Beer & Johnston.",
        ],
      },
    ];
  }

  if (doc.category === "Lab Manuals") {
    return [
      {
        heading: "Laboratory Safety Guidelines & Operating Rules",
        subtext: "Mandatory personal protective equipment (PPE) and machine operations checklist.",
        items: [
          "Industrial safety shoes and lab apron strictly mandatory before entering the workshop.",
          "Emergency cut-off switches location identified for 3-Axis CNC Machine, Hydraulic Rig, and UTM.",
          "Logbook entry required before starting any test bench or computer workstation.",
        ],
      },
      {
        heading: "List of Prescribed Experiments",
        subtext:
          "Step-by-step procedures, formula sheet, observation table and sample calculations.",
        items: [
          "Experiment 1: Performance testing of 4-stroke single cylinder Diesel Engine with electrical dynamometer.",
          "Experiment 2: Determination of overall efficiency and characteristic curves for Pelton Wheel Turbine.",
          "Experiment 3: Tensile testing of mild steel specimen on 100-Ton Universal Testing Machine (UTM).",
          "Experiment 4: CNC Lathe G-code programming, simulation and cylindrical turning component fabrication.",
        ],
      },
    ];
  }

  if (doc.category === "Rulebooks") {
    return [
      {
        heading: "Competition Rules & Technical Inspection Protocols",
        subtext: "Safety, dimensions, weight constraints, and judging rubric.",
        items: [
          "Bot Weight Class: Maximum 15kg (Featherweight) and 30kg (Lightweight) strict weight checks.",
          "Radio Control: Failsafe wireless control operating at 2.4GHz with hardware kill switch required.",
          "Judging Rubric: Aggression (30%), Damage (40%), Control & Mechanical Strategy (30%).",
          "Prize Pool: ₹ 1,50,000 Total Cash Awards + Trophies & Merit Certificates across categories.",
        ],
      },
    ];
  }

  return [
    {
      heading: "Official Publication & Department Overview",
      subtext:
        "Published by MESAC in association with the Division of Mechanical Engineering, School of Engineering, CUSAT.",
      items: [
        "Feature 1: Student Innovations & Research Papers in Renewable Thermal Energy & Composites.",
        "Feature 2: Formula Student CUSAT Track Day Highlights & Chassis FEA Design Insights.",
        "Feature 3: Alumni Corner & Placement Interviews with CUSAT Engineering Leaders.",
      ],
    },
  ];
}
