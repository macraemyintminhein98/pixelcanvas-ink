import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AdSlotTop, AdSlotBottom } from "@/components/AdSlot";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PixelCanvas.ink | Collaborative Digital Art Canvas" },
      { name: "description", content: "PixelCanvas.ink is a collaborative digital art canvas. Buy a 1×1 square for $1, customize it with your color and link, and own your piece of the internet forever." },
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
      <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        <AdSlotTop />
        <h1 className="font-display text-4xl">About PixelCanvas.ink</h1>

        <p className="text-lg leading-relaxed">
          PixelCanvas.ink is a collaborative digital art canvas — a 100×100 grid of individually owned squares, each representing a permanent piece of a shared public artwork. Anyone can browse the canvas for free. Buy a square for $1, customize it with your color, name, and link, and it's yours forever.
        </p>

        <div className="space-y-4">
          <h2 className="font-display text-2xl">The Idea</h2>
          <p className="leading-relaxed">
            In 2005, Alex Tew created the Million Dollar Homepage — a 1,000×1,000 pixel grid where each pixel sold for $1. It became a viral internet landmark, raised $1 million, and proved that people genuinely want to own a piece of something shared and permanent on the web.
          </p>
          <p className="leading-relaxed">
            PixelCanvas takes that idea and brings it into 2026 — with a cleaner canvas, instant payments via Stripe, full customization, a live leaderboard, and a community of owners who each hold a small, visible piece of something bigger than themselves.
          </p>
        </div>

        <div className="brut-border bg-zap/30 p-6 space-y-3">
          <h2 className="font-display text-2xl">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
            <li><strong>Browse the canvas</strong> — the 100×100 grid is public and free to explore. Zoom in, click squares, and see what other owners have created.</li>
            <li><strong>Pick your square</strong> — any unclaimed square is available. Center tiles are more visible and priced at $5. Edge and corner tiles are $1.</li>
            <li><strong>Customize it</strong> — choose a color, add your name, link to your website or social profile, and optionally upload a tiny image.</li>
            <li><strong>Pay via Stripe</strong> — secure, instant payment. Your square is claimed the moment payment confirms.</li>
            <li><strong>Own it forever</strong> — your square never expires. It lives on the canvas as long as PixelCanvas exists, visible to every visitor.</li>
          </ol>
          <Link to="/canvas" className="mt-4 inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm">
            Open the canvas →
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl">Who Buys Pixels?</h2>
          <p className="leading-relaxed">
            Individuals who want a small, permanent corner of the internet with their name on it. Small businesses and creators who want an unconventional backlink and a piece of internet history. Artists who want to contribute to a collaborative digital artwork. Developers and collectors who just think the concept is cool.
          </p>
          <p className="leading-relaxed">
            Every owner gets a public profile page showing all their claimed squares, the colors and links they've set, and their rank on the leaderboard. It's part art gallery, part guestbook, part permanent record.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl">The Business Model</h2>
          <p className="leading-relaxed">
            The canvas is free to browse and supported by display advertising. When you buy a square, the ads disappear for you permanently. Your $1 (or $5) goes directly toward maintaining the platform, keeping it online, and building new features. There are no subscriptions, no hidden fees, and no recurring charges.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl">Privacy</h2>
          <p className="leading-relaxed">
            We collect only what's necessary: your payment is processed by Stripe (we never see your card details), and we store your chosen pixel color, name, and link. Browse anonymously — no account required to view the canvas. Create an account only if you want to manage your squares or appear on the leaderboard.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl">Contact</h2>
          <p className="leading-relaxed">
            Questions about your purchase, a pixel that didn't load correctly, or just want to say hi? Reach out at <a href="mailto:contact@pixelcanvas.ink" className="underline text-flame">contact@pixelcanvas.ink</a> or use the <Link to="/contact" className="underline text-flame">contact form</Link>.
          </p>
        </div>

        <AdSlotBottom />
      </main>
      <Footer />
    </div>
  );
}
