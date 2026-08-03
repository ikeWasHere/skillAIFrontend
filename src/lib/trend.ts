export type Direction = 'up' | 'flat' | 'down'

/** Text and 1px pill borders. DESIGN.md §1.1 */
export const TREND_TEXT: Record<Direction, string> = {
  up: 'text-rising',
  flat: 'text-flat-text',
  down: 'text-falling',
}

export const TREND_BORDER: Record<Direction, string> = {
  up: 'border-rising',
  flat: 'border-flat-text',
  down: 'border-falling',
}

/** Bars, sparklines, accent caps. Amber is brighter here than as type. */
export const TREND_FILL: Record<Direction, string> = {
  up: 'bg-rising',
  flat: 'bg-flat-fill',
  down: 'bg-falling',
}

export const TREND_CAP: Record<Direction, string> = {
  up: 'border-t-rising',
  flat: 'border-t-flat-fill',
  down: 'border-t-falling',
}

/** The one circle in the system, and it takes the text amber, not the fill. */
export const TREND_DOT: Record<Direction, string> = {
  up: 'bg-rising',
  flat: 'bg-flat-text',
  down: 'bg-falling',
}

export const TREND_LABEL: Record<Direction, string> = {
  up: '▲ Rising',
  flat: '▬ Flat',
  down: '▼ Falling',
}

export const TREND_COLUMN_LABEL: Record<Direction, string> = {
  up: '▲ Rising',
  flat: '▬ Holding flat',
  down: '▼ Falling',
}

export interface Thresholds {
  rise: number
  fall: number
}

export const DEFAULT_THRESHOLDS: Thresholds = { rise: 3, fall: -2 }

/** A delta in percentage points maps to a direction. DESIGN.md §4.1 */
export function classify(delta: number, { rise, fall }: Thresholds = DEFAULT_THRESHOLDS): Direction {
  if (delta >= rise) return 'up'
  if (delta <= fall) return 'down'
  return 'flat'
}

/** Zero renders as ±0, never 0. DESIGN.md §4.1 */
export function formatDelta(delta: number, unit = ' pts'): string {
  if (delta === 0) return `±0${unit}`
  return `${delta > 0 ? '+' : ''}${delta}${unit}`
}

/**
 * Nine deterministic samples for a sparkline. Seeded so a given row always draws the
 * same shape across renders — the chart is decoration for the direction, not new data.
 */
export function walk(direction: Direction, seed: number): number[] {
  const out: number[] = []
  let v = 42 + ((seed * 11) % 16)
  const step = direction === 'up' ? 5 : direction === 'down' ? -5 : 0
  for (let i = 0; i < 9; i++) {
    v += step + (((seed + i * 5) % 7) - 3)
    v = Math.max(16, Math.min(96, v))
    out.push(v)
  }
  return out
}
