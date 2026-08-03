import { MicroLabel, Section, SectionHeader } from "../components/primitives";
import { ROLE_ROWS } from "../lib/data";
import {
  TREND_DOT,
  TREND_TEXT,
  classify,
  formatDelta,
  type Thresholds,
} from "../lib/trend";

/* Header and body rows share one template so the columns stay locked. DESIGN.md §3.9 */
const COLS = "grid grid-cols-[1.3fr_1.1fr_.8fr_.8fr_104px] gap-4";

export function TopRoles({ thresholds }: { thresholds: Thresholds }) {
  return (
    <Section id="roles">
      <SectionHeader title="Top roles right now" meta="412 indexed · showing 8" />

      <div className="mt-5 overflow-x-auto border border-ink/22 bg-panel">
        <div className="min-w-190">
          <div className={`${COLS} border-b border-ink/25 px-4.5 py-2.75`}>
            <MicroLabel variant="tile">Role</MicroLabel>
            <MicroLabel variant="tile">Learn next</MicroLabel>
            <MicroLabel variant="tile" className="text-right text-ink/50">
              Openings
            </MicroLabel>
            <MicroLabel variant="tile" className="text-right text-ink/50">
              Median base
            </MicroLabel>
            <MicroLabel variant="tile" className="text-right text-ink/50">
              Demand
            </MicroLabel>
          </div>

          {ROLE_ROWS.map((row) => {
            const direction = classify(row.delta, thresholds);
            return (
              <div
                key={row.role}
                className={`${COLS} items-center border-b border-ink/10 px-4.5 py-3.5 hover:bg-panel-hover`}
              >
                <span className="font-serif text-[19px]/[1.1] text-ink">{row.role}</span>
                <span className="font-mono text-[13px]/[1] text-ink/80">
                  {row.learnNext}
                </span>
                <span className="text-right font-mono font-light text-[12.5px]/[1] text-ink tabular-nums">
                  {row.openings}
                </span>
                <span className="text-right font-mono font-light text-[12.5px]/[1] text-ink tabular-nums">
                  {row.median}
                </span>
                <span className="flex items-center justify-end gap-2">
                  <span
                    className={`font-mono text-[12px]/[1] tabular-nums ${TREND_TEXT[direction]}`}
                  >
                    {formatDelta(row.delta, "%")}
                  </span>
                  <span
                    className={`block size-1.75 rounded-full ${TREND_DOT[direction]}`}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
