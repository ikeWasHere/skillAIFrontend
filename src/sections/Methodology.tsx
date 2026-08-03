import { MicroLabel } from "../components/primitives";
import type { Thresholds } from "../lib/trend";

/** Pairs the claim with the working behind it. DESIGN.md §5 rule 9. */
export function Methodology({ thresholds }: { thresholds: Thresholds }) {
  return (
    <section
      id="method"
      className="grid scroll-mt-8 grid-cols-1 items-start gap-9 border-t border-ink/35 p-6 md:grid-cols-[1fr_.9fr] md:p-11"
    >
      <div>
        <h2 className="font-serif text-[32px]/[1.06] text-ink text-pretty">
          How a skill gets called rising.
        </h2>
        <p className="mt-3.5 max-w-130 font-mono font-light text-[13.5px]/[1.75] text-ink/64 text-pretty">
          We compare the share of live postings naming the skill in the last ninety days
          against the previous ninety. Three points or more is rising, minus two or worse
          is falling, everything between is flat. The window and the thresholds are
          published, and every figure links to the postings behind it.
        </p>
      </div>

      <div>
        <MicroLabel variant="section">Artefact — trend classification</MicroLabel>
        <pre className="mt-2.75 overflow-auto border border-ink/30 bg-panel p-5 font-mono font-light text-[12px]/[1.75] whitespace-pre text-ink">
          {`skill        power_bi
share_now    0.52   (window 90d)
share_prev   0.46   (previous 90d)
delta        `}
          <span className="text-rising">+0.06</span>
          {"  → "}
          <span className="text-rising">rising</span>
          {`
thresholds   up ≥ ${thresholds.rise >= 0 ? "+" : ""}${(thresholds.rise / 100).toFixed(2)} · down ≤ ${(thresholds.fall / 100).toFixed(2)}
sources      1,940 postings`}
        </pre>
      </div>
    </section>
  );
}
