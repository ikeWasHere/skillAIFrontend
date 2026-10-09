import type { ReactNode } from "react";
import { Link } from "react-router";

import { MicroLabel, StatePanel } from "../components/primitives";
import type { Async } from "../hooks/useSkillIq";
import { ApiError, type ApiJob, type JobsResponse } from "../lib/api";
import {
  formatDate,
  formatSalaryRange,
  formatSeniority,
  formatWorkplace,
} from "../lib/format";

/* ─── Description ───
   Postings arrive as scraped Markdown. Only the handful of constructs they actually
   use is rendered: bold runs, bullet lists and paragraphs. Everything goes through
   React text nodes, so nothing in a posting can inject markup. */

/** Scrapers escape punctuation ("\-", "\&"); the backslashes are noise to a reader. */
function unescape(text: string): string {
  return text.replace(/\\([\\`*_{}[\]()#+\-.!&|>~])/g, "$1");
}

function inline(text: string): ReactNode[] {
  return unescape(text)
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-normal text-ink">
          {part}
        </strong>
      ) : (
        part
      ),
    );
}

const BULLET = /^\s*[-*•]\s+/;

function Description({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={blocks.length} className="list-disc space-y-1 pl-5 marker:text-ink/35">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const line of text.split("\n")) {
    if (BULLET.test(line)) {
      list.push(line.replace(BULLET, ""));
      continue;
    }
    flushList();
    const trimmed = line.trim().replace(/^#+\s*/, "");
    if (trimmed) blocks.push(<p key={blocks.length}>{inline(trimmed)}</p>);
  }
  flushList();

  return (
    <div className="mt-3 max-w-170 space-y-2.5 border-l border-ink/14 pl-4 font-mono font-light text-[12.5px]/[1.6] text-ink/68">
      {blocks}
    </div>
  );
}

/** Plain text of the opening lines, for the two-line preview. */
function excerpt(text: string): string {
  return unescape(text)
    .replace(/\*\*/g, "")
    .replace(/^\s*(#+|[-*•])\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
}

/* ─── Job card ─── */

function JobCard({ job }: { job: ApiJob }) {
  const salary = formatSalaryRange(job.min_salary_usd, job.max_salary_usd);
  const meta = [
    formatSeniority(job.seniority),
    formatWorkplace(job.remote, job.hybrid),
    `Posted ${formatDate(job.date_posted)}`,
  ].filter(Boolean);

  return (
    <article className="grid gap-5 border-b border-ink/10 px-5 py-5.5 last:border-b-0 hover:bg-panel-hover md:grid-cols-[1fr_auto] md:gap-9">
      <div className="min-w-0">
        {job.company && (
          <MicroLabel variant="issuer" className="text-ink/55">
            {job.company}
          </MicroLabel>
        )}
        <h3 className="mt-2 font-serif text-[22px]/[1.15] text-ink text-pretty">
          {job.title}
        </h3>
        <p className="mt-2.5 font-mono font-light text-[10.5px]/[1.4] tracking-[.14em] text-ink/55 uppercase">
          {meta.join(" · ")}
        </p>

        {job.description && (
          <>
            <p className="mt-3 line-clamp-2 max-w-170 font-mono font-light text-[12.5px]/[1.6] text-ink/62">
              {excerpt(job.description)}
            </p>
            <details className="mt-2.5">
              <summary className="cursor-pointer font-mono font-light text-[10.5px]/[1] tracking-[.14em] text-ink/55 uppercase hover:text-ink">
                Full description
              </summary>
              <Description text={job.description} />
            </details>
          </>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
        <div className="md:text-right">
          <MicroLabel variant="tile">Base salary</MicroLabel>
          {salary ? (
            <div className="mt-2 font-serif text-[20px]/[1.1] text-ink tabular-nums">
              {salary}
            </div>
          ) : (
            <div className="mt-2 font-mono font-light text-[12px]/[1.1] text-ink/45">
              Not listed
            </div>
          )}
        </div>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 border border-ink bg-ink px-4 py-3 font-mono text-[11px]/[1] tracking-[.12em] whitespace-nowrap text-paper uppercase hover:bg-ink/85 hover:text-paper"
          >
            View posting ↗
          </a>
        )}
      </div>
    </article>
  );
}

/* ─── Pagination ───
   Links rather than buttons, so a page can be opened in a new tab or shared. */

const PAGE_LINK =
  "border px-3.5 py-2.75 font-mono text-[11px]/[1] tracking-[.12em] uppercase";

function PageLink({ to, children }: { to: string | null; children: ReactNode }) {
  if (to === null) {
    return (
      <span aria-disabled="true" className={`${PAGE_LINK} border-ink/14 text-ink/30`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      to={to}
      className={`${PAGE_LINK} border-ink/25 text-ink/62 hover:border-ink/45 hover:bg-panel-hover hover:text-ink`}
    >
      {children}
    </Link>
  );
}

interface JobResultsProps {
  jobs: Async<JobsResponse>;
  pageHref: (page: number) => string;
  /** Shown in the empty state when there are filters a reader could relax. */
  onClearFilters: (() => void) | null;
}

export function JobResults({ jobs, pageHref, onClearFilters }: JobResultsProps) {
  const { data, error, loading } = jobs;

  if (loading) return <StatePanel>Loading postings…</StatePanel>;

  if (error || !data) {
    return (
      <StatePanel tone="error">
        Couldn&rsquo;t load postings
        {error instanceof ApiError ? ` (HTTP ${error.status})` : ""}.
      </StatePanel>
    );
  }

  const { page, total_pages, total } = data.pagination;

  if (data.jobs.length === 0) {
    return (
      <StatePanel>
        {total > 0 ? (
          <>
            This page is past the end of the results.{" "}
            <Link to={pageHref(1)} className="underline underline-offset-3">
              Back to page 1
            </Link>
          </>
        ) : (
          <>
            No postings match these filters.
            {onClearFilters && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="cursor-pointer underline underline-offset-3 hover:text-ink"
                >
                  Clear filters
                </button>
              </>
            )}
          </>
        )}
      </StatePanel>
    );
  }

  return (
    <>
      <div className="border border-ink/22 bg-panel">
        {data.jobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>

      {total_pages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-5 flex items-center justify-between gap-4"
        >
          <PageLink to={page > 1 ? pageHref(page - 1) : null}>← Previous</PageLink>
          <MicroLabel variant="meta">
            Page {page} of {total_pages}
          </MicroLabel>
          <PageLink to={page < total_pages ? pageHref(page + 1) : null}>Next →</PageLink>
        </nav>
      )}
    </>
  );
}
