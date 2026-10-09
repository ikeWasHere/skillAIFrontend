import { Select } from "../components/primitives";
import type { Async } from "../hooks/useSkillIq";
import {
  ALL_INDUSTRIES,
  DATE_RANGES,
  type ApiCertification,
  type ApiSkill,
  type DateRange,
  type FilterOption,
} from "../lib/api";
import { formatPercent } from "../lib/format";
import { isCore } from "../lib/skills";

export interface JobFilterValues {
  role: string;
  skill: string;
  certificate: string;
  industry: string;
  dateRange: DateRange;
}

interface JobFiltersProps {
  values: JobFilterValues;
  onChange: (patch: Partial<JobFilterValues>) => void;
  roles: FilterOption[];
  skills: Async<ApiSkill[]>;
  certificates: Async<ApiCertification[]>;
  industries: Async<FilterOption[]>;
}

/**
 * A select shows the first option when its value isn't among them, which would
 * claim a different filter than the one applied. That happens while options load,
 * or when a link or a narrowed window leaves the current choice outside the list,
 * so the applied value is always kept as an option.
 */
function withSelected(options: FilterOption[], value: string): FilterOption[] {
  if (!value || options.some((o) => o.value === value)) return options;
  return [{ value, label: value }, ...options];
}

const ALL_INDUSTRIES_OPTION = { value: ALL_INDUSTRIES, label: "All Industries" };

export function JobFilters({
  values,
  onChange,
  roles,
  skills,
  certificates,
  industries,
}: JobFiltersProps) {
  /* Core skills keep their star here too, and every skill carries its share, so the
     list reads in the same order as the board it was reached from. */
  const skillOptions = (skills.data ?? []).map((s) => ({
    value: s.name,
    label: `${isCore(s.occurrence_pct) ? "★ " : ""}${s.name} · ${formatPercent(s.occurrence_pct)}`,
  }));

  const certificateOptions = (certificates.data ?? []).map((c) => ({
    value: c.name,
    label: c.provider ? `${c.name} · ${c.provider}` : c.name,
  }));

  const noCertificates = !certificates.loading && certificateOptions.length === 0;

  return (
    <div className="hairline-grid grid-cols-2 lg:grid-cols-5">
      {/* Role spans the first row at two columns so five cells leave no gap. */}
      <div className="col-span-2 bg-panel p-4 lg:col-span-1">
        <Select
          label="Role"
          value={values.role}
          options={roles}
          onChange={(role) => onChange({ role })}
        />
      </div>

      <div className="bg-panel p-3 sm:p-4">
        <Select
          label="Skill"
          value={values.skill}
          options={withSelected(skillOptions, values.skill)}
          anyLabel={skills.loading ? "Loading…" : "Any"}
          disabled={skills.loading}
          onChange={(skill) => onChange({ skill })}
        />
      </div>

      <div className="bg-panel p-3 sm:p-4">
        <Select
          label="Certificate"
          value={values.certificate}
          options={withSelected(certificateOptions, values.certificate)}
          anyLabel={
            certificates.loading ? "Loading…" : noCertificates ? "None listed" : "Any"
          }
          disabled={certificates.loading || (noCertificates && !values.certificate)}
          onChange={(certificate) => onChange({ certificate })}
        />
      </div>

      <div className="bg-panel p-3 sm:p-4">
        <Select
          label="Industry"
          value={values.industry}
          options={withSelected(
            industries.data ?? [ALL_INDUSTRIES_OPTION],
            values.industry,
          )}
          disabled={industries.loading}
          onChange={(industry) => onChange({ industry })}
        />
      </div>

      <div className="bg-panel p-3 sm:p-4">
        <Select
          label="Posted"
          value={values.dateRange}
          options={DATE_RANGES}
          onChange={(dateRange) => onChange({ dateRange: dateRange as DateRange })}
        />
      </div>
    </div>
  );
}
