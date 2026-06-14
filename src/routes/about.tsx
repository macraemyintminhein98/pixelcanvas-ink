import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AdSlotTop, AdSlotBottom } from "@/components/AdSlot";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PixelCanvas.ink" },
      { name: "description", content: "PixelCanvas.ink is a collaborative digital art canvas. Buy pixels for $1, customize them, and own your piece of the internet forever." },
      { property: "og:title", content: "About PixelCanvas.ink" },
      { property: "og:description", content: "PixelCanvas.ink is a collaborative digital art canvas. Buy pixels for $1, customize them, and own your piece of the internet forever." },
    ],
    links: [{ rel: "canonical", href: "https://www.pixelcanvas.ink/about" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <AdSlotTop />
        <h1 className="font-display text-4xl">About PixelCanvas.ink</h1>
        <p className="text-lg">
          PixelCanvas.ink is a collaborative digital art canvas where you can buy and customize pixels.
          Free to browse, ads-supported. Purchase pixels to go ad-free and own your piece of the canvas forever.
        </p>
        <div className="brut-border bg-zap/30 p-6">
          <h2 className="font-display text-2xl">How it works</h2>
          <ol className="mt-3 list-decimal pl-5 space-y-1 text-sm">
            <li>Pick any unclaimed square on the 100×100 canvas.</li>
            <li>Pay $1 (or $5 for premium center tiles) via Stripe.</li>
            <li>Customize with a color, name, optional link, and optional image.</li>
            <li>Your pixel lives on the canvas — and the ads disappear.</li>
          </ol>
          <Link to="/canvas" className="mt-4 inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm">
            Open the canvas →
          </Link>
        </div>
        <AdSlotBottom />
      </main>
      <Footer />
    </div>
  );
}
