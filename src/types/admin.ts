/**
 * MESAC Admin Dashboard — Frontend Data Models & Integration Contracts
 *
 * Defines domain types, authentication states, and typed service interfaces
 * for the backend developer to integrate with.
 */

import type {
  ArchiveDocument,
  Event,
  GalleryAlbum,
  TeamMember,
  FacultyMember,
  DepartmentProgram,
  Lab,
  AcademyTrack,
  Achievement,
  Placement,
  ContactSubmission,
  EnrollmentSubmission,
  AdminUser,
  SiteSettings,
  HomePageContent,
} from "./models";

// ==========================================
// 1. AUTHENTICATION & SESSION TYPES
// ==========================================

export type AdminAuthStatus =
  "loading" | "unauthenticated" | "authenticated" | "unauthorized" | "error" | "prototype-preview";

export interface AdminSession {
  user: AdminUser;
  tokenExpiresAt: string;
  provider: "google" | "email" | "prototype";
}

export interface AuthState {
  status: AdminAuthStatus;
  session: AdminSession | null;
  error?: string | null;
  isPrototypeMode: boolean;
}

// ==========================================
// 2. INBOX & REPORTS
// ==========================================

export type ArchiveReportIssueType =
  | "wrong_subject"
  | "blurry_pages"
  | "missing_pages"
  | "broken_download"
  | "incorrect_year_scheme"
  | "copyright_concern"
  | "other";

export interface ArchiveProblemReport {
  id: string;
  documentId: string;
  documentTitle: string;
  subjectCode?: string;
  semester?: number | string;
  issueType: ArchiveReportIssueType;
  description: string;
  reportedBy?: string;
  reporterEmail?: string;
  createdAt: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  resolutionNotes?: string;
}

// ==========================================
// 3. AUDIT & ACTIVITY LOGS
// ==========================

export type ActivityAction =
  "create" | "update" | "delete" | "archive" | "export" | "publish" | "status_change";

export type ActivityEntityType =
  | "archive_document"
  | "event"
  | "gallery_album"
  | "team_member"
  | "achievement"
  | "placement"
  | "faculty_member"
  | "academy_track"
  | "inbox_item"
  | "site_settings"
  | "admin_user"
  | "system_backup";

export interface ActivityLogEntry {
  id: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string;
  entityTitle: string;
  summary: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

// ==========================================
// 4. BACKUPS & EXPORTS
// ==========================================

export type BackupStatus = "completed" | "in_progress" | "failed" | "scheduled";

export interface BackupRecord {
  id: string;
  name: string;
  type: "full_database" | "archive_metadata" | "gallery_manifest" | "content_json";
  sizeBytes: number;
  status: BackupStatus;
  createdAt: string;
  verifiedAt?: string;
  checksum?: string;
  downloadUrl?: string;
  isAutomatic: boolean;
}

// ==========================================
// 5. ARCHIVE HEALTH CHECK
// ==========================================

export type ArchiveHealthSeverity = "error" | "warning" | "ok";

export interface ArchiveHealthIssue {
  documentId: string;
  documentTitle: string;
  subject: string;
  severity: ArchiveHealthSeverity;
  issueCode:
    | "missing_drive_file"
    | "permission_denied"
    | "invalid_file_size"
    | "missing_metadata"
    | "unindexed_pdf";
  message: string;
  lastChecked: string;
}

// ==========================================
// 6. BACKEND SERVICE INTEGRATION CONTRACTS
// ==========================================

/**
 * Service contract for Authentication operations.
 * The backend developer will implement these methods.
 */
export interface AuthServiceContract {
  checkSession(): Promise<AdminSession | null>;
  signInWithGoogle(): Promise<{ redirectUrl: string } | void>;
  initiateEmailSignIn(email: string): Promise<{ success: boolean; message: string }>;
  verifyEmailSignIn?(email: string, code: string): Promise<AdminSession>;
  signOut(): Promise<void>;
}

/**
 * Service contract for Academic Archive management.
 */
export interface ArchiveServiceContract {
  list(filters?: {
    search?: string;
    department?: string;
    program?: string;
    semester?: string | number;
    scheme?: string;
    type?: string;
  }): Promise<ArchiveDocument[]>;
  getById(id: string): Promise<ArchiveDocument | null>;
  create(document: Omit<ArchiveDocument, "id">, file?: File): Promise<ArchiveDocument>;
  update(id: string, updates: Partial<ArchiveDocument>): Promise<ArchiveDocument>;
  replaceFile(id: string, file: File): Promise<ArchiveDocument>;
  delete(id: string): Promise<void>;
  bulkTag(documentIds: string[], tags: string[]): Promise<void>;
  runHealthCheck(): Promise<ArchiveHealthIssue[]>;
}

/**
 * Service contract for Events.
 */
export interface EventsServiceContract {
  list(): Promise<Event[]>;
  create(event: Omit<Event, "id">): Promise<Event>;
  update(id: string, updates: Partial<Event>): Promise<Event>;
  delete(id: string): Promise<void>;
}

/**
 * Service contract for Team.
 */
export interface TeamServiceContract {
  list(academicYear?: string): Promise<TeamMember[]>;
  create(member: Omit<TeamMember, "id">): Promise<TeamMember>;
  update(id: string, updates: Partial<TeamMember>): Promise<TeamMember>;
  delete(id: string): Promise<void>;
  startNewAcademicYear(newYear: string, archiveCurrent: boolean): Promise<{ success: boolean }>;
}

/**
 * Service contract for Inbox.
 */
export interface InboxServiceContract {
  listEnrollments(): Promise<EnrollmentSubmission[]>;
  updateEnrollmentStatus(id: string, status: EnrollmentSubmission["status"]): Promise<void>;
  listContacts(): Promise<ContactSubmission[]>;
  updateContactStatus(id: string, status: ContactSubmission["status"]): Promise<void>;
  listArchiveReports(): Promise<ArchiveProblemReport[]>;
  updateArchiveReportStatus(id: string, status: ArchiveProblemReport["status"]): Promise<void>;
}
