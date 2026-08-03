import {
  MeterBar,
  MicroLabel,
  Section,
  SectionHeader,
  Sparkline,
} from "../components/primitives";
import { ROLES, type Skill } from "../lib/data";
import {
  TREND_CAP,
  TREND_COLUMN_LABEL,
  TREND_TEXT,
  classify,
  formatDelta,
  type Direction,
  type Thresholds,
} from "../lib/trend";

function SkillRow({
  skill,
  direction,
  seed,
}: {
  skill: Skill;
  direction: Direction;
  seed: number;
}) {
  return (
    <div className="border-b border-ink/10 px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="font-mono text-[15px]/[1.1] text-ink">{skill.name}</span>
        <span
          className={`font-mono text-[12.5px]/[1] tabular-nums ${TREND_TEXT[direction]}`}
        >
          {formatDelta(skill.delta)}
        </span>
      </div>

      <div className="mt-2.5">
        <MeterBar value={skill.share} direction={direction} />
      </div>

      <div className="mt-2.25 flex items-end justify-between gap-3">
        <span className="font-mono font-light text-[10.5px]/[1] text-ink/60">
          {skill.share}% of postings
        </span>
        <Sparkline direction={direction} seed={seed} height={24} width={70} />
      </div>
    </div>
  );
}

interface ColumnProps {
  direction: Direction;
  skills: { skill: Skill; seed: number }[];
}

function TrendColumn({ direction, skills }: ColumnProps) {
  const count = `${skills.length} ${skills.length === 1 ? "skill" : "skills"}`;

  return (
    <div className={`border-t-[3px] bg-panel ${TREND_CAP[direction]}`}>
      <div className="flex items-baseline justify-between border-b border-ink/16 px-4 py-3.5">
        <MicroLabel variant="column" className={TREND_TEXT[direction]}>
          {TREND_COLUMN_LABEL[direction]}
        </MicroLabel>
        <span className="font-mono font-light text-[10px]/[1] text-ink/50">{count}</span>
      </div>

      {skills.map(({ skill, seed }) => (
        <SkillRow key={skill.name} skill={skill} direction={direction} seed={seed} />
      ))}
    </div>
  );
}

export function TopSkills({
  role,
  thresholds,
}: {
  role: string;
  thresholds: Thresholds;
}) {
  const rows = ROLES[role].skills.map((skill, i) => ({
    skill,
    seed: i + 2,
    direction: classify(skill.delta, thresholds),
  }));
  const pick = (d: Direction) => rows.filter((r) => r.direction === d);

  return (
    <Section id="skills">
      <SectionHeader
        title={`Top skills — ${role}`}
        meta="Share of live postings · direction over 90 days"
      />

      <div className="mt-5.5 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        <TrendColumn direction="up" skills={pick("up")} />
        <TrendColumn direction="flat" skills={pick("flat")} />
        <TrendColumn direction="down" skills={pick("down")} />
      </div>
    </Section>
  );
}
