/* Display formatting. The API sends raw numbers, so the thousands separators and
   currency marks that used to be baked into the fixtures now happen here. */

/** Stands in wherever the API has no value for a field. DESIGN.md §3.3 */
export const DASH = "—";

const COUNT = new Intl.NumberFormat("en-US");

const SALARY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCount(value: number | null): string {
  return value === null ? DASH : COUNT.format(value);
}

export function formatSalary(value: number | null): string {
  return value === null ? DASH : SALARY.format(value);
}

/** One decimal, because occurrence percentages arrive as 91.9, not 92. */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * "Jun 21 – Sep 19, 2026" for the observation window in section metadata.
 *
 * The API sends bare calendar dates ("2026-06-21"), which Date parses as UTC
 * midnight. Formatting those in a negative-offset zone would render the day
 * before, so the formatter is pinned to UTC rather than the viewer's zone.
 */
export function formatWindow(start: string, end: string): string {
  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const full = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${day.format(new Date(start))} – ${full.format(new Date(end))}`;
}

/** "Jul 28, 2026" for a posting date. Pinned to UTC for the reason given above. */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

/** "$110,000 – $140,000", or one end alone when the posting only gives one. */
export function formatSalaryRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return `${formatSalary(min)} – ${formatSalary(max)}`;
  if (min !== null) return `From ${formatSalary(min)}`;
  if (max !== null) return `Up to ${formatSalary(max)}`;
  return null;
}

/** "mid_level" → "Mid level". */
export function formatSeniority(value: string | null): string | null {
  if (!value) return null;
  const words = value.replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function formatWorkplace(
  remote: boolean | null,
  hybrid: boolean | null,
): string | null {
  if (remote) return "Remote";
  if (hybrid) return "Hybrid";
  if (remote === false && hybrid === false) return "On-site";
  return null;
}
