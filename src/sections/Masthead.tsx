import { Link, NavLink } from "react-router";

const NAV = [
  { to: "/", label: "Skills" },
  { to: "/jobs", label: "Jobs" },
];

export function Masthead() {
  return (
    <header className="flex flex-wrap items-stretch border-b border-ink/35">
      <Link
        to="/"
        className="flex items-baseline gap-2.25 border-r border-ink/35 px-6 py-4 hover:text-ink"
      >
        <span className="font-serif text-[20px]/[1] text-ink">Skill IQ</span>
      </Link>

      <nav className="ml-auto flex items-stretch">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center border-l border-ink/35 px-5 font-mono font-light text-[10.5px]/[1] tracking-[.14em] uppercase ${
                isActive
                  ? "bg-ink text-paper hover:text-paper"
                  : "text-ink/60 hover:bg-panel-hover hover:text-ink"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
