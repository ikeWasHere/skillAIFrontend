/* The Skill IQ API. One module owns the wire format: every endpoint, every response
   shape, and the URL they hang off. Nothing above this layer knows about HTTP. */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://skill-iq-api.ashymushroom-f5215132.westus2.azurecontainerapps.io";

/* ─── Wire types ───
   Field names are snake_case because that is what the server sends. They are
   converted to the app's own vocabulary at the section boundary, not here. */

export interface FilterOption {
  value: string;
  label: string;
}

export interface FiltersResponse {
  roles: FilterOption[];
  industries: FilterOption[];
}

/** `delta_pct` is currently null on every metric the API returns. */
export interface Metric {
  value: number;
  delta_pct: number | null;
}

export interface SkillsMetrics {
  job_postings: Metric;
  open_roles: Metric;
  median_salary_usd: Metric;
}

export interface ApiSkill {
  rank: number;
  name: string;
  /** Share of the role's postings that mention the skill, 0–100. */
  occurrence_pct: number;
}

export interface SkillsMeta {
  generated_at: string;
  window_start: string;
  window_end: string;
  window_midpoint: string;
}

export interface SkillsResponse {
  role: string;
  metrics: SkillsMetrics;
  skills: ApiSkill[];
  meta: SkillsMeta;
}

export interface ApiCertification {
  rank: number;
  name: string;
  provider: string;
  occurrence_pct: number;
  demand_badge: string;
}

export interface CertificationsResponse {
  role: string;
  certifications: ApiCertification[];
}

export interface ApiJob {
  job_id: number;
  title: string;
  company: string | null;
  company_domain: string | null;
  /** Snake-case grade, e.g. "mid_level", "senior". */
  seniority: string | null;
  remote: boolean | null;
  hybrid: boolean | null;
  /** Markdown, as scraped from the posting. */
  description: string | null;
  min_salary_usd: number | null;
  max_salary_usd: number | null;
  /** Bare calendar date, "2026-07-28". */
  date_posted: string;
  url: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface JobsResponse {
  role: string;
  skill: { slug: string } | null;
  pagination: Pagination;
  jobs: ApiJob[];
}

/* ─── Transport ─── */

/** Any non-2xx response. Carries the status so callers can tell a 500 from a 404. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Query = Record<string, string | number | undefined>;

async function getJson<T>(path: string, query: Query, signal?: AbortSignal): Promise<T> {
  const url = new URL(`/api${path}`, BASE_URL);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });

  /* fetch only rejects on network failure — a 500 still resolves, so status is
     checked by hand. The server sends text/plain on errors, hence no .json() here. */
  if (!res.ok) {
    throw new ApiError(`GET ${url.pathname} returned ${res.status}`, res.status);
  }

  return (await res.json()) as T;
}

/* ─── Shared filters ───
   Every analysis endpoint takes the same window and industry. The server rejects
   any window outside this list with a 422, so the UI offers exactly these. */

export const DATE_RANGES = [
  { value: "30d", label: "Last 30 days" },
  { value: "60d", label: "Last 60 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "2y", label: "Last 2 years" },
  { value: "all", label: "All time" },
] as const satisfies readonly FilterOption[];

export type DateRange = (typeof DATE_RANGES)[number]["value"];

/** The server's own defaults, so an omitted filter and an explicit one agree. */
export const DEFAULT_DATE_RANGE: DateRange = "90d";
export const ALL_INDUSTRIES = "all";

export interface Scope {
  dateRange?: DateRange;
  industry?: string;
}

/* ─── Endpoints ─── */

/** Role and industry options. Given a role, industries narrow to those with postings for it. */
export function fetchFilters(
  role?: string,
  signal?: AbortSignal,
): Promise<FiltersResponse> {
  return getJson("/filters", { role }, signal);
}

/** Headline metrics and the ranked skill list for one role, in a single response. */
export function fetchSkills(
  role: string,
  { limit = 20, dateRange, industry }: Scope & { limit?: number } = {},
  signal?: AbortSignal,
): Promise<SkillsResponse> {
  return getJson("/skills", { role, limit, date_range: dateRange, industry }, signal);
}

export function fetchCertifications(
  role: string,
  { limit = 8, dateRange, industry }: Scope & { limit?: number } = {},
  signal?: AbortSignal,
): Promise<CertificationsResponse> {
  return getJson(
    "/certifications",
    { role, limit, date_range: dateRange, industry },
    signal,
  );
}

export interface JobsQuery extends Scope {
  role: string;
  /** Matched exactly and case-sensitively against skill names from `fetchSkills`. */
  skill?: string;
  /** Matched exactly against certification names from `fetchCertifications`. */
  certificate?: string;
  page?: number;
  /** The server caps this at 50. */
  pageSize?: number;
}

/** Postings for one role, optionally narrowed to those naming a skill or certificate. */
export function fetchJobs(
  { role, skill, certificate, dateRange, industry, page, pageSize }: JobsQuery,
  signal?: AbortSignal,
): Promise<JobsResponse> {
  return getJson(
    "/jobs",
    {
      role,
      skill,
      certificate,
      date_range: dateRange,
      industry,
      page,
      page_size: pageSize,
    },
    signal,
  );
}
