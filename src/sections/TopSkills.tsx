import { Link } from "react-router";

import {
  MeterBar,
  MicroLabel,
  Section,
  SectionHeader,
  StatePanel,
} from "../components/primitives";
import type { Async } from "../hooks/useSkillIq";
import { ApiError, type ApiSkill, type SkillsResponse } from "../lib/api";
import { formatPercent, formatWindow } from "../lib/format";
import { jobsHref } from "../lib/routes";
import { CORE_THRESHOLD_PCT, isCore } from "../lib/skills";

function countLabel(n: number): string {
  return `${n} ${n === 1 ? "skill" : "skills"}`;
}

/* Every skill opens the jobs page filtered to the postings that name it. */
interface SkillLinkProps {
  skill: ApiSkill;
  role: string;
}

/* ─── Core skills ───
   Few enough to give each one a card, with the share set in serif because it is
   the number a reader compares. */

function CoreCard({ skill, role }: SkillLinkProps) {
  return (
    <Link
      to={jobsHref({ role, skill: skill.name })}
      className="group flex flex-col bg-panel p-5 text-ink hover:bg-panel-hover hover:text-ink"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-[15px]/[1.3] text-ink text-pretty">{skill.name}</h3>
        <span aria-label="Core skill" className="text-[17px]/[1] text-core-text">
          ★
        </span>
      </div>

      {/* Pinned to the bottom so a two-line name doesn't knock the row out of line. */}
      <div className="mt-auto flex items-baseline gap-2 pt-5">
        <span className="font-serif text-[40px]/[1] tabular-nums text-ink">
          {formatPercent(skill.occurrence_pct)}
        </span>
        <MicroLabel variant="tile">of postings</MicroLabel>
      </div>

      <div className="mt-3">
        <MeterBar value={skill.occurrence_pct} tone="core" />
      </div>

      <div className="mt-4 border-t border-ink/14 pt-3">
        <MicroLabel variant="nav" className="text-ink/55 group-hover:text-ink">
          View postings →
        </MicroLabel>
      </div>
    </Link>
  );
}

/* ─── Everything else ───
   A ranked list flowed into newspaper columns, so it reads top-to-bottom like a
   single list but fills the width instead of running down the page. */

function SkillRow({ skill, role }: SkillLinkProps) {
  return (
    <li className="break-inside-avoid">
      <Link
        to={jobsHref({ role, skill: skill.name })}
        className="group flex items-baseline gap-3 px-4 py-2.5 text-ink hover:bg-panel-hover hover:text-ink"
      >
        <span className="w-5 shrink-0 font-mono font-light text-[10.5px]/[1] tabular-nums text-ink/40">
          {skill.rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[13px]/[1.3] text-ink text-pretty">
              {skill.name}
            </span>
            <span className="font-mono font-light text-[12px]/[1] tabular-nums text-ink/60">
              {formatPercent(skill.occurrence_pct)}
            </span>
          </div>
          <div className="mt-1.5">
            <MeterBar value={skill.occurrence_pct} size="sm" />
          </div>
        </div>
        <span
          aria-hidden="true"
          className="w-3 shrink-0 font-mono text-[12px]/[1] text-ink/30 group-hover:text-ink"
        >
          →
        </span>
        <span className="sr-only">View postings</span>
      </Link>
    </li>
  );
}

function GroupHeader({
  label,
  detail,
  className,
}: {
  label: string;
  detail: string;
  className?: string;
}) {
  return (
    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <MicroLabel variant="column" className={className}>
        {label}
      </MicroLabel>
      <MicroLabel variant="meta">{detail}</MicroLabel>
    </div>
  );
}

interface TopSkillsProps {
  role: string | null;
  roleLabel: string;
  skills: Async<SkillsResponse>;
}

export function TopSkills({ role, roleLabel, skills }: TopSkillsProps) {
  const { data, error, loading } = skills;

  /* The API ranks by occurrence already; filtering keeps that order in both groups. */
  const all = data?.skills ?? [];
  const core = all.filter((s) => isCore(s.occurrence_pct));
  const rest = all.filter((s) => !isCore(s.occurrence_pct));

  const meta = data
    ? `Share of live postings · ${formatWindow(data.meta.window_start, data.meta.window_end)}`
    : "Share of live postings";

  return (
    <Section id="skills">
      <SectionHeader
        title={roleLabel ? `Top skills: ${roleLabel}` : "Top skills"}
        meta={meta}
      />

      <div className="mt-5.5">
        {loading && <StatePanel>Loading skills…</StatePanel>}

        {error && (
          <StatePanel tone="error">
            Couldn&rsquo;t load skills for this role
            {error instanceof ApiError ? ` (HTTP ${error.status})` : ""}.
          </StatePanel>
        )}

        {data && all.length === 0 && (
          <StatePanel>No skill data for this role yet.</StatePanel>
        )}

        {role && all.length > 0 && (
          <div className="flex flex-col gap-9">
            <div>
              {core.length > 0 ? (
                <div className="hairline-grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
                  {core.map((skill) => (
                    <CoreCard key={skill.name} skill={skill} role={role} />
                  ))}
                </div>
              ) : (
                <StatePanel>
                  No skill appears in {CORE_THRESHOLD_PCT}% or more of postings for this
                  role.
                </StatePanel>
              )}
            </div>

            {rest.length > 0 && (
              <div>
                <GroupHeader
                  label="Also in demand"
                  detail={countLabel(rest.length)}
                  className="text-ink/70"
                />
                <ol className="gap-x-0 border border-ink/22 bg-panel py-2 sm:columns-2 lg:columns-3 [column-rule:1px_solid_rgb(18_23_34/0.1)]">
                  {rest.map((skill) => (
                    <SkillRow key={skill.name} skill={skill} role={role} />
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
