import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getOwnerProfile } from "@/lib/pixels.functions";

const CANVAS_SIZE = 100;

type OwnedSquare = {
  x: number;
  y: number;
  color: string;
  image_url: string | null;
  owner_name: string;
  owner_url: string | null;
  purchased_at: string;
};

type Owner = {
  owner_name: string;
  owner_url: string | null;
  first_claim: string;
  squares: OwnedSquare[];
};

export const Route = createFileRoute("/profile/$handle")({
  component: ProfilePage,
});

function ProfilePage() {
  const { handle } = Route.useParams();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOwnerProfile({ data: { handle } })
      .then((r) => setOwner((r?.owner as Owner | null) ?? null))
      .catch((e) => console.error("getOwnerProfile failed", e))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Nav />
        <div className="mx-auto max-w-5xl px-4 py-10 text-sm opacity-60">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="min-h-screen bg-paper">
        <Nav />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="font-display text-4xl">No such buyer.</div>
          <p className="mt-2 opacity-70">Nobody by that name has claimed a square yet.</p>
          <Link to="/canvas" className="mt-4 inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper">
            Back to canvas
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const squares = owner.squares;
  const ownedSet = new Set(squares.map((s) => s.y * CANVAS_SIZE + s.x));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="brut-border bg-paper p-6 md:col-span-5 brut-shadow">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center brut-border bg-flame font-display text-2xl text-paper">
                {owner.owner_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-display text-3xl">{owner.owner_name}</div>
                {owner.owner_url && (
                  <a href={owner.owner_url} target="_blank" rel="noopener noreferrer" className="text-sm underline opacity-70">
                    {owner.owner_url}
                  </a>
                )}
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="brut-border bg-zap/40 p-2">
                <dt className="text-[10px] uppercase opacity-60">Squares</dt>
                <dd className="font-display text-lg">{squares.length}</dd>
              </div>
              <div className="brut-border bg-paper p-2">
                <dt className="text-[10px] uppercase opacity-60">First claim</dt>
                <dd className="font-display text-sm">{new Date(owner.first_claim).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-7">
            <div className="brut-border bg-paper p-4">
              <div className="font-display text-xs uppercase opacity-60">Owned squares</div>
              <div className="mt-3 grid grid-cols-8 gap-1 sm:grid-cols-10">
                {squares.map((s) => (
                  <div
                    key={`${s.x}-${s.y}`}
                    title={`(${s.x}, ${s.y})`}
                    className="aspect-square brut-border"
                    style={{ background: s.color }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 brut-border bg-zap p-4">
              <div className="font-display text-sm uppercase">Map of {owner.owner_name}'s squares</div>
              <div className="mt-2 grid grid-cols-[repeat(100,1fr)] gap-[1px]">
                {Array.from({ length: CANVAS_SIZE }).map((_, y) =>
                  Array.from({ length: CANVAS_SIZE }).map((_, x) => {
                    const id = y * CANVAS_SIZE + x;
                    const owned = ownedSet.has(id);
                    return <div key={id} className={owned ? "bg-ink" : "bg-paper/50"} style={{ width: 3, height: 3 }} />;
                  }),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
