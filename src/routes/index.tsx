import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CanvasGrid, type ExtraPixel } from "@/components/CanvasGrid";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LiveTicker } from "@/components/LiveTicker";
import { StickyCTA } from "@/components/StickyCTA";
import { ViewersNow } from "@/components/ViewersNow";
import { AdSlotTop, AdSlotBottom } from "@/components/AdSlot";
import { getCanvasStats, getRecentClaims, listPixels } from "@/lib/pixels.functions";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PixelCanvas — Claim your square on the public canvas" },
      { name: "description", content: "Buy a 1×1 square on a 10,000-square public canvas for $1. Customize it with a color, name, and link. Yours forever. Free to browse." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PixelCanvas",
          url: "https://pixelcanvas.ink",
          description: "A 10,000-square public digital art canvas. Buy a square for $1, customize it, and become part of an internet landmark.",
          potentialAction: {
            "@type": "ViewAction",
            target: "https://pixelcanvas.ink/canvas",
          },
        }),
      },
    ],
  }),
  component: Index,
});

type Stats = { sold: number; total: number; revenue: number; buyers: number };
type Claim = {
  x: number;
  y: number;
  color: string;
  owner_name: string;
  owner_url: string | null;
  purchased_at: string;
};

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="brut-border bg-paper p-4">
      <div className="text-xs font-bold uppercase opacity-60">{label}</div>
      <div className={`mt-1 font-display text-3xl ${accent ?? ""}`}>{value}</div>
    </div>
  );
}

const STEPS = [
  { n: "01", icon: "🎯", t: "Pick a square", d: "Pan, zoom, and choose any unclaimed tile.", b: "10,000 total. First-come, first-served." },
  { n: "02", icon: "💳", t: "Pay $1", d: "Stripe checkout. Premium tiles cost a little more.", b: "Multiple squares in one go." },
  { n: "03", icon: "🎨", t: "Make it yours", d: "A color, name, and an optional link.", b: "Linked to your public profile." },
  { n: "04", icon: "♾️", t: "It is permanent", d: "Your square lives on the canvas forever.", b: "Share it, show it off, come back to it." },
];

