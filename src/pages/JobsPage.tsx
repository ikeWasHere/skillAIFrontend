import { useSearchParams } from "react-router";

import { MicroLabel, Section, SectionHeader, StatePanel } from "../components/primitives";
import {
  useCertificateOptions,
  useFilters,
  useIndustryOptions,
  useJobs,
  useSkillOptions,
} from "../hooks/useSkillIq";
import {
  ApiError,
  ALL_INDUSTRIES,
  DATE_RANGES,
  DEFAULT_DATE_RANGE,
  type DateRange,
} from "../lib/api";
import { formatCount } from "../lib/format";
import { JOBS_PARAM } from "../lib/routes";
import { JobFilters, type JobFilterValues } from "../sections/JobFilters";
import { JobResults } from "../sections/JobResults";

const PAGE_SIZE = 20;

const PARAM = JOBS_PARAM;

function isDateRange(value: string | null): value is DateRange {
  return DATE_RANGES.some((d) => d.value === value);
}

export function JobsPage() {
  const roles = useFilters();
  const [params, setParams] = useSearchParams();

  /* The URL is the only filter state, so any view can be linked to, and back and
     forward step through filter changes. Values the API would reject fall back to
     defaults rather than surfacing as a failed request. */
  const pickedRole = params.get(PARAM.role);
  const role =
    roles.data?.find((r) => r.value === pickedRole)?.value ??
    roles.data?.[0]?.value ??
    null;
  const roleLabel = roles.data?.find((r) => r.value === role)?.label ?? "";

  const rawRange = params.get(PARAM.dateRange);
  const dateRange = isDateRange(rawRange) ? rawRange : DEFAULT_DATE_RANGE;
  const industry = params.get(PARAM.industry) ?? ALL_INDUSTRIES;
  const skill = params.get(PARAM.skill) ?? "";
  const certificate = params.get(PARAM.certificate) ?? "";
  const page = Math.max(1, Math.floor(Number(params.get(PARAM.page))) || 1);

  const scope = { dateRange, industry };
  const skills = useSkillOptions(role, scope);
  const certificates = useCertificateOptions(role, scope);
  const industries = useIndustryOptions(role);
  const jobs = useJobs(
    role
      ? {
          role,
          skill: skill || undefined,
          certificate: certificate || undefined,
          dateRange,
          industry,
          page,
          pageSize: PAGE_SIZE,
        }
      : null,
  );

  /** Writes a filter change to the URL. Defaults are dropped to keep links short. */
  const write = (values: Partial<JobFilterValues> & { page?: number }) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      const name = PARAM[key as keyof typeof PARAM];
      const isDefault =
        value === "" ||
        value === undefined ||
        (key === "industry" && value === ALL_INDUSTRIES) ||
        (key === "dateRange" && value === DEFAULT_DATE_RANGE) ||
        (key === "page" && value === 1);
      if (isDefault) next.delete(name);
      else next.set(name, String(value));
    }
    return next;
  };

  const changeFilters = (patch: Partial<JobFilterValues>) => {
    /* Skills, certificates and industries are all scoped to a role, so a new role
       clears them. Any filter change returns to the first page. */
    const reset = patch.role
      ? { skill: "", certificate: "", industry: ALL_INDUSTRIES }
      : {};
    setParams(write({ ...reset, ...patch, page: 1 }), { preventScrollReset: true });
  };

  const filtered =
    skill !== "" ||
    certificate !== "" ||
    industry !== ALL_INDUSTRIES ||
    dateRange !== DEFAULT_DATE_RANGE;

  const clearFilters = () =>
    setParams(role ? { [PARAM.role]: role } : {}, { preventScrollReset: true });

  const total = jobs.data?.pagination.total ?? null;
  const rangeLabel = DATE_RANGES.find((d) => d.value === dateRange)?.label ?? "";
  const industryLabel =
    industries.data?.find((i) => i.value === industry)?.label ??
    (industry === ALL_INDUSTRIES ? "All Industries" : industry);

  const naming = [skill, certificate].filter(Boolean).join(" and ");

  return (
    <>
      <title>{roleLabel ? `${roleLabel} jobs — Skill IQ` : "Jobs — Skill IQ"}</title>

      <div className="px-6 pt-10 pb-9 md:px-11 md:pt-14 md:pb-11">
        <MicroLabel variant="eyebrow">Job postings</MicroLabel>
        <h1 className="mt-4 max-w-240 font-serif text-[40px]/[1] tracking-[-.015em] text-ink text-pretty md:text-[60px]/[.96]">
          {roleLabel ? `${roleLabel} postings` : "Postings"}
          {naming && (
            <>
              {" "}
              <span className="text-ink/45">naming</span> {naming}
            </>
          )}
        </h1>
        <p className="mt-5 max-w-140 font-mono font-light text-[13.5px]/[1.7] text-ink/68 text-pretty">
          The live postings behind the skill board. Every filter lists only values that
          appear in the data for the chosen role and window.
        </p>
      </div>

      <Section>
        {roles.loading && <StatePanel>Loading roles…</StatePanel>}

        {roles.error && (
          <StatePanel tone="error">
            Couldn&rsquo;t load the role list
            {roles.error instanceof ApiError ? ` (HTTP ${roles.error.status})` : ""}.
          </StatePanel>
        )}

        {role && roles.data && (
          <>
            <JobFilters
              values={{ role, skill, certificate, industry, dateRange }}
              onChange={changeFilters}
              roles={roles.data}
              skills={skills}
              certificates={certificates}
              industries={industries}
            />

            {filtered && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer font-mono font-light text-[10.5px]/[1] tracking-[.14em] text-ink/55 uppercase hover:text-ink"
                >
                  Clear filters ×
                </button>
              </div>
            )}
          </>
        )}
      </Section>

      {role && (
        <Section id="results">
          <SectionHeader
            title={
              total === null
                ? "Postings"
                : `${formatCount(total)} ${total === 1 ? "posting" : "postings"}`
            }
            meta={`${rangeLabel} · ${industryLabel}`}
          />

          <div className="mt-5.5">
            <JobResults
              jobs={jobs}
              pageHref={(n) => `?${write({ page: n })}`}
              onClearFilters={filtered ? clearFilters : null}
            />
          </div>
        </Section>
      )}
    </>
  );
}
