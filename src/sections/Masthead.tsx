import { MicroLabel } from "../components/primitives";

const NAV = ["Roles", "Skills", "Certificates", "Pay", "Method"];

export function Masthead() {
  return (
    <>
      <header className="flex flex-wrap items-stretch border-b border-ink/35">
        <div className="flex items-baseline gap-2.25 border-r border-ink/35 px-6 py-4">
          <span className="font-serif text-[20px]/[1] text-ink">Skill IQ</span>
        </div>

        <nav className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:gap-x-6.5 md:px-5.5">
          {NAV.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              <MicroLabel variant="nav" className="text-ink/62">
                {item}
              </MicroLabel>
            </a>
          ))}
        </nav>

        <div className="flex items-center border-l border-ink/35 px-5 py-3">
          <MicroLabel variant="meta" className="text-ink/50">
            {/* Update with live timestamp*/}
            Updated 06:00 UTC
          </MicroLabel>
        </div>
      </header>
    </>
  );
}