function Index() {
  const [stats, setStats] = useState<Stats>({ sold: 0, total: 10000, revenue: 0, buyers: 0 });
  const [newest, setNewest] = useState<Claim[]>([]);
  const [pixels, setPixels] = useState<ExtraPixel[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, p] = await Promise.all([
          getCanvasStats(),
          getRecentClaims({ data: { limit: 6 } }),
          listPixels(),
        ]);
        setStats((s as Stats) ?? stats);
        setNewest((c?.claims as Claim[]) ?? []);
        setPixels((p?.pixels as ExtraPixel[]) ?? []);
      } catch (e) {
        console.error("homepage load failed", e);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sold = stats.sold;
  const pct = ((sold / stats.total) * 100).toFixed(2);
  const left = stats.total - sold;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <LiveTicker />
      <Nav />
      <div className="mx-auto max-w-7xl px-4 pt-4"><AdSlotTop /></div>

      <section className="mx-auto max-w-7xl px-4 py-8 md:py-16">

        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
          <div className="brut-border bg-zap p-5 md:col-span-7 md:row-span-2 md:p-6 brut-shadow">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
              <span className="inline-flex items-center gap-1.5">
                <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-red-600" />
                <span>LIVE</span>
              </span>
              <span>· {sold.toLocaleString()} / {stats.total.toLocaleString()} claimed</span>
            </div>

            <h1 className="mt-3 font-display text-[2.5rem] leading-[0.9] sm:text-5xl md:text-7xl">
              Stake your<br />square on the<br /><span className="text-flame">internet.</span>
            </h1>
            <p className="mt-4 max-w-md text-base md:text-lg">
              10,000 squares. $1 each. Once it&rsquo;s claimed, it&rsquo;s yours —
              forever pinned to a public artwork the whole web can see.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <ViewersNow />
            </div>

            <div className="mt-5 inline-flex items-center gap-2 brut-border bg-ink px-4 py-2 text-paper brut-shadow-sm">
              <span className="font-display text-2xl text-zap">$1</span>
              <span className="font-display text-xs uppercase tracking-wider">per square · yours forever</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/canvas"
                className="brut-border bg-flame px-5 py-3 font-display text-sm uppercase text-paper brut-shadow transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Claim a square →
              </Link>
              <a
                href="#explore-canvas"
                className="brut-border bg-paper px-5 py-3 font-display text-sm uppercase brut-shadow-sm"
              >
                Explore the canvas
              </a>
            </div>
            <div className="mt-5 flex items-center gap-3 text-xs">
              <div className="brut-border bg-paper px-2 py-1">{left.toLocaleString()} left</div>
              <div className="opacity-60">Center tiles $5 · Base $1</div>
            </div>
          </div>

          <div id="explore-canvas" className="brut-border bg-paper md:col-span-5 md:row-span-2 brut-shadow-flame">
            <div className="flex items-center justify-between border-b-2 border-ink px-3 py-2">
              <div className="font-display text-xs uppercase">The Canvas — live</div>
              <Link to="/canvas" className="text-xs font-bold underline">Open ↗</Link>
            </div>
            <div className="aspect-square">
              <CanvasGrid initialScale={3} minimal minScale={1} maxScale={5} extraPixels={pixels} />
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t-2 border-ink px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 brut-border bg-paper" /> Base $1
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 brut-border" style={{ background: "rgba(255,193,7,0.55)" }} /> Center $5
              </span>
              <span className="ml-auto opacity-60 hidden sm:inline">Scroll to zoom · drag to pan</span>
            </div>
          </div>

          <Stat label="Squares sold" value={sold.toLocaleString()} />
          <Stat label="Revenue" value={`$${stats.revenue.toLocaleString()}`} accent="text-flame" />
          <Stat label="Buyers" value={stats.buyers.toString()} />
          <Stat label="Claimed" value={`${pct}%`} />
          <div className="brut-border bg-ink p-4 text-paper md:col-span-8">
            <div className="text-xs font-bold uppercase opacity-60">Newest claims</div>
            {newest.length === 0 ? (
              <div className="mt-2 text-sm opacity-70">No claims yet — be the first to stake a square.</div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                {newest.map((c) => (
                  <Link
                    key={`${c.x}-${c.y}`}
                    to="/profile/$handle"
                    params={{ handle: c.owner_name }}
                    className="flex items-center gap-2 hover:text-zap"
                  >
                    <div className="h-4 w-4 brut-border" style={{ background: c.color, borderColor: "var(--color-paper)" }} />
                    <span className="truncate font-display">({c.x},{c.y})</span>
                    <span className="opacity-60 truncate">{c.owner_name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4"><AdSlotBottom /></div>



      <section className="brut-border border-x-0 bg-ink py-14 text-paper">
        <div className="mx-auto max-w-7xl px-4">
          <div className="font-display text-xs uppercase opacity-60">How it works</div>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Four steps. One square. Forever.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="brut-border bg-paper p-5 text-ink brut-shadow-zap">
                <div className="flex items-center justify-between">
                  <div className="brut-border bg-ink px-2 py-0.5 font-display text-xs text-paper">{s.n}</div>
                  <div className="text-4xl">{s.icon}</div>
                </div>
                <div className="mt-3 font-display text-xl">{s.t}</div>
                <p className="mt-1 text-sm opacity-70">{s.d}</p>
                <div className="mt-3 brut-border bg-zap/40 px-2 py-1 text-xs font-bold">{s.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="font-display text-xs uppercase opacity-60">FAQ</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl">Quick answers.</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            ["Is this an NFT?", "No. Canvas Stake is a digital collectible & public art participation project. No blockchain, no securities framing."],
            ["Can I resell a square?", "Squares aren't transferable in v1. They stay tied to your account."],
            ["What can I put on my square?", "A color, a name, an optional link, and an optional image. All content is moderated."],
            ["Refunds?", "Yes, within 24 hours of purchase if the square hasn't been customized. See refund policy."],
            ["Why $1?", "Low enough to participate, high enough to keep the canvas meaningful."],
            ["When is it sold out?", "We don't know — that's part of the fun. Premium zones go fastest."],
          ].map(([q, a]) => (
            <details key={q} className="brut-border bg-paper p-4">
              <summary className="cursor-pointer font-display">{q}</summary>
              <p className="mt-2 text-sm opacity-70">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <StickyCTA />
      <Footer />
    </div>
  );
}
