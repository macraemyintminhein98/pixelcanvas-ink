import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog/collaborative-internet-art")({
  head: () => ({
    meta: [
      { title: "r/place and the Power of Collaborative Internet Art | PixelCanvas" },
      { name: "description", content: "Reddit's r/place experiments revealed something remarkable about human cooperation. What collaborative internet art tells us about community and creativity." },
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
        <h1 className="font-display text-4xl mt-4 mb-2">r/place and the Power of Collaborative Internet Art</h1>
        <p className="text-sm text-muted-foreground mb-8">June 2026 · 7 min read</p>

        <p>On April 1, 2017, Reddit launched an experiment with no explanation: a blank white canvas, one million pixels, and a simple rule — any user could place one pixel every five minutes. What happened over the next 72 hours became one of the most remarkable demonstrations of spontaneous human cooperation the internet has ever produced.</p>

        <h2>The Experiment</h2>
        <p>r/place was created by Reddit with minimal announcement. Users discovered it and immediately began claiming territory. Within hours, organized communities — subreddits, gaming fandoms, national flag enthusiasts — were coordinating through Discord servers and forum posts to defend and expand their creations.</p>
        <p>The five-minute cooldown was the key design decision. It meant no single user or bot could dominate. Progress required collective effort. To maintain even a small patch of a single color, a community needed dozens of people actively refreshing and replacing pixels as rivals painted over them.</p>

        <h2>What Emerged</h2>
        <p>The result was stunning. Countries planted flags. Gaming communities recreated iconic sprites. A group dedicated themselves to maintaining a tiny black void — and were fought off repeatedly by those trying to fill it with color. The Mona Lisa appeared, was vandalized, and was restored. A community built and defended a working rainbow road.</p>
        <p>The canvas became a real-time record of internet culture in 2017: which games were popular, which communities were organized, which conflicts were playing out in online spaces. Every square was contested. Every color was a statement. The finished canvas, preserved after the experiment ended, remains one of the most detailed artifacts of its moment.</p>

        <h2>r/place Returns</h2>
        <p>Reddit ran r/place again in 2022 and 2023, each time with a larger canvas and more users. The core dynamics repeated: communities self-organized, borders were negotiated or fought over, and the result was a canvas that no individual could have designed — something that emerged from collective decision-making at massive scale.</p>
        <p>Researchers have studied the r/place datasets to understand how communities form territories, how conflicts escalate and resolve, and how cooperation emerges without central coordination. It turns out people are remarkably good at working together on a shared canvas, even strangers with no formal agreement, when the constraints are clear and the stakes feel real.</p>

        <h2>What PixelCanvas Draws From This</h2>
        <p>PixelCanvas is a different kind of collaborative canvas. Where r/place was ephemeral and contested, PixelCanvas is permanent and owned. You don't fight for your square — you buy it, and it's yours. The result is a different kind of collaboration: not the chaos of competing factions, but the quiet accumulation of individual decisions that together form something collective.</p>
        <p>Every owner of a PixelCanvas square chose their color and their link deliberately. Seen together, the canvas is a record of who decided to participate, what they chose to represent themselves with, and who they wanted to connect to. It's collaborative not through conflict but through presence.</p>

        <div className="brut-border bg-zap/30 p-5 mt-8 not-prose">
          <p className="font-bold mb-1">Place your pixel</p>
          <p className="text-sm text-muted-foreground mb-3">No timer. No conflict. Just yours — permanently.</p>
          <Link to="/canvas" className="inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm">Open the canvas →</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
