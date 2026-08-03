import { Chip, MicroLabel, SearchBar, StatTile } from "../components/primitives";
import { ROLES, ROLE_NAMES } from "../lib/data";

interface HeroProps {
  role: string;
  onRoleChange: (role: string) => void;
}

export function Hero({ role, onRoleChange }: HeroProps) {
  const data = ROLES[role];
  const openings = data.openings.toLocaleString("en-US");
  const rising = data.change.startsWith("+");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.15fr_.85fr]">
      <div className="border-ink/25 px-6 pt-10 pb-10 md:border-r md:px-11 md:pt-14 md:pb-11">
        <h1 className="mt-5 font-serif text-[44px]/[.96] tracking-[-.015em] text-ink text-pretty md:text-[78px]/[.94]">
          Which skills are moving the needle?
        </h1>

        <p className="mt-5.5 max-w-130 font-mono font-light text-[15px]/[1.7] text-ink/68 text-pretty">
          Skill IQ sorts every skill in your target role to show you what recruiters are
          actively looking for. Using live data we make it easy for you to decide what to
          spend your time on.
        </p>

        <div className="mt-7 max-w-140">
          {/*Add search funtionality */}
          <SearchBar placeholder="Search a role or skill…" action="Look up" />
        </div>
      </div>

      <div className="px-6 pt-10 pb-10 md:pt-14 md:pr-11 md:pb-11 md:pl-8.5">
        <MicroLabel variant="section">Role</MicroLabel>

        <div className="mt-3 flex flex-col gap-1">
          {ROLE_NAMES.map((name) => (
            <Chip
              key={name}
              label={name}
              selected={name === role}
              onSelect={() => onRoleChange(name)}
            />
          ))}
        </div>

        <div className="hairline-grid mt-6 grid-cols-2">
          <StatTile label="Openings" value={openings} />
          <StatTile
            label="Demand Δ 90d"
            value={data.change}
            tone={rising ? "up" : "down"}
          />
          <StatTile label="Median base" value={data.median} />
          <StatTile label="Applicants / hire" value={data.competition} />
        </div>
      </div>
    </div>
  );
}
