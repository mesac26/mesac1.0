import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { EmptyState } from "@/components/EmptyState";
import { FacultyCard } from "@/components/department/FacultyCard";
import {
  mockDepartmentOverview,
  mockDepartmentHOD,
  mockDepartmentFaculty,
  mockDepartmentPrograms,
  mockDepartmentLabs,
  facultyDriveUrl,
} from "@/data/mock";
import {
  Building2,
  GraduationCap,
  FlaskConical,
  Users,
  Search,
  FileText,
  ExternalLink,
  LayoutGrid,
  Table as TableIcon,
  Flame,
  Compass,
  Cpu,
  Microscope,
  Wrench,
  ShieldCheck,
  X,
  Target,
  Sparkles,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/mechanical-dept")({
  head: () => ({
    meta: [
      { title: "Division of Mechanical Engineering — School of Engineering, CUSAT" },
      {
        name: "description",
        content:
          "Official portal of the Division of Mechanical Engineering, School of Engineering, CUSAT — Head of Division, academic programs, research laboratories, and faculty directory.",
      },
      { property: "og:title", content: "Mechanical Engineering Division — CUSAT" },
      {
        property: "og:description",
        content:
          "Programs, laboratories, faculty roster, and academic information for CUSAT Mechanical Engineering.",
      },
    ],
  }),
  component: DeptPage,
});

const labIcons = [Flame, Compass, Cpu, Microscope, Wrench, ShieldCheck];

function DeptPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter faculty by search query (name, role, specialization) and role filter
  const filteredFaculty = useMemo(() => {
    return mockDepartmentFaculty.filter((f) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.role.toLowerCase().includes(q) ||
        (f.specialization && f.specialization.toLowerCase().includes(q));

      const matchesRole =
        selectedRoleFilter === "All" ||
        (selectedRoleFilter === "Professors" &&
          f.role.includes("Professor") &&
          !f.role.includes("Assistant") &&
          !f.role.includes("Associate")) ||
        (selectedRoleFilter === "Associate Professors" && f.role.includes("Associate Professor")) ||
        (selectedRoleFilter === "Assistant Professors" && f.role.includes("Assistant Professor"));

      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRoleFilter]);

  const roleFilterOptions = ["All", "Professors", "Associate Professors", "Assistant Professors"];

  return (
    <Layout>
      {/* 1. HERO BANNER */}
      <PageHero
        variant="academic"
        eyebrow="School of Engineering · CUSAT"
        title={
          <>
            DIVISION OF <span className="italic text-gold">MECHANICAL ENGINEERING</span>
          </>
        }
        subtitle="Established in 1995, the mechanical engineering division at Cochin University of Science and Technology, offering undergraduate, postgraduate, and doctoral research programs."
      />

      {/* 2. DEPARTMENT OVERVIEW & MISSION/VISION */}
      <section className="py-14 sm:py-20 bg-background border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Overview Summary */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Building2 className="h-3.5 w-3.5 text-gold" />
                  <span>Division Overview</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  About the Division
                </h2>
                <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {mockDepartmentOverview.summary}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Established:</span>{" "}
                    {mockDepartmentOverview.establishedYear}
                  </div>
                  <div className="rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Institution:</span>{" "}
                    {mockDepartmentOverview.school}, CUSAT
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Mission & Vision Cards */}
            <div className="lg:col-span-5 space-y-5">
              <Reveal delay={60}>
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-gold shrink-0" />
                    <h3 className="font-display text-base font-extrabold text-foreground uppercase tracking-wide">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {mockDepartmentOverview.vision}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-gold shrink-0" />
                    <h3 className="font-display text-base font-extrabold text-foreground uppercase tracking-wide">
                      Division Mission
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                    {mockDepartmentOverview.mission.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HEAD OF DIVISION (HOD SPOTLIGHT) */}
      <section className="py-12 sm:py-16 bg-card/60 border-b border-border/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-6 text-center">
              <span className="inline-block rounded-full bg-secondary/80 border border-border/80 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-gold mb-2">
                Division Leadership
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Head of Division
              </h2>
            </div>

            <div className="rounded-3xl border border-gold/30 bg-card p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 max-w-2xl mx-auto">
              {mockDepartmentHOD.img && (
                <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border border-border/80 bg-secondary shadow-lg shrink-0">
                  <img
                    src={mockDepartmentHOD.img}
                    alt={`${mockDepartmentHOD.name} - Head of Division`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                    {mockDepartmentHOD.name}
                  </h3>
                  <div className="inline-block rounded-md bg-secondary text-gold font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 mt-1">
                    {mockDepartmentHOD.designation}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground/80 block">Department:</span>
                  <span>{mockDepartmentHOD.department}</span>
                </div>

                {mockDepartmentHOD.specialization && (
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground/80 block">Specialization:</span>
                    <span>{mockDepartmentHOD.specialization}</span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. ACADEMIC PROGRAMS */}
      <section className="py-14 sm:py-20 bg-background border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <GraduationCap className="h-3.5 w-3.5 text-gold" />
                  <span>Curriculum</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  Academic Degree Programs
                </h2>
              </div>
              <Link
                to="/archive"
                className="text-xs font-bold text-gold hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Browse Academic Archive</span>
                <span>→</span>
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {mockDepartmentPrograms.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 card-lift h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                      <span className="text-muted-foreground">{p.duration}</span>
                      {p.intake && (
                        <span className="rounded-full bg-secondary text-gold px-3 py-1 font-bold">
                          {p.intake}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-gold" />
                      <span>{p.degree} Curriculum</span>
                    </span>
                    <Link to="/downloads" className="text-gold font-medium hover:underline">
                      View Syllabus Papers →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RESEARCH & INSTRUCTIONAL LABORATORIES */}
      <section className="py-14 sm:py-20 bg-secondary/15 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <FlaskConical className="h-3.5 w-3.5 text-gold" />
                <span>Facilities</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Laboratories & Testing Centers
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Specialized instructional and research laboratories in the Division of Mechanical
                Engineering.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockDepartmentLabs.map((lab, idx) => {
              const IconComp = labIcons[idx % labIcons.length] || Wrench;
              return (
                <Reveal key={lab.id} delay={(idx % 6) * 40}>
                  <div className="group rounded-2xl border border-border/80 bg-card p-6 card-lift h-full flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="h-10 w-10 rounded-xl bg-secondary border border-border/80 flex items-center justify-center text-gold mb-4 group-hover:scale-105 transition-transform">
                        <IconComp className="h-5 w-5" />
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-gold transition-colors">
                        {lab.name}
                      </h3>
                      {lab.description && (
                        <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                          {lab.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/60">
                      <span className="text-[11px] text-muted-foreground">
                        Division of Mechanical Engineering, CUSAT
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FACULTY DIRECTORY */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Users className="h-3.5 w-3.5 text-gold" />
                  <span>Academic Roster ({mockDepartmentFaculty.length} Members)</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  Faculty Directory
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Professors, associate professors, and assistant professors in the Division of
                  Mechanical Engineering.
                </p>
              </div>

              <a
                href={facultyDriveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-5 py-3 text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer min-h-[44px]"
              >
                <FileText className="h-4 w-4" />
                <span>View Official Faculty Sheet</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                {/* Search input */}
                <div className="relative flex-1 max-w-md">
                  <Search
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                  />
                  <input
                    type="text"
                    aria-label="Search faculty directory by name, designation, or specialization"
                    placeholder="Search faculty name, role, specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none min-h-[40px] shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Role / Designation Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  {roleFilterOptions.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRoleFilter(role)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 cursor-pointer min-h-[36px] whitespace-nowrap ${
                        selectedRoleFilter === role
                          ? "bg-secondary text-foreground font-bold border border-border"
                          : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* View mode toggle (Grid vs Table) */}
              <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline mr-2">
                  {filteredFaculty.length}{" "}
                  {filteredFaculty.length === 1 ? "Faculty" : "Faculty Members"}
                </span>

                <div className="inline-flex rounded-xl border border-border/80 bg-background p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer min-h-[34px] ${
                      viewMode === "grid"
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer min-h-[34px] ${
                      viewMode === "table"
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Table Directory View"
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                    <span>Table</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* FACULTY RENDERING */}
          {filteredFaculty.length === 0 ? (
            <EmptyState
              title={
                searchQuery
                  ? `No faculty matching "${searchQuery}"`
                  : `No faculty matching the selected role`
              }
              description="Try adjusting your search query or selecting 'All' roles from the filter."
              actionText="Reset All Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedRoleFilter("All");
              }}
            />
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredFaculty.map((f, i) => (
                <Reveal key={f.id} delay={(i % 8) * 30}>
                  <FacultyCard faculty={f} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/60 text-foreground font-extrabold uppercase tracking-wider border-b border-border/80">
                    <tr>
                      <th className="py-3.5 px-4">Ref</th>
                      <th className="py-3.5 px-4">Faculty Member</th>
                      <th className="py-3.5 px-4">Designation</th>
                      <th className="py-3.5 px-4">Specialization</th>
                      <th className="py-3.5 px-4">Affiliation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredFaculty.map((f) => (
                      <tr key={f.id} className="hover:bg-secondary/30 transition">
                        <td className="py-3 px-4 font-mono font-bold text-muted-foreground">
                          ME-{f.slNo ? (f.slNo < 10 ? `0${f.slNo}` : f.slNo) : "--"}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">{f.name}</td>
                        <td className="py-3 px-4 text-gold font-semibold">{f.role}</td>
                        <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                          {f.specialization || "Mechanical Engineering"}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {f.department || "SOE CUSAT"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </Layout>
  );
}
