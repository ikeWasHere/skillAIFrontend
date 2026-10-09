import { useEffect, useState } from "react";

import {
  fetchCertifications,
  fetchFilters,
  fetchJobs,
  fetchSkills,
  type ApiCertification,
  type ApiSkill,
  type FilterOption,
  type JobsQuery,
  type JobsResponse,
  type Scope,
  type SkillsResponse,
} from "../lib/api";

/* React state for one request. Every section reads the same three fields, so a
   loading or failed panel looks the same wherever it appears. */
export interface Async<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

const PENDING = { data: null, error: null, loading: true } as const;

/** An aborted request is us unmounting or switching role, not a failure to show. */
function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Runs `run` whenever `key` changes; a null key means "not ready yet" and stays pending.
 *
 * The result is tagged with the key it answered, so the render after a key change
 * reads as pending instead of showing the previous answer under the new filters.
 * Aborting on change is what stops a slow response for an old key from landing
 * after a fast one for the current key.
 */
function useRequest<T>(
  key: string | null,
  run: (signal: AbortSignal) => Promise<T>,
): Async<T> {
  const [state, setState] = useState<Async<T> & { key: string | null }>({
    key: null,
    ...PENDING,
  });

  useEffect(() => {
    if (key === null) return;

    const controller = new AbortController();

    run(controller.signal)
      .then((data) => setState({ key, data, error: null, loading: false }))
      .catch((error: Error) => {
        if (isAbort(error)) return;
        setState({ key, data: null, error, loading: false });
      });

    return () => controller.abort();
    // `run` closes over the values `key` encodes, so the key alone decides refetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state.key === key ? state : PENDING;
}

export function useFilters(): Async<FilterOption[]> {
  return useRequest("roles", (signal) =>
    fetchFilters(undefined, signal).then((res) => res.roles),
  );
}

/** Metrics and skills arrive together, so the hero and the skill board share one call. */
export function useSkills(role: string | null): Async<SkillsResponse> {
  return useRequest(role, (signal) => fetchSkills(role!, { limit: 20 }, signal));
}

export function useCertifications(role: string | null): Async<ApiCertification[]> {
  return useRequest(role, (signal) =>
    fetchCertifications(role!, { limit: 8 }, signal).then((res) => res.certifications),
  );
}

/* ─── Jobs page ───
   Dropdown options come from the same endpoints as the board, at the API's 50-row
   cap, so every choice offered is one the data actually contains. */

const OPTION_LIMIT = 50;

/** Industries that have postings for this role. */
export function useIndustryOptions(role: string | null): Async<FilterOption[]> {
  return useRequest(role, (signal) =>
    fetchFilters(role!, signal).then((res) => res.industries),
  );
}

export function useSkillOptions(role: string | null, scope: Scope): Async<ApiSkill[]> {
  const key = role && JSON.stringify([role, scope.dateRange, scope.industry]);
  return useRequest(key, (signal) =>
    fetchSkills(role!, { ...scope, limit: OPTION_LIMIT }, signal).then(
      (res) => res.skills,
    ),
  );
}

export function useCertificateOptions(
  role: string | null,
  scope: Scope,
): Async<ApiCertification[]> {
  const key = role && JSON.stringify([role, scope.dateRange, scope.industry]);
  return useRequest(key, (signal) =>
    fetchCertifications(role!, { ...scope, limit: OPTION_LIMIT }, signal).then(
      (res) => res.certifications,
    ),
  );
}

export function useJobs(query: JobsQuery | null): Async<JobsResponse> {
  return useRequest(query && JSON.stringify(query), (signal) =>
    fetchJobs(query!, signal),
  );
}
