import type { FacultyMember, TeamMember, AcademicYear } from "@/types";

export const DEFAULT_FACULTY_IMG = "/images/team/faculty.png";
export const DEFAULT_GROUP_BANNER = "/images/home/hero.jpg";

export const mockFacultyAdvisors: FacultyMember[] = [
  {
    id: "faculty-dr-biju-n",
    name: "Dr. Biju N",
    role: "Head of Division & Faculty Advisor",
    designation: "Professor & Head of Division",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    img: "/images/team/faculty.png",
    qualification: "Ph.D., M.Tech",
  },
];

export const mockCoreOfficers2026: TeamMember[] = [
  {
    id: "officer-jaanaky",
    role: "PRESIDENT",
    name: "JAANAKY RENGITH",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/president.jpg",
    order: 1,
  },
  {
    id: "officer-kalidasan",
    role: "SECRETARY",
    name: "KALIDASAN V R",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/secretary.jpg",
    order: 2,
  },
  {
    id: "officer-sreehari",
    role: "TREASURER",
    name: "SREEHARI",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/sreehari.jpg",
    order: 3,
  },
  {
    id: "officer-razeen",
    role: "VICE PRESIDENT",
    name: "RAZEEN",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/Razeen.jpg",
    order: 4,
  },
  {
    id: "officer-midlaj",
    role: "JOINT SECRETARY",
    name: "MIDLAJ",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/Midlaj.jpg",
    order: 5,
  },
  {
    id: "officer-naveen",
    role: "CHIEF TASKFORCE",
    name: "NAVEEN",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/Naveen.jpg",
    order: 6,
  },
  {
    id: "officer-abhiram",
    role: "TASKFORCE LEAD",
    name: "ABHIRAM",
    tier: "core",
    academicYear: "2026-27",
    img: "/images/team/ABHIRAM.jpg",
    order: 7,
  },
];

export const mockDepartmentHeads2026: TeamMember[] = [
  {
    id: "lead-anna",
    role: "HEAD EVENT & MARKETING",
    name: "ANNA JOSE",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Anna.jpg",
    order: 8,
  },
  {
    id: "lead-gokul",
    role: "HEAD EVENT & MARKETING",
    name: "GOKUL KRISHNA",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Gokul.jpg",
    order: 9,
  },
  {
    id: "lead-jinta",
    role: "HEAD PR & ALUMNI",
    name: "JINTA",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/jinta.jpg",
    order: 10,
  },
  {
    id: "lead-annson",
    role: "HEAD PR & ALUMNI",
    name: "ANNSON D DINESH",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Annson.jpg",
    order: 11,
  },
  {
    id: "lead-mithil",
    role: "HEAD EDITORIAL",
    name: "K L MITHIL",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/MITHIL.jpg",
    order: 12,
  },
  {
    id: "lead-shamil",
    role: "HEAD EDITORIAL",
    name: "SHAMIL",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Shamil.jpg",
    order: 13,
  },
  {
    id: "lead-ashish",
    role: "HEAD TECHNICAL",
    name: "ASHISH PANSHOTRA",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/ashish.jpg",
    order: 14,
  },
  {
    id: "lead-aibel",
    role: "HEAD TECHNICAL",
    name: "AIBEL JOY",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Aibel.jpg",
    order: 15,
  },
  {
    id: "lead-hariraj",
    role: "HEAD ACADEMICS",
    name: "HARIRAJ P",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Hariraj.jpg",
    order: 16,
  },
  {
    id: "lead-asna",
    role: "HEAD ACADEMICS",
    name: "ASNA",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Asna.jpg",
    order: 17,
  },
  {
    id: "lead-abhinav",
    role: "HEAD MEDIA",
    name: "ABHINAV",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/abhinav.jpg",
    order: 18,
  },
  {
    id: "lead-ashfaque",
    role: "HEAD MEDIA",
    name: "ASHFAQUE M",
    tier: "lead",
    academicYear: "2026-27",
    img: "/images/team/Ashfaque.jpeg",
    order: 19,
  },
];

