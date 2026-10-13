/**
 * MESAC (Mechanical Engineering Students' Association, CUSAT)
 * Core Domain Types & Data Models
 *
 * Prepared for future architecture backed by Cloudflare D1 (SQLite)
 * and Cloudflare R2 / Google Drive storage.
 */

// ==========================================
// 1. SITE & GLOBAL CONFIGURATION
// ==========================================

export interface SiteSocialLinks {
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  github?: string;
  whatsapp?: string;
}

export interface SiteAnnouncement {
  id: string;
  enabled: boolean;
  badge?: string;
  text: string;
  link?: string;
  target?: "_blank" | "_self";
  expiresAt?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  organizationName: string; // e.g. "Mechanical Engineering Students' Association"
  institutionName: string; // e.g. "School of Engineering, CUSAT"
  tagline: string;
  contactEmail: string;
  contactPhone?: string;
  officeAddress: string;
  socialLinks: SiteSocialLinks;
  activeAcademicYear: string; // e.g. "2026-27"
  announcement?: SiteAnnouncement;
  meta: {
    title: string;
    description: string;
    ogImageUrl?: string;
  };
}

export interface HeroStat {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
}

export interface HomePageContent {
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2?: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stats: HeroStat[];
  };
  aboutSection: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    features: Array<{
      title: string;
      description: string;
      iconName?: string;
    }>;
  };
  featuredEventIds: string[];
  featuredGalleryImageIds: string[];
  featuredPlacementCompanyIds?: string[];
}

// ==========================================
// 2. EVENTS & WORKSHOPS
// ==========================================

export type EventCategory =
  "Flagship" | "Workshop" | "Seminar" | "Competition" | "Industrial Visit" | "Technical Talk";

export type EventStatus = "upcoming" | "ongoing" | "completed";

export interface Event {
  id: string;
  title: string;
  slug: string;
  tag: EventCategory | string;
  date: string;
  endDate?: string;
  location: string;
  coordinator: string;
  desc: string;
  fullDetails?: string;
  prizePool?: string;
  images: string[];
  isFeatured?: boolean;
  status?: EventStatus;
  registrationUrl?: string;
  registrationOpen?: boolean;
  prerequisites?: string[];
  agenda?: Array<{
    time: string;
    sessionTitle: string;
    speaker?: string;
  }>;
  galleryAlbumId?: string;
}

// ==========================================
// 3. GALLERY & MEDIA
// ==========================================

export type GalleryCategory =
  "Workshops" | "Sessions" | "Events" | "Alumni" | "Industrial Visits" | "Competitions";

export interface GalleryAlbum {
  id: string;
  title: string;
  category: GalleryCategory | string;
  description?: string;
  coverImage: string;
  date: string;
  imageCount: number;
  relatedEventId?: string;
}

export interface GalleryImage {
  id: string;
  albumId?: string;
  src: string;
  label: string;
  category: GalleryCategory | string;
  date: string;
  description?: string;
  isFeatured?: boolean;
  width?: number;
  height?: number;
}

// ==========================================
// 4. TEAM & LEADERSHIP
// ==========================
export type TeamRoleTier = "advisor" | "core" | "lead" | "coordinator" | "member";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: TeamRoleTier;
  academicYear: string; // e.g. "2026-27"
  img: string;
  dept?: string;
  email?: string;
  linkedin?: string;
  order?: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  role: string; // e.g. "Professor & HOD", "Professor", etc.
  department: string;
  qualification?: string;
  email?: string;
  phone?: string;
  showContact?: boolean;
  img?: string;
  specialization?: string;
  researchAreas?: string[];
  slNo?: number;
}

export interface HistoricalOfficer {
  name: string;
  role: string;
  img?: string;
}

export interface AcademicYear {
  id: string;
  year: string; // e.g. "2025-26"
  isCurrent: boolean;
  advisor: string;
  core: HistoricalOfficer[];
  members?: HistoricalOfficer[];
}

// ==========================================
// 5. ACHIEVEMENTS & PLACEMENTS
// ==========================================

export interface Achievement {
  id: string;
  title: string;
  category: "Student Project" | "Competition" | "Award" | "Research" | "Innovation" | string;
  teamOrStudent: string;
  year: string;
  description?: string;
  details?: string;
  image?: string;
  images?: string[];
  badge?: string;
  rank?: string;
  bullets?: string[];
  eventOrCompetition?: string;
}

