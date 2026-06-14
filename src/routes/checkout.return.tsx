import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (s: Record<string, unknown>) => ({
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
    x: typeof s.x === "string" ? Number(s.x) : undefined,
    y: typeof s.y === "string" ? Number(s.y) : undefined,
  }),
  component: ReturnPage,
});

function ReturnPage() {
  const { session_id, x, y } = Route.useSearch();
  useEffect(() => {
    try {
      localStorage.setItem("cs_paying", "1");
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Nav />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="brut-border bg-zap px-3 py-1 font-display text-xs uppercase">Payment received</div>
        <h1 className="mt-4 font-display text-4xl">You're on the canvas.</h1>
        {x !== undefined && y !== undefined && (
          <p className="mt-2 text-sm opacity-70">
            Pixel ({x}, {y}) will appear in seconds — we're confirming with the payment processor.
          </p>
        )}
        {session_id && <div className="mt-3 text-[10px] opacity-50">Ref: {session_id}</div>}
        <div className="mt-6 flex gap-2">
          <Link to="/canvas" className="brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm">
            Back to canvas
          </Link>
          <Link to="/" className="brut-border bg-paper px-4 py-2 font-display text-sm uppercase brut-shadow-sm">
            Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
