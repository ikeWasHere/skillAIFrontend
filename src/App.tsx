import { Outlet, ScrollRestoration } from "react-router";

import { Masthead } from "./sections/Masthead";

/** The frame every route renders inside. Routes themselves are declared in main.tsx. */
function App() {
  return (
    <main className="graph-paper min-h-screen">
      <Masthead />
      <Outlet />
      {/* New pages open at the top; back and forward return to where the reader was. */}
      <ScrollRestoration />
    </main>
  );
}

export default App;