export interface Placement {
  id: string;
  company: string;
  logoUrl?: string;
  academicYear: string;
  studentName?: string;
  role?: string;
  degree?: string;
  packageLpa?: number | string;
  category?:
    | "Core Mechanical"
    | "Automotive"
    | "Energy"
    | "Analytics & Tech"
    | "Consulting"
    | "Marine & Shipping"
    | string;
}

export interface PlacementBrochure {
  title: string;
  batch: string;
  url: string;
  description?: string;
}

// ==========================================
// 6. DEPARTMENT & ACADEMICS
// ==========================================

export interface DepartmentProgram {
  id: string;
  name: string; // e.g. "B.Tech in Mechanical Engineering"
  degree: "B.Tech" | "M.Tech" | "Ph.D." | string;
  duration: string;
  intake?: number | string;
  description: string;
  highlights?: string[];
  curriculumUrl?: string;
}

export interface Lab {
  id: string;
  name: string;
  code?: string;
  description?: string;
  facultyInCharge?: string;
  location?: string;
  imageUrl?: string;
}

export interface DepartmentOverview {
  name: string;
  establishedYear: number;
  school: string;
  university: string;
  summary: string;
  mission: string[];
  vision: string;
}

export interface AcademyTrack {
  id: string;
  title: string;
  trackCode: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  instructor?: string;
  description: string;
  modules: string[];
  prerequisites?: string[];
  status?: "open" | "upcoming" | "completed";
  enrollmentUrl?: string;
  // Compatibility fields for existing track structure
  n?: string;
  t?: string;
  d?: string;
  tools?: string[];
  pdfUrl?: string;
  pdfTitle?: string;
}

export type CusatGradeLetter = "S" | "A" | "B" | "C" | "D" | "E" | "F";

export interface CusatGradeInfo {
  letter: CusatGradeLetter;
  points: number;
  percentageRange: string;
  description: string;
}

// ==========================================
// 7. ACADEMIC ARCHIVE (CRITICAL LAUNCH MODEL)
// ==========================================

export type ArchiveDocumentType = "question_paper" | "syllabus" | "notes" | "lab_manual";

export interface ArchiveDocumentPreview {
  url?: string;
  thumbnailUrl?: string;
  fileSize?: string;
  fileType?: string;
  pageCount?: number;
}

export interface ArchiveDocumentDownload {
  url?: string;
  directDownloadAvailable: boolean;
  downloadCount?: number;
}

export interface ArchiveDocument {
  id: string;
  title: string;
  department: string; // e.g. "Mechanical Engineering"
  program: string; // e.g. "B.Tech"
  semester: number | string; // e.g. 5 or "Semester 5"
  subject: string; // e.g. "Fluid Machinery"
  subjectCode: string; // e.g. "19-204-0504"
  scheme: string; // e.g. "2019 Scheme"
  examYear: number; // e.g. 2024
  examMonth: string; // e.g. "April/May" or "November/December"
  type: ArchiveDocumentType;
  tags: string[];
  driveFileId: string; // Google Drive File ID for primary storage
  preview: ArchiveDocumentPreview;
  download: ArchiveDocumentDownload;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 8. FORM SUBMISSIONS & ADMIN USERS
// ==========================================

export type SubmissionStatus = "new" | "read" | "responded" | "archived";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: "General Inquiry" | "Event Collaboration" | "Sponsorship" | "Alumni Network" | string;
  turnstileToken?: string;
  createdAt: string;
  status: SubmissionStatus;
  notes?: string;
}

export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface EnrollmentSubmission {
  id: string;
  studentName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  branch: string;
  semester: number | string;
  trackId?: string; // Links to AcademyTrack
  turnstileToken?: string;
  createdAt: string;
  status: EnrollmentStatus;
}

export type AdminUserRole = "superadmin" | "editor" | "moderator";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminUserRole;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// ==========================================
// 9. ALUMNI NETWORK & REGISTRATION
// ==========================================

export type AlumniDepartment = "Mechanical Engineering" | "Other";

export interface AlumniRegistrationFormValues {
  fullName: string;
  graduationYear: string;
  department?: AlumniDepartment | "";
  email: string;
  phone: string;
  organization?: string;
  location?: string;
}

export interface AlumniRegistrationErrors {
  fullName?: string;
  graduationYear?: string;
  department?: string;
  email?: string;
  phone?: string;
  organization?: string;
  location?: string;
}

export interface AlumniRecord extends AlumniRegistrationFormValues {
  id: string;
  alumniIdCode: string;
  registeredAt: string;
}
