import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog/how-to-design-your-pixel")({
  head: () => ({
    meta: [
      { title: "How to Design Your PixelCanvas Square | PixelCanvas Blog" },
      { name: "description", content: "Your 1×1 square is tiny but visible to every visitor. Color theory and design principles for making your pixel count." },
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
        <h1 className="font-display text-4xl mt-4 mb-2">How to Design Your PixelCanvas Square for Maximum Impact</h1>
        <p className="text-sm text-muted-foreground mb-8">June 2026 · 4 min read</p>

        <p>A single square on PixelCanvas is 1×1 unit on a 100×100 grid. Zoomed out, it's tiny. Zoomed in, it's yours entirely. Here's how to make the most of it — whether you're marking personal territory, representing a brand, or just adding to the collective artwork.</p>

        <h2>Color is Everything at Small Sizes</h2>
        <p>At the scale of a single pixel, you can't communicate much through shape — your square is a square. Color is your primary tool. A few principles:</p>
        <ul>
          <li><strong>Saturated colors read clearly.</strong> Muted, desaturated colors tend to disappear against neighboring squares, especially when many different colors surround them. Pure, saturated hues — vivid red, electric blue, bright yellow — stand out.</li>
          <li><strong>High contrast with neighbors matters.</strong> If you want your square to be visible, look at what surrounds your chosen location and pick a color that contrasts with it. A bright orange next to dark blues will pop. The same orange next to yellows will blend.</li>
          <li><strong>Consider the overall canvas.</strong> If you want your square to be distinctive, look at the full canvas view first. Identify which colors are overrepresented and consider something less common.</li>
        </ul>

        <h2>Choosing Your Location</h2>
        <p>Location affects visibility independent of color. Center tiles are the most viewed — they're expensive at $5 because they're genuinely more prominent. Edge tiles are cheaper but less frequently seen in the standard viewport.</p>
        <p>Clustering with other squares of similar color creates a visible patch rather than an isolated pixel — if you're buying multiple squares or coordinating with others, adjacency creates more visual impact than scattered placement.</p>

        <h2>Your Link and Name</h2>
        <p>Every square shows a name and optional link when a visitor hovers or clicks it. This is where you communicate who you are. Keep the name short — the hover tooltip has limited space and long names get cut off on mobile. Your link should go somewhere that makes sense in context: your website, your portfolio, your company, your social profile.</p>
        <p>Think about what you want someone who's curious enough to click on your pixel to find. A dead link or a homepage that doesn't match what your pixel name suggests is a missed opportunity.</p>

        <h2>Uploading an Image</h2>
        <p>Premium tiles support uploading a tiny image that displays inside the square. This image should be simple — at the resolution it's displayed, fine detail is lost. A single letter, a simple logo, a face in silhouette, or a bold symbol will read more clearly than a photograph or a complex illustration.</p>
        <p>Think of it as favicon design: what single visual element best represents you or your brand at 32×32 pixels?</p>

        <h2>It's Permanent — Choose Thoughtfully</h2>
        <p>Unlike social media posts that disappear from feeds, your pixel is permanent. Choose a color and link you'll be happy with in five years. A personal website URL is safer than a social handle that might change. A brand color is more timeless than a trending shade.</p>

        <div className="brut-border bg-zap/30 p-5 mt-8 not-prose">
          <p className="font-bold mb-1">Ready to claim yours?</p>
          <p className="text-sm text-muted-foreground mb-3">Browse available squares and pick your location.</p>
          <Link to="/canvas" className="inline-block brut-border bg-flame px-4 py-2 font-display text-sm uppercase text-paper brut-shadow-sm">Open the canvas →</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