export const mockPreviousCommittees: AcademicYear[] = [
  {
    id: "year-2025-26",
    year: "2025-26",
    isCurrent: false,
    advisor: "Dr BIJU N (FACULTY ADVISOR)",
    core: [
      { name: "SANDRA V M", role: "PRESIDENT" },
      { name: "JAANAKY RENGITH", role: "VICE PRESIDENT" },
      { name: "HARIGOVIND R", role: "SECRETARY" },
      { name: "GOKUL KRISHNA", role: "JT. SECRETARY" },
      { name: "ADITYA DAS", role: "CHIEF TASK FORCE" },
      { name: "ROCH GIJY", role: "TREASURER" },
    ],
    members: [
      { name: "HYZAM K & ASHISH PANSHOTRA", role: "TECHNICAL HEADS" },
      { name: "HARINADH SADISH & ANNA JOSE", role: "EVENT & MARKETING HEADS" },
      { name: "NIHAN N & KALIDASAN V R", role: "MEDIA HEADS" },
      { name: "AMRITHA A & JINTA THERES", role: "P R & ALUMNI HEADS" },
      { name: "INDULEKHA T R & HARIRAJ P", role: "ACADEMICS HEADS" },
      { name: "DRUPAD B R & AZIYA HANAN", role: "EDITORIAL HEADS" },
    ],
  },
  {
    id: "year-2024-25",
    year: "2024-25",
    isCurrent: false,
    advisor: "Dr BIJU N (FACULTY ADVISOR)",
    core: [
      { name: "ASHIQUE AJAY M", role: "PRESIDENT" },
      { name: "SANDRA V M", role: "VICE-PRESIDENT" },
      { name: "VISWAJITH", role: "SECRETARY" },
      { name: "ADITYA DAS", role: "Jt. SECRETARY" },
      { name: "JISHNU K R", role: "CHIEF TASK FORCE" },
      { name: "ASIF AHAMMAD H", role: "TREASURER" },
    ],
  },
  {
    id: "year-2023-24",
    year: "2023-24",
    isCurrent: false,
    advisor: "Dr BIJU N (FACULTY ADVISOR)",
    core: [
      { name: "ADHITYAN A J", role: "PRESIDENT" },
      { name: "SMEERA SMITH", role: "VICE-PRESIDENT" },
      { name: "MINU K", role: "SECRETARY" },
      { name: "ASIF AHAMMAD H", role: "Jt. SECRETARY" },
      { name: "GOKUL S S", role: "CHIEF TASK FORCE" },
      { name: "AADHLE MOHAMED HARRIS", role: "TREASURER" },
    ],
  },
  {
    id: "year-2022-23",
    year: "2022-23",
    isCurrent: false,
    advisor: "Dr BIJU N (FACULTY ADVISOR)",
    core: [
      { name: "HARSHA HEMACHANDRAN", role: "PRESIDENT" },
      { name: "AADHLE MOHAMED HARRIS", role: "VICE-PRESIDENT" },
      { name: "ADIL KRISHNA K BINU", role: "SECRETARY" },
      { name: "ABID HUSSAIN C A", role: "Jt. SECRETARY" },
      { name: "JAYADEVAN P", role: "CHIEF TASK FORCE" },
      { name: "VAISHNAV BALAGOPAL", role: "TREASURER" },
    ],
  },
  {
    id: "year-2021-22",
    year: "2021-22",
    isCurrent: false,
    advisor: "Dr BIJU N (FACULTY ADVISOR)",
    core: [
      { name: "MIDHUN P", role: "PRESIDENT" },
      { name: "ASWANTH K T", role: "VICE-PRESIDENT" },
      { name: "SAQIB NAWAZ", role: "SECRETARY" },
      { name: "SREEHARI P", role: "Jt. SECRETARY" },
      { name: "KAUSHIK KRISHNA J", role: "TREASURER" },
    ],
  },
];

// Active term identifier
export const CURRENT_ACADEMIC_YEAR = "2026-27";

/**
 * Representation of the current active committee as an AcademicYear model.
 * Enables the upcoming dashboard action ("Start new academic year") to archive
 * this committee dynamically by setting isCurrent: false and moving it to the archive.
 */
export const mockCurrentAcademicYear: AcademicYear = {
  id: "year-2026-27",
  year: CURRENT_ACADEMIC_YEAR,
  isCurrent: true,
  advisor: "Dr. Biju N (Head of Division & Faculty Advisor)",
  core: mockCoreOfficers2026.map((m) => ({
    name: m.name,
    role: m.role,
    img: m.img,
  })),
  members: mockDepartmentHeads2026.map((m) => ({
    name: m.name,
    role: m.role,
    img: m.img,
  })),
};

/**
 * All committees ordered with current term first followed by past academic years.
 * Ready for future backend integration where active terms are toggled by the admin dashboard.
 */
export const mockAllCommittees: AcademicYear[] = [
  mockCurrentAcademicYear,
  ...mockPreviousCommittees,
];

/**
 * Returns the currently active academic committee record
 */
export function getCurrentAcademicCommittee(): AcademicYear {
  return mockAllCommittees.find((c) => c.isCurrent) || mockCurrentAcademicYear;
}

/**
 * Returns all archived historical committees
 */
export function getPastCommittees(): AcademicYear[] {
  return mockAllCommittees.filter((c) => !c.isCurrent);
}

/**
 * Returns the list of all available academic year keys
 */
export function getAvailableAcademicYears(): string[] {
  return mockAllCommittees.map((c) => c.year);
}
