import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  RotateCcw,
  Calculator,
  Award,
  GraduationCap,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { CUSAT_GRADE_SCALE } from "@/data/mock/academy";
import type { CusatGradeLetter } from "@/types";

export interface GpaSubjectRow {
  id: string;
  name: string;
  credits: number;
  grade: CusatGradeLetter | "";
  marks?: string;
  isLab?: boolean;
}

export interface SemesterCgpaRow {
  id: string;
  semesterName: string;
  sgpa: string;
  credits: number;
}

const DEFAULT_SUBJECTS: GpaSubjectRow[] = [
  { id: "s1", name: "Mechanics of Solids", credits: 4, grade: "S" },
  { id: "s2", name: "Fluid Mechanics & Machinery", credits: 4, grade: "A" },
  { id: "s3", name: "Thermodynamics", credits: 3, grade: "B" },
  { id: "s4", name: "Manufacturing Processes", credits: 3, grade: "A" },
  { id: "s5", name: "CAD / Modeling Lab", credits: 2, grade: "S", isLab: true },
];

const DEFAULT_SEMESTERS: SemesterCgpaRow[] = [
  { id: "sem1", semesterName: "Semester 1", sgpa: "8.20", credits: 22 },
  { id: "sem2", semesterName: "Semester 2", sgpa: "8.45", credits: 24 },
  { id: "sem3", semesterName: "Semester 3", sgpa: "8.60", credits: 23 },
  { id: "sem4", semesterName: "Semester 4", sgpa: "8.15", credits: 23 },
];

