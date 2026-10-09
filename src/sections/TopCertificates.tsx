import { Link } from "react-router";

import { MicroLabel, Section, SectionHeader, StatePanel } from "../components/primitives";
import type { Async } from "../hooks/useSkillIq";
import { ApiError, type ApiCertification } from "../lib/api";
import { formatPercent } from "../lib/format";
import { jobsHref } from "../lib/routes";

/* The API grades demand as a word, not a number, so this is a plain outlined pill
   in ink — there is no meaning for color to carry. */
function DemandBadge({ badge }: { badge: string }) {
  return (
    <span className="inline-block border border-ink/30 bg-transparent px-2 py-1 font-mono text-[9.5px]/[1] tracking-[.12em] text-ink/65 uppercase">
      {badge}
    </span>
  );
}

/* Each card opens the jobs page filtered to the postings that name the certificate. */
function CertCard({ cert, role }: { cert: ApiCertification; role: string }) {
  return (
    <Link
      to={jobsHref({ role, certificate: cert.name })}
      className="group block bg-panel p-5 text-ink hover:bg-panel-hover hover:text-ink"
    >
      <div className="flex items-center justify-between gap-2">
        <MicroLabel variant="issuer" className="text-ink/45">
          {cert.provider}
        </MicroLabel>
        <DemandBadge badge={cert.demand_badge} />
      </div>

      <h3 className="mt-3 min-h-11.5 font-serif text-[19px]/[1.2] text-ink">
        {cert.name}
      </h3>

      <div className="mt-3.5">
        <span className="font-serif text-[26px]/[1] text-ink tabular-nums">
          {formatPercent(cert.occurrence_pct)}
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-ink/14 pt-2.5">
        <span className="font-mono font-light text-[10px]/[1] text-ink/55">
          of postings name it
        </span>
        <MicroLabel variant="nav" className="text-ink/55 group-hover:text-ink">
          View postings →
        </MicroLabel>
      </div>
    </Link>
  );
}

/**
 * hairline-grid tints the container so the 1px gaps read as rules, which means an
 * incomplete last row shows that tint as a slab of grey. These panels fill it.
 *
 * The count needed differs per breakpoint, and CSS can't see the item count, so each
 * filler is rendered once and toggled at the widths where it would otherwise push
 * the grid onto a new row.
 */
function RowFillers({ count }: { count: number }) {
  const needed = (cols: number) => (cols - (count % cols)) % cols;
  const sm = needed(2);
  const lg = needed(4);

  return (
    <>
      {Array.from({ length: Math.max(sm, lg) }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`bg-panel ${i < sm ? "sm:block" : "sm:hidden"} ${i < lg ? "lg:block" : "lg:hidden"} hidden`}
        />
      ))}
    </>
  );
}

interface TopCertificatesProps {
  role: string | null;
  roleLabel: string;
  certificates: Async<ApiCertification[]>;
}

export function TopCertificates({ role, roleLabel, certificates }: TopCertificatesProps) {
  const { data, error, loading } = certificates;

  return (
    <Section id="certificates">
      <SectionHeader
        title="Top certificates"
        meta={data ? `${data.length} tracked` : undefined}
        description="How often employers name a certification in postings for this role."
      />

      <div className="mt-5">
        {loading && <StatePanel>Loading certificates…</StatePanel>}

        {error && (
          <StatePanel tone="error">
            Couldn&rsquo;t load certificates
            {error instanceof ApiError ? ` (HTTP ${error.status})` : ""}.
          </StatePanel>
        )}

        {data && data.length === 0 && (
          <StatePanel>
            No certifications indexed
            {roleLabel ? ` for ${roleLabel}` : ""} yet.
          </StatePanel>
        )}

        {role && data && data.length > 0 && (
          <div className="hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((cert) => (
              <CertCard key={`${cert.provider}-${cert.name}`} cert={cert} role={role} />
            ))}
            <RowFillers count={data.length} />
          </div>
        )}
      </div>
    </Section>
  );
}
