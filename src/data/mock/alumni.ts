import type {
  AlumniRecord,
  AlumniDepartment,
  AlumniMeetRegistrationRecord,
  AlumniMeetRegistrationFormValues,
} from "@/types";

/**
 * Graduation batches available for alumni selection.
 * Covers alumni from School of Engineering, CUSAT (Mechanical Engineering).
 */
export const ALUMNI_GRADUATION_YEARS: number[] = Array.from(
  { length: 2026 - 1980 + 1 },
  (_, i) => 2026 - i,
);

export const ALUMNI_DEPARTMENTS: AlumniDepartment[] = ["Mechanical Engineering", "Other"];

/**
 * Generate a temporary unique alumni name/handle based on the person's name
 * e.g. Rahul Kumar -> MESAC_RAHUL_3842
 * e.g. Anjali Nair -> MESAC_ANJALI_7193
 */
export function generateAlumniHandle(fullName: string): string {
  // Extract first name or first token
  const trimmed = fullName.trim();
  const firstName = trimmed.split(/\s+/)[0] || "ALUM";

  // Clean special characters and convert to uppercase
  const cleanName = firstName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "ALUM";

  // Generate random 4-digit number (1000 - 9999)
  const random4Digit = Math.floor(1000 + Math.random() * 9000);

  return `MESAC_${cleanName}_${random4Digit}`;
}

/**
 * Initial sample records for prototype/preview demonstrations
 */
export const MOCK_RECENT_ALUMNI: AlumniRecord[] = [
  {
    id: "alm-1",
    name: "Rahul Kumar",
    fullName: "Rahul Kumar",
    graduationYear: "2018",
    currentOccupation: "Lead Thermal Engineer, Tata Advanced Systems",
    department: "Mechanical Engineering",
    email: "rahul.k@alumni.cusat.ac.in",
    phone: "+91 98470 12345",
    organization: "Tata Advanced Systems",
    location: "Bengaluru, India",
    alumniIdCode: "MESAC_RAHUL_3842",
    registeredAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "alm-2",
    name: "Anjali Nair",
    fullName: "Anjali Nair",
    graduationYear: "2020",
    currentOccupation: "Propulsion Specialist, ISRO Complex",
    department: "Mechanical Engineering",
    email: "anjali.nair@example.com",
    phone: "+91 97455 67890",
    organization: "ISRO Propulsion Complex",
    location: "Mahendragiri, India",
    alumniIdCode: "MESAC_ANJALI_7193",
    registeredAt: "2026-04-02T14:30:00Z",
  },
];

export const DEFAULT_DEMO_ALUMNI: AlumniRecord = {
  id: "alm-demo-1",
  name: "Rahul Kumar",
  fullName: "Rahul Kumar",
  graduationYear: "2018",
  currentOccupation: "Lead Thermal Engineer, Tata Advanced Systems",
  department: "Mechanical Engineering",
  email: "rahul.k@alumni.cusat.ac.in",
  phone: "+91 98470 12345",
  organization: "Tata Advanced Systems",
  location: "Bengaluru, India",
  alumniIdCode: "MESAC_RAHUL_3842",
  registeredAt: "2026-03-15T10:00:00Z",
};

/**
 * In-memory demo state storage.
 * Strictly in-memory (no localStorage / sessionStorage for passwords or credentials).
 */
let inMemoryAlumniSession: AlumniRecord | null = null;
const inMemoryRegisteredAlumni: AlumniRecord[] = [...MOCK_RECENT_ALUMNI];
const inMemoryMeetRegistrations: AlumniMeetRegistrationRecord[] = [];

export function getAlumniSession(): AlumniRecord {
  return inMemoryAlumniSession || inMemoryRegisteredAlumni[0] || DEFAULT_DEMO_ALUMNI;
}

export function hasActiveAlumniSession(): boolean {
  return inMemoryAlumniSession !== null;
}

export function setAlumniSession(profile: AlumniRecord): void {
  inMemoryAlumniSession = profile;
}

export function updateAlumniProfile(updated: Partial<AlumniRecord>): AlumniRecord {
  const current = getAlumniSession();
  const newProfile: AlumniRecord = {
    ...current,
    ...updated,
    name: updated.name ?? current.name,
    fullName: updated.name ?? current.fullName ?? current.name,
    graduationYear: updated.graduationYear ?? current.graduationYear,
    currentOccupation: updated.currentOccupation ?? current.currentOccupation,
    email: updated.email ?? current.email,
    phone: updated.phone !== undefined ? updated.phone : current.phone,
  };
  inMemoryAlumniSession = newProfile;

  const idx = inMemoryRegisteredAlumni.findIndex(
    (a) => a.id === newProfile.id || a.email.toLowerCase() === newProfile.email.toLowerCase(),
  );
  if (idx >= 0) {
    inMemoryRegisteredAlumni[idx] = newProfile;
  } else {
    inMemoryRegisteredAlumni.unshift(newProfile);
  }
  return newProfile;
}

export function registerAlumniInMemory(data: {
  name: string;
  graduationYear: string;
  currentOccupation: string;
  email: string;
  phone?: string;
}): AlumniRecord {
  const generatedCode = generateAlumniHandle(data.name);
  const newRecord: AlumniRecord = {
    id: `alm-${Date.now()}`,
    name: data.name.trim(),
    fullName: data.name.trim(),
    graduationYear: data.graduationYear.trim(),
    currentOccupation: data.currentOccupation.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || "",
    alumniIdCode: generatedCode,
    registeredAt: new Date().toISOString(),
  };

  inMemoryRegisteredAlumni.unshift(newRecord);
  inMemoryAlumniSession = newRecord;
  return newRecord;
}

export function loginAlumniInMemory(email: string): AlumniRecord {
  const trimmed = email.trim().toLowerCase();
  const existing = inMemoryRegisteredAlumni.find((a) => a.email.toLowerCase() === trimmed);
  if (existing) {
    inMemoryAlumniSession = existing;
    return existing;
  }

  // Construct a new temporary profile for the demo login email
  const userFirst = trimmed.split("@")[0] || "Alumni";
  const capitalized = userFirst.charAt(0).toUpperCase() + userFirst.slice(1);
  const demoRecord: AlumniRecord = {
    ...DEFAULT_DEMO_ALUMNI,
    id: `alm-${Date.now()}`,
    name: capitalized,
    fullName: capitalized,
    email: email.trim(),
    alumniIdCode: generateAlumniHandle(capitalized),
    registeredAt: new Date().toISOString(),
  };

  inMemoryRegisteredAlumni.unshift(demoRecord);
  inMemoryAlumniSession = demoRecord;
  return demoRecord;
}

export function clearAlumniSession(): void {
  inMemoryAlumniSession = null;
}

export function addMeetRegistration(
  reg: AlumniMeetRegistrationFormValues,
): AlumniMeetRegistrationRecord {
  const record: AlumniMeetRegistrationRecord = {
    ...reg,
    id: `reg-meet-${Date.now()}`,
    registeredAt: new Date().toISOString(),
  };
  inMemoryMeetRegistrations.unshift(record);
  return record;
}

export function getMeetRegistrations(): AlumniMeetRegistrationRecord[] {
  return [...inMemoryMeetRegistrations];
}
