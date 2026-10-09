/** A skill named in at least this share of postings is a core skill and gets a star. */
export const CORE_THRESHOLD_PCT = 90;

export function isCore(occurrencePct: number): boolean {
  return occurrencePct >= CORE_THRESHOLD_PCT;
}
