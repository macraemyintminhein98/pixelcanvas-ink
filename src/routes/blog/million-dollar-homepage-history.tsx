import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog/million-dollar-homepage-history")({
  head: () => ({
    meta: [
      { title: "The Million Dollar Homepage: The Viral Idea That Changed the Internet | PixelCanvas" },
      { name: "description", content: "In 2005, a student named Alex Tew sold pixels for $1 each and made $1 million. Here's the full story and why it still matters in 2026." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10 prose prose-sm max-w-none">
        <Link to="/blog" className="text-sm text-flame hover:underline">← Back to Blog</Link>
        <h1 className="font-display text-4xl mt-4 mb-2">The Million Dollar Homepage: The Viral Idea That Changed the Internet</h1>
        <p className="text-sm text-muted-foreground mb-8">June 2026 · 6 min read</p>

        <p>In August 2005, a 21-year-old British student named Alex Tew was lying in bed worrying about university debt when he had an idea so simple it was almost embarrassing: sell pixels on a webpage for $1 each. One million pixels. One million dollars. The math was obvious. Whether anyone would actually pay was not.</p>

        <h2>The Setup</h2>
        <p>Tew registered milliondollarhomepage.com, built a basic 1000×1000 pixel grid, and sent a press release to a handful of journalists. Pixels were sold in 10×10 blocks — the minimum purchase was $100, which bought you a 10×10 square you could fill with an image and a link.</p>
        <p>The first sale came from his family. Then friends. Then strangers. Then the media found it.</p>
        <p>Within weeks, the BBC, CNN, and dozens of tech publications had written about it. The story was too strange and too human to ignore: a kid trying to pay for university by selling empty pixels, and people actually buying them. By January 2006, all one million pixels had sold. Tew had made $1,037,100 — the last 1,000 pixels sold at auction for $38,100 alone, purely because of the novelty of being the last.</p>

        <h2>Why It Worked</h2>
        <p>The Million Dollar Homepage succeeded because it was honest about what it was. There was no pretense of value beyond the novelty. You weren't buying a product or a service. You were buying a small piece of something that was genuinely unique — a single artifact of early internet culture, visible to everyone who visited, permanent as long as the domain existed.</p>
        <p>It also worked because of the network effect. Each new buyer made the page more interesting, which attracted more visitors, which attracted more buyers. The first 100 pixels were sold almost as charity. By pixel 500,000, companies were competing to appear alongside each other on the world's most talked-about webpage.</p>

        <h2>The Legacy</h2>
        <p>The Million Dollar Homepage spawned hundreds of imitators, none of which achieved the same cultural moment. That's the nature of being first. But it proved something important: people have a genuine desire to own a visible, permanent piece of something shared on the internet.</p>
        <p>That desire hasn't gone away. If anything, it's stronger — we've spent 20 years building social media profiles that platforms can delete, posting content that disappears from feeds within hours, and accumulating digital goods tied to accounts that can be banned. Permanent, visible, unconditional ownership of something on the open web still has real appeal.</p>

        <h2>PixelCanvas in 2026</h2>
        <p>PixelCanvas is built on the same simple idea — but with two decades of better infrastructure. Payments via Stripe instead of PayPal disputes. A live, interactive canvas instead of a static image. Owner profiles, a leaderboard, customizable colors, and optional links. The pixel you buy at pixelcanvas.ink is yours: visible, permanent, and linked to whatever you want the world to see.</p>
        <p>Alex Tew didn't invent the idea of owning a pixel. He proved that people wanted to. We're just carrying that forward.</p>

        <div className="brut-border bg-zap/30 p-5 mt-8 not-prose">
          <p className="font-bold mb-1">Claim your square</p>
          <p className="text-sm text-muted-foreground mb-3">100×100 grid. $1 per square. Yours forever.</p>
          <Link to="/canvas" className="inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm">Open the canvas →</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
