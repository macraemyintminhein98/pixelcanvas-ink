import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getLeaderboard } from "@/lib/pixels.functions";
import { AdSlotTop, AdSlotBottom } from "@/components/AdSlot";


export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [
    { title: "Top buyers — PixelCanvas" },
    { name: "description", content: "See who owns the most pixels on PixelCanvas.ink. Top buyers leaderboard." },
  ] }),
  component: LeaderboardPage,
});

type Owner = {
  owner_name: string;
  owner_url: string | null;
  count: number;
  spent: number;
  first: string;
};

function LeaderboardPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then((r) => setOwners((r?.owners as Owner[]) ?? []))
      .catch((e) => console.error("getLeaderboard failed", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <AdSlotTop />
        <div className="font-display text-xs uppercase opacity-60">Leaderboard</div>
        <h1 className="font-display text-4xl">Top buyers right now.</h1>


        {loading ? (
          <div className="mt-6 brut-border bg-paper p-6 text-sm opacity-60">Loading…</div>
        ) : owners.length === 0 ? (
          <div className="mt-6 brut-border bg-zap/30 p-6 text-center">
            <div className="font-display text-xl">No buyers yet — claim the first square.</div>
            <Link
              to="/canvas"
              className="mt-4 inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm"
            >
              Open the canvas →
            </Link>
          </div>
        ) : (
          <ol className="mt-6 space-y-2">
            {owners.map((u, i) => (
              <li key={u.owner_name + i} className="flex items-center gap-3 brut-border bg-paper p-3 brut-shadow-sm">
                <div className={`grid h-10 w-10 place-items-center brut-border font-display text-lg ${i < 3 ? "bg-flame text-paper" : "bg-paper"}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <Link to="/profile/$handle" params={{ handle: u.owner_name }} className="font-display">
                    {u.owner_name}
                  </Link>
                  <div className="text-xs opacity-60">${u.spent.toLocaleString()} spent · since {new Date(u.first).toLocaleDateString()}</div>
                </div>
                <div className="font-display text-2xl">{u.count}</div>
              </li>
            ))}
          </ol>
        )}
        <AdSlotBottom />
      </section>
      <Footer />

    </div>
  );
}