export function GpaCalculator() {
  const [activeTab, setActiveTab] = useState<"sgpa" | "cgpa">("sgpa");
  const [inputMode, setInputMode] = useState<"letter" | "marks">("letter");

  // Subject-wise SGPA state
  const [subjects, setSubjects] = useState<GpaSubjectRow[]>(DEFAULT_SUBJECTS);

  // Semester-wise CGPA state
  const [semesters, setSemesters] = useState<SemesterCgpaRow[]>(DEFAULT_SEMESTERS);

  // Show Grade Reference drawer
  const [showGradeScale, setShowGradeScale] = useState(false);

  // Helper to map letter grade to points using verified CUSAT scale
  const getPointsFromGrade = (grade: CusatGradeLetter | ""): number => {
    if (!grade) return 0;
    const found = CUSAT_GRADE_SCALE.find((g) => g.letter === grade);
    return found ? found.points : 0;
  };

  // Helper to map percentage marks to letter grade based on project scale
  const getGradeFromPercentage = (percentage: number): CusatGradeLetter => {
    if (percentage >= 90) return "S";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    if (percentage >= 45) return "E";
    return "F";
  };

  // ==========================================
  // SUBJECT GPA HANDLERS
  // ==========================================
  const addSubject = () => {
    const nextNum = subjects.length + 1;
    const newId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setSubjects((prev) => [
      ...prev,
      {
        id: newId,
        name: `Course Subject ${nextNum}`,
        credits: 3,
        grade: "",
        marks: "",
      },
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const resetSubjects = () => {
    setSubjects(DEFAULT_SUBJECTS);
  };

  const updateSubjectField = (
    id: string,
    field: keyof GpaSubjectRow,
    value: string | number | boolean,
  ) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;

        if (field === "credits") {
          const num = typeof value === "number" ? value : parseFloat(String(value));
          const safeCredits = isNaN(num) || num < 0 ? 0 : Math.min(10, num);
          return { ...s, credits: safeCredits };
        }

        if (field === "marks" && inputMode === "marks") {
          const rawMarks = String(value);
          const numMarks = parseFloat(rawMarks);
          let derivedGrade: CusatGradeLetter | "" = "";
          if (!isNaN(numMarks) && numMarks >= 0) {
            const max = s.isLab ? 50 : 100;
            const pct = (numMarks / max) * 100;
            derivedGrade = getGradeFromPercentage(pct);
          }
          return { ...s, marks: rawMarks, grade: derivedGrade };
        }

        return { ...s, [field]: value };
      }),
    );
  };

  // ==========================================
  // SEMESTER CGPA HANDLERS
  // ==========================================
  const addSemester = () => {
    const nextNum = semesters.length + 1;
    const newId = `sem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setSemesters((prev) => [
      ...prev,
      {
        id: newId,
        semesterName: `Semester ${nextNum}`,
        sgpa: "",
        credits: 23,
      },
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const resetSemesters = () => {
    setSemesters(DEFAULT_SEMESTERS);
  };

  const updateSemesterField = (
    id: string,
    field: keyof SemesterCgpaRow,
    value: string | number,
  ) => {
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id !== id) return sem;
        if (field === "credits") {
          const num = typeof value === "number" ? value : parseFloat(String(value));
          const safeCredits = isNaN(num) || num < 0 ? 0 : Math.min(35, num);
          return { ...sem, credits: safeCredits };
        }
        return { ...sem, [field]: value };
      }),
    );
  };

  // ==========================================
  // CALCULATION LOGIC: NEVER PRODUCES NaN / INFINITY
  // CGPA = Sum of (Credit × Grade Point) / Sum of Credits
  // ==========================================
  const sgpaCalculation = useMemo(() => {
    let totalCreditPoints = 0;
    let totalCredits = 0;
    let gradedSubjectsCount = 0;

    subjects.forEach((sub) => {
      if (sub.grade && sub.credits > 0) {
        const gradePoint = getPointsFromGrade(sub.grade);
        totalCreditPoints += gradePoint * sub.credits;
        totalCredits += sub.credits;
        gradedSubjectsCount += 1;
      }
    });

    if (totalCredits === 0 || gradedSubjectsCount === 0) {
      return {
        gpaString: "—",
        numericGpa: 0,
        totalCredits: 0,
        totalCreditPoints: 0,
        gradedSubjectsCount: 0,
        percentageString: null,
        statusMessage: "Select grades and credits to compute Semester GPA",
        hasResult: false,
      };
    }

    const calculated = totalCreditPoints / totalCredits;
    const safeGpa = isNaN(calculated) || !isFinite(calculated) ? 0 : calculated;
    const gpaFormatted = safeGpa.toFixed(2);

    // CUSAT official conversion standard: Percentage = (SGPA - 0.5) * 10
    const pct = safeGpa >= 0.5 ? ((safeGpa - 0.5) * 10).toFixed(1) : "0.0";

    return {
      gpaString: gpaFormatted,
      numericGpa: safeGpa,
      totalCredits,
      totalCreditPoints,
      gradedSubjectsCount,
      percentageString: `${pct}%`,
      statusMessage:
        safeGpa >= 8.5
          ? "Outstanding Academic Performance"
          : safeGpa >= 7.0
            ? "First Class with Distinction / Good Standing"
            : safeGpa >= 6.0
              ? "First Class Standing"
              : "Passing Standing",
      hasResult: true,
    };
  }, [subjects]);

  const cgpaCalculation = useMemo(() => {
    let weightedPoints = 0;
    let totalCredits = 0;
    let validCount = 0;

    semesters.forEach((sem) => {
      const val = parseFloat(sem.sgpa);
      const creds = sem.credits || 0;
      if (!isNaN(val) && isFinite(val) && val >= 0 && val <= 10 && creds > 0) {
        weightedPoints += val * creds;
        totalCredits += creds;
        validCount += 1;
      }
    });

    if (totalCredits === 0 || validCount === 0) {
      return {
        cgpaString: "—",
        numericCgpa: 0,
        totalCredits: 0,
        validCount: 0,
        percentageString: null,
        statusMessage: "Enter your completed semester SGPAs (0.00 – 10.00)",
        hasResult: false,
      };
    }

    const calculated = weightedPoints / totalCredits;
    const safeCgpa = isNaN(calculated) || !isFinite(calculated) ? 0 : calculated;
    const cgpaFormatted = safeCgpa.toFixed(2);
    const pct = safeCgpa >= 0.5 ? ((safeCgpa - 0.5) * 10).toFixed(1) : "0.0";

    return {
      cgpaString: cgpaFormatted,
      numericCgpa: safeCgpa,
      totalCredits,
      validCount,
      percentageString: `${pct}%`,
      statusMessage:
        safeCgpa >= 8.5
          ? "Distinction Standing Across Completed Semesters"
          : safeCgpa >= 6.5
            ? "First Class Cumulative Standing"
            : "Satisfactory Cumulative Standing",
      hasResult: true,
    };
  }, [semesters]);

  return (
    <div className="w-full rounded-3xl border border-border bg-card text-foreground shadow-lift overflow-hidden">
      {/* HEADER SECTION */}
      <div className="p-6 sm:p-8 md:p-10 border-b border-border/80 bg-gradient-to-b from-secondary/40 via-card to-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gold">
              <GraduationCap className="h-4 w-4" />
              <span>CUSAT Academic Assessment Standard</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Semester GPA & <span className="italic text-gold">CGPA Calculator</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Calculates credit-weighted Semester GPA (SGPA) and Cumulative Grade Point Average
              (CGPA) using the official Cochin University of Science and Technology 10-point scale.
            </p>
          </div>

          {/* Calculator Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div
              role="tablist"
              aria-label="Calculator Mode"
              className="inline-flex p-1 rounded-2xl bg-secondary/80 border border-border"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "sgpa"}
                onClick={() => setActiveTab("sgpa")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === "sgpa"
                    ? "gradient-gold text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Semester GPA</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "cgpa"}
                onClick={() => setActiveTab("cgpa")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === "cgpa"
                    ? "gradient-gold text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>Cumulative CGPA</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGradeScale(!showGradeScale)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-secondary/60 text-xs font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="View CUSAT 10-point Grading Scale"
            >
              <Info className="h-3.5 w-3.5 text-gold" />
              <span>Grade Scale</span>
            </button>
          </div>
        </div>

        {/* GRADE SCALE REFERENCE DRAWER */}
        {showGradeScale && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-border/80 bg-background/60 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold">
                CUSAT B.Tech Letter Grade & Grade Point Conversion Table
              </span>
              <button
                type="button"
                onClick={() => setShowGradeScale(false)}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
              {CUSAT_GRADE_SCALE.map((g) => (
                <div
                  key={g.letter}
                  className="p-2.5 rounded-xl border border-border/60 bg-card/80 flex flex-col items-center justify-center"
                >
                  <span className="text-lg font-black font-display text-gold">{g.letter}</span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {g.points} Points
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    {g.percentageRange}
                  </span>
                  <span className="text-[10px] text-muted-foreground/80">{g.description}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              Formula:{" "}
              <code className="text-gold font-mono">
                SGPA = Σ (Course Credit × Grade Point) / Σ Course Credits
              </code>{" "}
              · CUSAT Percentage Equivalent:{" "}
              <code className="text-gold font-mono">Percentage = (SGPA - 0.5) × 10</code>
            </p>
          </div>
        )}
      </div>

      {/* CALCULATOR BODY */}
      <div className="p-6 sm:p-8 md:p-10">
        {activeTab === "sgpa" ? (
          /* ========================================================
             TAB 1: SEMESTER GPA (SUBJECT-BY-SUBJECT)
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* SUBJECT LIST COLUMN */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">Course Subjects</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    ({subjects.length} added)
                  </span>
                </div>

                {/* Input Mode Selector: Grade Letter vs Marks % */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Input method:</span>
                  <button
                    type="button"
                    onClick={() => setInputMode("letter")}
                    className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                      inputMode === "letter"
                        ? "border-gold/60 bg-gold/15 text-gold font-bold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Letter Grade (S, A, B...)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("marks")}
                    className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                      inputMode === "marks"
                        ? "border-gold/60 bg-gold/15 text-gold font-bold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Marks (%)
                  </button>
                </div>
              </div>

              {/* Subject Rows */}
              <div className="space-y-3">
                {subjects.map((sub, index) => {
                  const currentPoints = getPointsFromGrade(sub.grade);
                  return (
                    <div
                      key={sub.id}
                      className="group p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-secondary/30 hover:border-gold/30 transition-all space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3"
                    >
                      {/* Subject Number Indicator */}
                      <span className="hidden sm:grid h-7 w-7 place-items-center rounded-lg bg-card border border-border text-xs font-mono font-bold text-muted-foreground shrink-0">
                        {index + 1}
                      </span>

                      {/* Subject Name Input */}
                      <div className="flex-1 min-w-[160px]">
                        <label
                          htmlFor={`sub-name-${sub.id}`}
                          className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:hidden block mb-1"
                        >
                          Subject #{index + 1}
                        </label>
                        <input
                          id={`sub-name-${sub.id}`}
                          type="text"
                          value={sub.name}
                          onChange={(e) => updateSubjectField(sub.id, "name", e.target.value)}
                          placeholder={`Subject ${index + 1} Name`}
                          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition"
                        />
                      </div>

                      {/* Credits Input */}
                      <div className="w-full sm:w-24 shrink-0">
                        <label
                          htmlFor={`sub-credits-${sub.id}`}
                          className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:hidden block mb-1"
                        >
                          Credits
                        </label>
                        <div className="flex items-center rounded-xl border border-border bg-card px-2.5 py-1.5 focus-within:border-gold transition">
                          <span className="text-[11px] font-mono text-muted-foreground mr-1.5">
                            Cr:
                          </span>
                          <input
                            id={`sub-credits-${sub.id}`}
                            type="number"
                            min="1"
                            max="8"
                            step="1"
                            value={sub.credits}
                            onChange={(e) =>
                              updateSubjectField(sub.id, "credits", parseFloat(e.target.value) || 0)
                            }
                            className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground text-center outline-none"
                          />
                        </div>
                      </div>

                      {/* Grade Selector (Letter Grade or Marks) */}
                      {inputMode === "letter" ? (
                        <div className="w-full sm:w-36 shrink-0">
                          <label
                            htmlFor={`sub-grade-${sub.id}`}
                            className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:hidden block mb-1"
                          >
                            Grade
                          </label>
                          <select
                            id={`sub-grade-${sub.id}`}
                            value={sub.grade}
                            onChange={(e) =>
                              updateSubjectField(
                                sub.id,
                                "grade",
                                e.target.value as CusatGradeLetter | "",
                              )
                            }
                            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs sm:text-sm font-bold text-foreground outline-none focus:border-gold transition cursor-pointer"
                          >
                            <option value="">Select Grade</option>
                            {CUSAT_GRADE_SCALE.map((g) => (
                              <option key={g.letter} value={g.letter}>
                                {g.letter} ({g.points} GP · {g.percentageRange})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="w-full sm:w-36 shrink-0 flex items-center gap-1.5">
                          <div className="flex-1">
                            <label
                              htmlFor={`sub-marks-${sub.id}`}
                              className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:hidden block mb-1"
                            >
                              Marks
                            </label>
                            <div className="flex items-center rounded-xl border border-border bg-card px-2.5 py-1.5 focus-within:border-gold transition">
                              <input
                                id={`sub-marks-${sub.id}`}
                                type="number"
                                min="0"
                                max={sub.isLab ? 50 : 100}
                                placeholder={sub.isLab ? "/ 50" : "/ 100"}
                                value={sub.marks || ""}
                                onChange={(e) =>
                                  updateSubjectField(sub.id, "marks", e.target.value)
                                }
                                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground text-center outline-none"
                              />
                            </div>
                          </div>
                          {sub.grade && (
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold font-bold text-xs font-mono shrink-0">
                              {sub.grade}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Calculated Grade Point Badge for Row */}
                      <div className="hidden sm:flex items-center justify-center w-16 text-center shrink-0">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${
                            sub.grade
                              ? "bg-gold/15 text-gold border border-gold/30"
                              : "text-muted-foreground bg-card border border-border"
                          }`}
                        >
                          {sub.grade ? `${currentPoints} GP` : "—"}
                        </span>
                      </div>

                      {/* Remove Subject Button */}
                      <button
                        type="button"
                        onClick={() => removeSubject(sub.id)}
                        disabled={subjects.length <= 1}
                        aria-label={`Remove subject ${index + 1}`}
                        className={`grid h-9 w-9 place-items-center rounded-xl border transition cursor-pointer shrink-0 ${
                          subjects.length <= 1
                            ? "opacity-30 border-border text-muted-foreground cursor-not-allowed"
                            : "border-border text-muted-foreground hover:text-red-400 hover:border-red-400/40 hover:bg-red-500/10"
                        }`}
                        title="Remove Subject"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons: Add Subject & Reset */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  onClick={addSubject}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold font-bold px-4 py-2 text-xs transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Another Subject</span>
                </button>

                <button
                  type="button"
                  onClick={resetSubjects}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary/60 text-muted-foreground hover:text-foreground font-medium px-3.5 py-2 text-xs transition cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Subjects</span>
                </button>
              </div>
            </div>

            {/* RESULTS SCORECARD COLUMN */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="rounded-3xl border border-border bg-gradient-to-b from-card via-secondary/20 to-card p-6 sm:p-8 space-y-6 shadow-lift">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold block">
                    Calculated Result
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Semester Grade Point Average
                  </span>
                </div>

                {/* Big Clean Typographic Output */}
                <div className="py-2 border-y border-border/80">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block">
                    SEMESTER GPA
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-5xl sm:text-6xl font-black text-gold tracking-tight">
                      {sgpaCalculation.gpaString}
                    </span>
                    {sgpaCalculation.hasResult && (
                      <span className="text-sm font-mono text-muted-foreground font-medium">
                        / 10.00
                      </span>
                    )}
                  </div>
                </div>

                {/* Metric Summary Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Total Semester Credits:</span>
                    <span className="font-mono font-bold text-foreground">
                      {sgpaCalculation.totalCredits} Credits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Weighted Credit Points:</span>
                    <span className="font-mono font-bold text-foreground">
                      {sgpaCalculation.totalCreditPoints} Points
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Graded Course Count:</span>
                    <span className="font-mono font-bold text-foreground">
                      {sgpaCalculation.gradedSubjectsCount} of {subjects.length}
                    </span>
                  </div>
                  {sgpaCalculation.percentageString && (
                    <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/60">
                      <span>CUSAT % Equivalent:</span>
                      <span className="font-mono font-bold text-gold">
                        ~{sgpaCalculation.percentageString}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Callout */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                    sgpaCalculation.hasResult
                      ? "border-gold/30 bg-gold/10 text-gold"
                      : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  {sgpaCalculation.hasResult ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  )}
                  <p className="leading-relaxed font-medium">{sgpaCalculation.statusMessage}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             TAB 2: CUMULATIVE CGPA (MULTI-SEMESTER)
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* SEMESTER LIST COLUMN */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    Completed Semester SGPAs
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Enter the calculated SGPA and registered credits for each completed semester.
                  </p>
                </div>

                <span className="text-xs font-mono text-muted-foreground">
                  ({semesters.length} Semesters)
                </span>
              </div>

              {/* Semester Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {semesters.map((sem, index) => (
                  <div
                    key={sem.id}
                    className="p-4 rounded-2xl border border-border/80 bg-secondary/30 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-card border border-border text-xs font-mono font-bold text-muted-foreground">
                        S{index + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-foreground block">
                          {sem.semesterName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                          <span>Credits:</span>
                          <input
                            type="number"
                            min="1"
                            max="35"
                            value={sem.credits}
                            onChange={(e) =>
                              updateSemesterField(
                                sem.id,
                                "credits",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-10 text-center rounded border border-border bg-card px-1 py-0.5 font-bold text-foreground text-[11px] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="SGPA (0-10)"
                        value={sem.sgpa}
                        onChange={(e) => updateSemesterField(sem.id, "sgpa", e.target.value)}
                        className="w-24 rounded-xl border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-bold text-foreground text-center outline-none focus:border-gold transition"
                      />

                      <button
                        type="button"
                        onClick={() => removeSemester(sem.id)}
                        disabled={semesters.length <= 1}
                        aria-label={`Remove semester ${index + 1}`}
                        className={`grid h-8 w-8 place-items-center rounded-lg border transition cursor-pointer ${
                          semesters.length <= 1
                            ? "opacity-30 border-border text-muted-foreground cursor-not-allowed"
                            : "border-border text-muted-foreground hover:text-red-400 hover:border-red-400/40 hover:bg-red-500/10"
                        }`}
                        title="Remove Semester"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  onClick={addSemester}
                  disabled={semesters.length >= 8}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold font-bold px-4 py-2 text-xs transition cursor-pointer disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Next Semester</span>
                </button>

                <button
                  type="button"
                  onClick={resetSemesters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary/60 text-muted-foreground hover:text-foreground font-medium px-3.5 py-2 text-xs transition cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Semesters</span>
                </button>
              </div>
            </div>

            {/* RESULTS SCORECARD COLUMN */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="rounded-3xl border border-border bg-gradient-to-b from-card via-secondary/20 to-card p-6 sm:p-8 space-y-6 shadow-lift">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold block">
                    Calculated Result
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Cumulative Grade Point Average
                  </span>
                </div>

                {/* Big Clean Typographic Output */}
                <div className="py-2 border-y border-border/80">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block">
                    CUMULATIVE CGPA
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-5xl sm:text-6xl font-black text-gold tracking-tight">
                      {cgpaCalculation.cgpaString}
                    </span>
                    {cgpaCalculation.hasResult && (
                      <span className="text-sm font-mono text-muted-foreground font-medium">
                        / 10.00
                      </span>
                    )}
                  </div>
                </div>

                {/* Metric Summary Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Total Evaluated Credits:</span>
                    <span className="font-mono font-bold text-foreground">
                      {cgpaCalculation.totalCredits} Credits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Semesters Included:</span>
                    <span className="font-mono font-bold text-foreground">
                      {cgpaCalculation.validCount} of {semesters.length}
                    </span>
                  </div>
                  {cgpaCalculation.percentageString && (
                    <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/60">
                      <span>CUSAT % Equivalent:</span>
                      <span className="font-mono font-bold text-gold">
                        ~{cgpaCalculation.percentageString}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Callout */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                    cgpaCalculation.hasResult
                      ? "border-gold/30 bg-gold/10 text-gold"
                      : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  {cgpaCalculation.hasResult ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  )}
                  <p className="leading-relaxed font-medium">{cgpaCalculation.statusMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
