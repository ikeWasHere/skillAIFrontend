import type { ReactNode } from "react";

import type { FilterOption } from "../lib/api";

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

/* ─── Meter bar ─── DESIGN.md §3.2
   Core skills take the amber fill; everything else stays ink. The small size is
   for dense lists, where a 9px bar per row would outweigh the label. */

interface MeterBarProps {
  value: number;
  tone?: "core" | "default";
  size?: "md" | "sm";
}

export function MeterBar({ value, tone = "default", size = "md" }: MeterBarProps) {
  const height = size === "sm" ? "h-0.75" : "h-2.25";
  const fill = tone === "core" ? "bg-core-fill" : "bg-ink/45";
  return (
    <div className={`${height} bg-ink/8`}>
      <span className={`block h-full ${fill}`} style={{ width: `${value}%` }} />
    </div>
  );
}

/* ─── Async state ─── DESIGN.md §3.3
   Loading, failure and empty all take one panel so a section keeps its footprint
   while the request is in flight. */

interface StatePanelProps {
  children: ReactNode;
  tone?: "muted" | "error";
}

export function StatePanel({ children, tone = "muted" }: StatePanelProps) {
  const color = tone === "error" ? "text-error" : "text-ink/55";
  return (
    <div
      role="status"
      className={`border border-ink/22 bg-panel px-4.5 py-9 text-center font-mono font-light text-[12.5px]/[1.6] ${color}`}
    >
      {children}
    </div>
  );
}

/* ─── Stat tile ─── DESIGN.md §3.4 */

interface StatTileProps {
  label: string;
  value: string;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="bg-panel p-4">
      <MicroLabel variant="tile">{label}</MicroLabel>
      <div className="mt-2 font-serif text-[30px]/[1] tabular-nums text-ink">{value}</div>
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

/* ─── Select ─── DESIGN.md §3.6
   A native <select>, so keyboard and screen-reader behaviour come for free, with
   the chrome stripped back to the square bordered field of the search bar. Options
   are always supplied, never typed, so a filter can only hold a value the data has. */

interface SelectProps {
  label: string;
  value: string;
  options: readonly FilterOption[];
  onChange: (value: string) => void;
  /** Text for the empty value, e.g. "Any skill". Omit when a choice is required. */
  anyLabel?: string;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  options,
  onChange,
  anyLabel,
  disabled = false,
}: SelectProps) {
  return (
    <label className="block">
      <MicroLabel variant="tile">{label}</MicroLabel>
      <span className="relative mt-2.5 block">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full cursor-pointer appearance-none rounded-none border border-ink/45 bg-panel py-2.75 pr-6 pl-2.5 font-mono text-[12px]/[1.2] sm:pr-8 sm:pl-3 sm:text-[12.5px]/[1.2] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default disabled:border-ink/25 disabled:text-ink/45"
        >
          {anyLabel !== undefined && <option value="">{anyLabel}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 sm:right-3 font-mono text-[10px]/[1] text-ink/55"
        >
          ▾
        </span>
      </span>
    </label>
  );
}
