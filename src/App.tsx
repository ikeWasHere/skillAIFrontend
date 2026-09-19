import { useState } from "react";

import { Masthead } from "./sections/Masthead";
import { Hero } from "./sections/Hero";
import { TopSkills } from "./sections/TopSkills";
import { TopCertificates } from "./sections/TopCertificates";
import { TopRoles } from "./sections/TopRoles";
import { Closing } from "./sections/Closing";
import { DEFAULT_THRESHOLDS } from "./lib/trend";

function App() {
  const [role, setRole] = useState("Data Analyst");

  return (
    <main className="graph-paper min-h-screen">
      <Masthead />
      <Hero role={role} onRoleChange={setRole} />
      <TopSkills role={role} thresholds={DEFAULT_THRESHOLDS} />
      <TopCertificates thresholds={DEFAULT_THRESHOLDS} />
      <TopRoles thresholds={DEFAULT_THRESHOLDS} />
      <Closing />
    </main>
  );
}

export default App;
