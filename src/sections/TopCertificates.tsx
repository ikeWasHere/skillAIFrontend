import {
  MicroLabel,
  Section,
  SectionHeader,
  Sparkline,
  TrendPill,
} from "../components/primitives";
import { CERTIFICATES, type Certificate } from "../lib/data";
import { TREND_TEXT, classify, formatDelta, type Thresholds } from "../lib/trend";

function CertCard({
  cert,
  seed,
  thresholds,
}: {
  cert: Certificate;
  seed: number;
  thresholds: Thresholds;
}) {
  const direction = classify(cert.delta, thresholds);

  return (
    <article className="bg-panel p-5 hover:bg-panel-hover">
      <div className="flex items-center justify-between gap-2">
        <MicroLabel variant="issuer" className="text-ink/45">
          {cert.issuer}
        </MicroLabel>
        <TrendPill direction={direction} />
      </div>

      <h3 className="mt-3 min-h-11.5 font-serif text-[19px]/[1.2] text-ink">
        {cert.name}
      </h3>

      <div className="mt-3.5 flex items-end justify-between gap-3">
        <span className="font-serif text-[26px]/[1] text-ink tabular-nums">
          {cert.pay}
        </span>
        <Sparkline direction={direction} seed={seed} height={30} width={84} />
      </div>

      <div className="mt-3 flex justify-between border-t border-ink/14 pt-2.5">
        <span className="font-mono font-light text-[10px]/[1] text-ink/55">
          {cert.postings} postings
        </span>
        <span
          className={`font-mono text-[12.5px]/[1] tabular-nums ${TREND_TEXT[direction]}`}
        >
          {formatDelta(cert.delta)}
        </span>
      </div>

      <p className="mt-1.75 font-mono font-light text-[10px]/[1] text-ink/50">
        ≈ {cert.prepHours} h preparation
      </p>
    </article>
  );
}

export function TopCertificates({ thresholds }: { thresholds: Thresholds }) {
  return (
    <Section id="certificates">
      <SectionHeader
        title="Top certificates"
        meta="341 tracked"
        description="Pay delta against matched non-holders, and whether employers are naming it more or less often."
      />

      <div className="hairline-grid mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {CERTIFICATES.map((cert, i) => (
          <CertCard key={cert.name} cert={cert} seed={i + 5} thresholds={thresholds} />
        ))}
      </div>
    </Section>
  );
}
