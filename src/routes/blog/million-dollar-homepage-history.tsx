import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog/million-dollar-homepage-history")({
  head: () => ({
    meta: [
      { title: "The Million Dollar Homepage: The Viral Idea That Changed the Internet | PixelCanvas" },
      { name: "description", content: "In 2005, a student named Alex Tew sold pixels for $1 each and made $1 million. Here's the full story and what it means for PixelCanvas in 2026." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10 prose prose-sm max-w-none">
        <Link to="/blog" className="text-sm text-flame hover:underline not-prose">← Back to Blog</Link>
        <h1 className="font-display text-4xl mt-4 mb-2">The Million Dollar Homepage: The Viral Idea That Changed the Internet</h1>
        <p className="text-sm text-muted-foreground mb-8">June 2026 · 7 min read</p>

        <p>In August 2005, a 21-year-old student from Wiltshire, England named Alex Tew was lying in bed thinking about how to pay for his university education without taking on crippling debt. What happened next is one of the most unexpected success stories in internet history — and it created a template for participatory web projects that still resonates two decades later.</p>

        <p>The idea Tew had was absurdly simple: create a webpage with exactly one million pixels, and sell each pixel for one dollar. A 1000×1000 grid. Buyers could fill their purchased pixels with an image and a link. The math was obvious: sell all the pixels, make one million dollars. Whether anyone would actually participate was an entirely different question.</p>

        <h2>Building and Launching</h2>
        <p>Tew taught himself basic HTML and CSS, registered milliondollarhomepage.com, and launched the site. The minimum purchase was a 10×10 block of pixels for $100 — small enough to be accessible, large enough to actually display a recognizable image or logo. He wrote a press release explaining the concept and emailed it to journalists.</p>
        <p>The first sales came from family. Then friends. Then people who heard about it through word of mouth. The early sales were enough to generate a small online following, which caught the attention of a few blogs. Those blog posts caught the attention of larger media outlets. Within weeks, the BBC, CNN, Reuters, and dozens of technology publications had covered the story.</p>
        <p>The coverage created a self-reinforcing loop. Each article brought more visitors to the site, which brought more buyers, which made the page more interesting to look at, which generated more coverage. The page was simultaneously a business and a piece of performance art — you were watching, in real time, whether a completely absurd idea could actually work.</p>

        <h2>The Final Pixels and the Auction</h2>
        <p>By December 2005, all but the last 1,000 pixels had sold. Tew auctioned them off on eBay. The auction attracted frenzied bidding — not primarily because the pixels had intrinsic value, but because being the buyer of the very last pixels on the Million Dollar Homepage had a kind of historical significance. The auction closed at $38,100 for the final block, bringing Tew's total to $1,037,100. He paid off his university costs and had a significant amount left over.</p>

        <h2>Why It Worked: The Psychology of Novelty and FOMO</h2>
        <p>The Million Dollar Homepage succeeded for reasons that are now well-understood in marketing and behavioral economics, but were less clearly articulated at the time. The project created genuine scarcity: there were exactly one million pixels and no more would ever be created. It created social proof: as more brands and individuals bought pixels, each new potential buyer could see that other people were taking it seriously. And it created FOMO at scale — if the page actually sold out, you'd be permanently excluded from something historically significant.</p>
        <p>The price point was also calibrated brilliantly. $100 minimum was accessible to small businesses and individuals but not so cheap that it felt trivial. Brands who bought larger blocks were making a visible, permanent advertising commitment. The combination of low entry price and potential for viral visibility made the ROI calculation easy for small buyers to justify.</p>

        <h2>What It Proved About the Internet</h2>
        <p>Beyond Tew's personal success, the Million Dollar Homepage demonstrated something important about human behavior online: people have a genuine desire to own a visible, permanent piece of something shared on the internet. Not just to consume content, but to participate in creating something collectively. This desire existed long before blockchain or NFTs gave it a name.</p>
        <p>The project also proved that novelty itself has value online. The idea didn't need to be profound — it needed to be interesting enough to share. In the attention economy, the ability to capture and hold attention is worth exactly what someone is willing to pay for it.</p>

        <h2>The Imitators and Why None Matched It</h2>
        <p>The Million Dollar Homepage spawned hundreds of imitators within months of its launch. Million Pixel websites, Million Euro Homepages, themed variations — none achieved the same cultural moment. This is the paradox of novelty: the value is in being first. The second person to sell pixels online was selling something entirely different from what Tew was selling, because Tew's product included the genuine uncertainty of whether it would work.</p>

        <h2>PixelCanvas in 2026</h2>
        <p>PixelCanvas is built on the same foundational insight — that people want to own a permanent, visible piece of something shared — but with two decades of better infrastructure and a clearer understanding of what makes these projects work long-term. Stripe instead of PayPal. A live interactive canvas instead of a static image. Owner profiles, a leaderboard, customizable colors, and direct links. The pixel you buy at PixelCanvas is yours: visible to every visitor, permanent as long as the platform exists, and connected to whatever you want the world to find.</p>

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
