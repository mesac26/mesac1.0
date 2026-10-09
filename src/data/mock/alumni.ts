import type { AlumniRecord, AlumniDepartment } from "@/types";

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
 * Initial sample records for prototype/preview demonstrations if needed
 */
export const MOCK_RECENT_ALUMNI: AlumniRecord[] = [
  {
    id: "alm-1",
    fullName: "Rahul Kumar",
    graduationYear: "2018",
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
    fullName: "Anjali Nair",
    graduationYear: "2020",
    department: "Mechanical Engineering",
    email: "anjali.nair@example.com",
    phone: "+91 97455 67890",
    organization: "ISRO Propulsion Complex",
    location: "Mahendragiri, India",
    alumniIdCode: "MESAC_ANJALI_7193",
    registeredAt: "2026-04-02T14:30:00Z",
  },
];
