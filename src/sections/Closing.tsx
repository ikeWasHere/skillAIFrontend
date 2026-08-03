import { MicroLabel, SearchBar } from "../components/primitives";

const FOOTER = [
  { label: "Dataset", value: "Skill IQ demand index — US data roles", serif: true },
  { label: "Window", value: "90 days rolling" },
  { label: "Updated", value: "2026-07-28 06:00 UTC" },
  { label: "Note", value: "Illustrative sample data", dim: true },
];

export function Closing() {
  return (
    <>
      <section className="flex flex-col items-start justify-between gap-8 border-t border-ink/35 bg-panel px-6 py-10 md:flex-row md:items-center md:gap-11 md:px-11 md:py-12">
        <h2 className="max-w-140 font-serif text-[32px]/[1.06] text-ink text-pretty md:text-[40px]">
          Check your role before you pick your next course.
        </h2>

        <div className="flex w-full flex-col gap-2.5 md:w-auto md:min-w-87.5">
          <SearchBar placeholder="Search a role…" action="Look up" compact />
          <span className="font-mono font-light text-[10px]/[1.5] text-ink/50">
            Free · no account · 1,140 metros covered.
          </span>
        </div>
      </section>

      <footer className="grid grid-cols-2 border-t border-ink/35 md:grid-cols-[1.5fr_.8fr_.8fr_.9fr]">
        {FOOTER.map((cell, i) => (
          <div
            key={cell.label}
            className={`px-4.5 py-3.75 ${i < FOOTER.length - 1 ? "border-r border-ink/20" : ""}`}
          >
            <MicroLabel variant="footer" className="text-ink/45">
              {cell.label}
            </MicroLabel>
            <div
              className={
                cell.serif
                  ? "mt-1.75 font-serif text-[15px]/[1] text-ink"
                  : `mt-1.75 font-mono font-light text-[11.5px]/[1] ${cell.dim ? "text-ink/55" : "text-ink/70"}`
              }
            >
              {cell.value}
            </div>
          </div>
        ))}
      </footer>
    </>
  );
}
