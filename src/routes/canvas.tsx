import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CanvasGrid } from "@/components/CanvasGrid";
import { CanvasLegend } from "@/components/CanvasLegend";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PixelPurchaseModal } from "@/components/PixelPurchaseModal";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { listPixels } from "@/lib/pixels.functions";

const CANVAS_SIZE = 100;

type DbPixel = {
  x: number;
  y: number;
  color: string;
  image_url: string | null;
  owner_name: string;
  owner_url: string | null;
  purchased_at: string;
  status: "paid" | "pending";
};

export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "The Canvas — Canvas Stake" },
      { name: "description", content: "A live 100×100 public canvas. Pan, zoom, and claim your square." },
    ],
  }),
  component: CanvasPage,
});

function CanvasPage() {
  const [dbPixels, setDbPixels] = useState<DbPixel[]>([]);
  const [heat, setHeat] = useState(false);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [claim, setClaim] = useState<{ x: number; y: number } | null>(null);

  const refreshPixels = async () => {
    try {
      const res = await listPixels();
      setDbPixels((res?.pixels as DbPixel[]) ?? []);
    } catch (e) {
      console.error("listPixels failed", e);
    }
  };

  useEffect(() => {
    refreshPixels();
    const id = setInterval(refreshPixels, 8000);
    return () => clearInterval(id);
  }, []);

  const paidPixels = useMemo(() => dbPixels.filter((p) => p.status === "paid"), [dbPixels]);

  const indexByKey = useMemo(() => {
    const m = new Map<number, DbPixel>();
    for (const p of dbPixels) m.set(p.y * CANVAS_SIZE + p.x, p);
    return m;
  }, [dbPixels]);

  const onSelect = (id: number) => {
    const x = id % CANVAS_SIZE;
    const y = Math.floor(id / CANVAS_SIZE);
    const existing = indexByKey.get(id);
    if (existing) {
      if (existing.status === "paid" && existing.owner_url) {
        window.open(existing.owner_url, "_blank", "noopener,noreferrer");
      }
      return;
    }
    setClaim({ x, y });
  };

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase().replace(/^@|^#/, "");
    const seen = new Set<string>();
    const out: { label: string; action: () => void }[] = [];
    for (const p of paidPixels) {
      const name = (p.owner_name || "").toLowerCase();
      if (name && name.includes(q) && !seen.has(name)) {
        seen.add(name);
        out.push({ label: p.owner_name, action: () => setHighlight(p.owner_name) });
        if (out.length > 8) break;
      }
    }
    return out;
  }, [search, paidPixels]);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PaymentTestModeBanner />
      <Nav />
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_320px]">
        <div className="relative h-[calc(100vh-58px)] brut-border border-l-0 border-y-0 lg:border-r-2">
          <CanvasGrid
            onSelect={onSelect}
            heatmap={heat}
            highlightHandle={highlight}
            initialScale={8}
            extraPixels={dbPixels}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <div className="brut-border bg-paper p-2 brut-shadow-sm">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search owner name"
                className="w-56 bg-transparent text-sm outline-none placeholder:opacity-50"
              />
              {searchResults.length > 0 && (
                <div className="mt-2 border-t-2 border-ink pt-2 text-xs">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={r.action}
                      className="block w-full truncate text-left hover:text-flame"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setHeat((h) => !h)}
              className={`brut-border px-3 py-1.5 text-xs font-bold uppercase brut-shadow-sm ${heat ? "bg-flame text-paper" : "bg-paper"}`}
            >
              {heat ? "Heatmap on" : "Heatmap off"}
            </button>
            {highlight && (
              <button
                onClick={() => setHighlight(null)}
                className="brut-border bg-zap px-3 py-1.5 text-xs font-bold uppercase brut-shadow-sm"
              >
                Clear highlight ({highlight})
              </button>
            )}
          </div>
          <div className="pointer-events-none absolute right-3 top-3 brut-border bg-paper px-3 py-1.5 text-xs">
            Drag to pan · Scroll to zoom · Click empty tile to claim
          </div>
        </div>

        <aside className="flex h-[calc(100vh-58px)] flex-col bg-paper">
          <div className="brut-border border-x-0 border-t-0 p-4">
            <div className="font-display text-xs uppercase opacity-60">How it works</div>
            <ol className="mt-2 space-y-1 text-sm">
              <li>1. Click any empty pixel.</li>
              <li>2. Pick color, name, and a link.</li>
              <li>3. Pay $1 (center zone $5).</li>
              <li>4. Your pixel goes live immediately.</li>
            </ol>
          </div>
          <div className="p-3">
            <CanvasLegend ownedCount={paidPixels.length} />
          </div>
          <div className="flex-1 overflow-auto p-3">
            <div className="font-display text-xs uppercase opacity-60">Latest claims</div>
            <ul className="mt-2 space-y-1.5">
              {paidPixels
                .slice()
                .sort((a, b) => (a.purchased_at < b.purchased_at ? 1 : -1))
                .slice(0, 12)
                .map((p) => (
                  <li key={`${p.x}-${p.y}`} className="flex items-center gap-2 brut-border bg-paper p-2 text-xs">
                    <span className="inline-block h-4 w-4 brut-border" style={{ background: p.color }} />
                    <div className="flex-1 truncate">
                      <div className="font-display">{p.owner_name}</div>
                      <div className="opacity-60">({p.x}, {p.y})</div>
                    </div>
                    {p.owner_url && (
                      <a href={p.owner_url} target="_blank" rel="noopener noreferrer" className="brut-border px-1.5 py-0.5 text-[10px] uppercase">↗</a>
                    )}
                  </li>
                ))}
              {paidPixels.length === 0 && (
                <li className="brut-border bg-zap/30 p-3 text-xs opacity-70">
                  No claims yet. Be the first — click any empty tile.
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>

      {claim && (
        <PixelPurchaseModal
          x={claim.x}
          y={claim.y}
          onClose={() => {
            setClaim(null);
            refreshPixels();
          }}
        />
      )}

      <Footer />
    </div>
  );
}
