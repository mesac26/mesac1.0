import type { Event } from "@/types";

/**
 * Safely parses an event date string or end date into a JavaScript Date.
 * Handles formats like:
 * - "2025" / "2024" (Year only)
 * - "November 8, 2024" / "May 12, 2024"
 * - "April 27, 2023 · 10:00 AM" (Date with inline time)
 * - "November 4 & 5, 2022" (Multi-day span)
 * - "2026-10-15" (ISO strings)
 */
export function parseEventDate(dateStr: string, endDateStr?: string): Date | null {
  const target = endDateStr || dateStr;
  if (!target) return null;

  // Extract base date part before time separator (e.g. " · 10:00 AM")
  let cleanStr = target.split("·")[0].trim();

  // If date string contains a multi-day span like "November 4 & 5, 2022",
  // use the concluding day "November 5, 2022"
  if (cleanStr.includes("&")) {
    cleanStr = cleanStr.replace(/\d+\s*&\s*(\d+)/, "$1");
  }

  // Handle year-only formats like "2025"
  if (/^\d{4}$/.test(cleanStr)) {
    const year = parseInt(cleanStr, 10);
    // Year-only events are considered to conclude at the end of that year (Dec 31, 23:59:59)
    return new Date(year, 11, 31, 23, 59, 59);
  }

  const parsed = new Date(cleanStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

/**
 * Evaluates whether an event is in the future/upcoming compared to a reference date.
 * Does not rely on hardcoded statuses; calculates dynamically from event date.
 */
export function isEventUpcoming(eventItem: Event, referenceDate = new Date()): boolean {
  const eventDate = parseEventDate(eventItem.date, eventItem.endDate);
  if (!eventDate) {
    // If date format is completely unparseable, fall back to existing model status
    return eventItem.status === "upcoming";
  }

  // Compare against start of reference day (00:00:00) to ensure events happening today count as upcoming/current
  const todayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    0,
    0,
    0,
  );

  return eventDate.getTime() >= todayStart.getTime();
}

/**
 * Formats event date into a clear, readable, unambiguous format (e.g. "8 November 2024").
 */
export function formatEventDate(dateStr: string): string {
  if (!dateStr) return "";

  // Extract date part before any time symbol
  const rawDate = dateStr.split("·")[0].trim();

  // If it's just a year, keep it as "2025"
  if (/^\d{4}$/.test(rawDate)) {
    return rawDate;
  }

  // If it has multi-day like "November 4 & 5, 2022", format cleanly
  if (rawDate.includes("&")) {
    return rawDate;
  }

  const parsed = new Date(rawDate);
  if (!isNaN(parsed.getTime()) && !/^\d{4}$/.test(rawDate)) {
    try {
      const day = parsed.getDate();
      const month = parsed.toLocaleString("en-GB", { month: "long" });
      const year = parsed.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return rawDate;
    }
  }

  return rawDate;
}

/**
 * Extracts optional time string from date (e.g., "10:00 AM" from "April 27, 2023 · 10:00 AM").
 */
export function extractEventTime(dateStr: string): string | null {
  if (!dateStr || !dateStr.includes("·")) return null;
  const parts = dateStr.split("·");
  if (parts.length > 1) {
    return parts[1].trim();
  }
  return null;
}
