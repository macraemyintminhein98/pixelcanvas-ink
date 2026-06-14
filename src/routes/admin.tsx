import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import { getCanvasStats, getLeaderboard, getRecentClaims } from "@/lib/pixels.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Canvas Stake" }] }),
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/auth" });
    try {
      const { isAdmin } = await checkIsAdmin();
      if (!isAdmin) throw redirect({ to: "/" });
    } catch (e) {
      if (e && typeof e === "object" && "to" in e) throw e;
      throw redirect({ to: "/" });
    }
  },
  component: AdminPage,
});

type Owner = { owner_name: string; count: number; spent: number; first: string };
type Claim = { x: number; y: number; color: string; owner_name: string; owner_url: string | null; purchased_at: string };

function AdminPage() {
  const [stats, setStats] = useState({ sold: 0, total: 10000, revenue: 0, buyers: 0 });
  const [owners, setOwners] = useState<Owner[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    Promise.all([
      getCanvasStats(),
      getLeaderboard(),
      getRecentClaims({ data: { limit: 25 } }),
    ])
      .then(([s, l, c]) => {
        setStats(s as any);
        setOwners((l?.owners as Owner[]) ?? []);
        setClaims((c?.claims as Claim[]) ?? []);
      })
      .catch((e) => console.error("admin load failed", e));
  }, []);

  const topOwner = owners[0];

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div>
          <div className="font-display text-xs uppercase opacity-60">Admin</div>
          <h1 className="font-display text-4xl">Mission control</h1>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            ["GMV", `$${stats.revenue.toLocaleString()}`],
            ["Squares sold", stats.sold.toString()],
            ["Buyers", stats.buyers.toString()],
            ["Claimed", `${((stats.sold / stats.total) * 100).toFixed(2)}%`],
            ["Top buyer", topOwner ? topOwner.owner_name : "—"],
            ["Top buyer squares", topOwner ? topOwner.count.toString() : "—"],
            ["Remaining", (stats.total - stats.sold).toLocaleString()],
            ["Recent claims (24h shown)", claims.length.toString()],
          ].map(([l, v]) => (
            <div key={l} className="brut-border bg-paper p-4 brut-shadow-sm">
              <div className="text-[10px] uppercase opacity-60">{l}</div>
              <div className="font-display text-2xl">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 brut-border bg-paper">
          <div className="border-b-2 border-ink p-3 font-display text-xs uppercase">Recent orders</div>
          {claims.length === 0 ? (
            <div className="p-6 text-sm opacity-60">No orders yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-ink text-left text-paper">
                <tr>
                  <th className="p-2">When</th>
                  <th className="p-2">Buyer</th>
                  <th className="p-2">Square</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={`${c.x}-${c.y}`} className="border-t-2 border-ink">
                    <td className="p-2">{new Date(c.purchased_at).toLocaleString()}</td>
                    <td className="p-2">{c.owner_name}</td>
                    <td className="p-2 font-display">({c.x},{c.y})</td>
                    <td className="p-2">
                      <span className="inline-block h-4 w-4 brut-border align-middle" style={{ background: c.color }} /> {c.color}
                    </td>
                    <td className="p-2">
                      {c.owner_url ? (
                        <a href={c.owner_url} target="_blank" rel="noopener noreferrer" className="underline">↗</a>
                      ) : (
                        <span className="opacity-40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
