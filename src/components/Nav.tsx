import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Nav() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 brut-border border-x-0 border-t-0 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-7 w-7 grid-cols-2 grid-rows-2 gap-px brut-border bg-ink">
            <div className="bg-flame" />
            <div className="bg-zap" />
            <div className="bg-paper" />
            <div className="bg-ink" />
          </div>
          <span className="font-display text-lg tracking-tight">PIXELCANVAS</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/canvas" activeProps={{ className: "text-flame" }}>Canvas</Link>
          <Link to="/leaderboard" activeProps={{ className: "text-flame" }}>Buyers</Link>
          <Link to="/admin" activeProps={{ className: "text-flame" }}>Admin</Link>
          <Link to="/legal" activeProps={{ className: "text-flame" }}>Legal</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="brut-border bg-paper px-2 py-1 text-xs font-bold uppercase brut-shadow-sm transition-transform hover:-translate-x-px hover:-translate-y-px"
            aria-label="Toggle theme"
          >
            {dark ? "Light" : "Dark"}
          </button>
          <Link
            to="/auth"
            className="brut-border bg-ink px-3 py-1.5 text-xs font-bold uppercase text-paper brut-shadow-sm transition-transform hover:-translate-x-px hover:-translate-y-px"
          >
            Sign in
          </Link>
          <Link
            to="/canvas"
            className="brut-border bg-flame px-3 py-1.5 text-xs font-bold uppercase text-paper brut-shadow-sm transition-transform hover:-translate-x-px hover:-translate-y-px"
          >
            Claim a square
          </Link>
        </div>
      </div>
    </header>
  );
}
