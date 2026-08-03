import type { ReactNode } from "react";
import {
  TREND_BORDER,
  TREND_FILL,
  TREND_LABEL,
  TREND_TEXT,
  walk,
  type Direction,
} from "../lib/trend";

/* Class strings are written out in full rather than composed: Tailwind scans source
   text, so an interpolated class name would never be generated. */

/* ─── Micro-label ─── DESIGN.md §1.4
   Tracking widens as size shrinks. Default tone is the ink/50 rung. */

export type LabelVariant =
  | "eyebrow"
  | "section"
  | "meta"
  | "issuer"
  | "nav"
  | "tile"
  | "tagline"
  | "footer"
  | "column";

const LABEL: Record<LabelVariant, string> = {
  eyebrow: "font-mono font-light text-[10px]/[1] tracking-[.24em] uppercase",
  section: "font-mono font-light text-[10px]/[1] tracking-[.2em] uppercase",
  meta: "font-mono font-light text-[10px]/[1] tracking-[.16em] uppercase",
  /* Same rung as `meta`, but issuers keep their own casing — they are names, not labels. */
  issuer: "font-mono font-light text-[10px]/[1] tracking-[.16em]",
  nav: "font-mono font-light text-[10.5px]/[1] tracking-[.14em] uppercase",
  tile: "font-mono font-light text-[9px]/[1] tracking-[.18em] uppercase",
  tagline: "font-mono font-light text-[9px]/[1] tracking-[.2em] uppercase",
  footer: "font-mono font-light text-[8.5px]/[1] tracking-[.18em] uppercase",
  column: "font-mono text-[13px]/[1] tracking-[.14em] uppercase",
};

interface MicroLabelProps {
  variant: LabelVariant;
  children: ReactNode;
  className?: string;
}

export function MicroLabel({
  variant,
  children,
  className = "text-ink/50",
}: MicroLabelProps) {
  return <span className={`${LABEL[variant]} ${className}`}>{children}</span>;
}

/* ─── Trend pill ─── DESIGN.md §3.1
   Outlined, never filled. Border and text share one value from the text map. */

export function TrendPill({ direction }: { direction: Direction }) {
  return (
    <span
      className={`inline-block border bg-transparent px-2 py-1 font-mono text-[9.5px]/[1] tracking-[.12em] uppercase ${TREND_TEXT[direction]} ${TREND_BORDER[direction]}`}
    >
      {TREND_LABEL[direction]}
    </span>
  );
}

/* ─── Meter bar ─── DESIGN.md §3.2 */

export function MeterBar({ value, direction }: { value: number; direction: Direction }) {
  return (
    <div className="h-2.25 bg-ink/8">
      <span
        className={`block h-full ${TREND_FILL[direction]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

/* ─── Sparkline ─── DESIGN.md §3.3
   Nine bars on a baseline. Heights are data, so they stay inline. */

interface SparklineProps {
  direction: Direction;
  seed: number;
  height: number;
  width: number;
}

export function Sparkline({ direction, seed, height, width }: SparklineProps) {
  const samples = walk(direction, seed);
  return (
    <span className="flex items-end gap-0.5" style={{ height, width }}>
      {samples.map((v, i) => (
        <span
          key={i}
          className={`block flex-1 opacity-90 ${TREND_FILL[direction]}`}
          style={{ height: Math.round((v / 100) * height) }}
        />
      ))}
    </span>
  );
}

/* ─── Stat tile ─── DESIGN.md §3.4 */

interface StatTileProps {
  label: string;
  value: string;
  /** Deltas take the trend color in place of ink. */
  tone?: Direction;
}

export function StatTile({ label, value, tone }: StatTileProps) {
  return (
    <div className="bg-panel p-4">
      <MicroLabel variant="tile">{label}</MicroLabel>
      <div
        className={`mt-2 font-serif text-[30px]/[1] tabular-nums ${tone ? TREND_TEXT[tone] : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── Chip ─── DESIGN.md §3.5
   Selection is a full ink inversion, not a tint. */

interface ChipProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function Chip({ label, selected, onSelect }: ChipProps) {
  const state = selected
    ? "bg-ink text-paper border-ink"
    : "bg-transparent text-ink/62 border-ink/25 hover:border-ink/45";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`block cursor-pointer border px-3.5 py-2.75 text-left font-mono text-[12.5px]/[1] whitespace-nowrap ${state}`}
    >
      {label}
    </button>
  );
}

/* ─── Search bar ─── DESIGN.md §3.6
   Two flush cells in one bordered box: no rounding, no gap, no shadow. */

interface SearchBarProps {
  placeholder: string;
  action: string;
  /** The closing band uses tighter padding and smaller type than the hero. */
  compact?: boolean;
}

export function SearchBar({ placeholder, action, compact = false }: SearchBarProps) {
  const fieldPad = compact ? "p-[17px]" : "px-5 py-[18px]";
  const fieldType = compact ? "text-[13px]/[1]" : "text-[14px]/[1]";
  const btnPad = compact ? "px-6 py-[17px]" : "px-6 py-[18px]";
  const btnType = compact ? "text-[11px]/[1]" : "text-[11.5px]/[1]";
  const id = `search-${action.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <form
      className="flex border border-ink/45 bg-panel"
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        className={`flex-1 bg-transparent font-mono font-light text-ink outline-none placeholder:text-ink/45 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ink ${fieldPad} ${fieldType}`}
      />
      <button
        type="submit"
        className={`cursor-pointer bg-ink font-mono text-paper tracking-[.12em] uppercase ${btnPad} ${btnType}`}
      >
        {action}
      </button>
    </form>
  );
}

/* ─── Section header ─── DESIGN.md §3.7
   Heading left, meta right, baselines aligned to the bottom. */

interface SectionHeaderProps {
  title: string;
  meta?: string;
  description?: string;
}

export function SectionHeader({ title, meta, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div>
        <h2 className="font-serif text-[30px]/[1] text-ink text-pretty md:text-[38px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2.25 max-w-140 font-mono font-light text-[12.5px]/[1.6] text-ink/62 text-pretty">
            {description}
          </p>
        )}
      </div>
      {meta && (
        <MicroLabel variant="meta" className="pb-1 text-ink/50">
          {meta}
        </MicroLabel>
      )}
    </div>
  );
}

/* ─── Section ─── DESIGN.md §1.5
   Rules get heavier as the division gets bigger; sections take the .35 rung. */

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function Section({ children, id, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-8 border-t border-ink/35 px-6 py-10 md:px-11 md:py-12 ${className}`}
    >
      {children}
    </section>
  );
}
