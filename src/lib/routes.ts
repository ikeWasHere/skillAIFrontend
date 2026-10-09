/* The /jobs query string. The jobs page reads these names and every link into it is
   built here, so the two can't drift apart. */

export const JOBS_PARAM = {
  role: "role",
  skill: "skill",
  certificate: "certificate",
  industry: "industry",
  dateRange: "date_range",
  page: "page",
} as const;

export interface JobsLink {
  role: string;
  skill?: string;
  certificate?: string;
}

export function jobsHref({ role, skill, certificate }: JobsLink): string {
  const params = new URLSearchParams({ [JOBS_PARAM.role]: role });
  if (skill) params.set(JOBS_PARAM.skill, skill);
  if (certificate) params.set(JOBS_PARAM.certificate, certificate);
  return `/jobs?${params}`;
}
