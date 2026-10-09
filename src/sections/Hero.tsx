import { Chip, MicroLabel, StatTile } from "../components/primitives";
import type { Async } from "../hooks/useSkillIq";
import type { FilterOption, SkillsResponse } from "../lib/api";
import { DASH, formatCount, formatSalary } from "../lib/format";

interface HeroProps {
  roles: Async<FilterOption[]>;
  role: string | null;
  onRoleChange: (role: string) => void;
  skills: Async<SkillsResponse>;
}

/** The role picker, mid-request and on failure. Chips are the only control here,
 *  so the column has to say something rather than collapse to nothing. */
function RolePickerState({ children }: { children: string }) {
  return (
    <p className="mt-3 font-mono font-light text-[12.5px]/[1.6] text-ink/55">
      {children}
    </p>
  );
}

export function Hero({ roles, role, onRoleChange, skills }: HeroProps) {
  const metrics = skills.data?.metrics ?? null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.15fr_.85fr]">
      <div className="border-ink/25 px-6 pt-10 pb-10 md:border-r md:px-11 md:pt-14 md:pb-11">
        <h1 className="mt-5 font-serif text-[44px]/[.96] tracking-[-.015em] text-ink text-pretty md:text-[78px]/[.94]">
          Search With Confidence
        </h1>

        <p className="mt-5.5 max-w-130 font-mono font-light text-[15px]/[1.7] text-ink/68 text-pretty">
          Skill IQ sorts every skill in your target role to show you what recruiters are
          actively looking for. Using live data we make it easy for you to decide what to
          spend your time on.
        </p>
      </div>

      <div className="px-6 pt-10 pb-10 md:pt-14 md:pr-11 md:pb-11 md:pl-8.5">
        <MicroLabel variant="section">Role</MicroLabel>

        {roles.loading && <RolePickerState>Loading roles…</RolePickerState>}

        {roles.error && (
          <RolePickerState>Role list unavailable. Reload to retry.</RolePickerState>
        )}

        {roles.data && (
          <div className="mt-3 flex flex-col gap-1">
            {roles.data.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={option.value === role}
                onSelect={() => onRoleChange(option.value)}
              />
            ))}
          </div>
        )}

        {/* Tiles hold their frame through the request and render an em-dash rather
            than a zero, so a pending number never reads as a real one. */}
        <div className="hairline-grid mt-6 grid-cols-2">
          <StatTile
            label="Open roles"
            value={skills.loading ? DASH : formatCount(metrics?.open_roles.value ?? null)}
          />
          <StatTile
            label="Median base"
            value={
              skills.loading
                ? DASH
                : formatSalary(metrics?.median_salary_usd.value ?? null)
            }
          />
        </div>

        {skills.error && (
          <p className="mt-3 font-mono font-light text-[11px]/[1.5] text-error">
            Metrics unavailable for this role.
          </p>
        )}
      </div>
    </div>
  );
}
