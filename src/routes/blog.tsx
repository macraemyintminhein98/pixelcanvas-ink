import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | PixelCanvas.ink — Pixel Art, Digital Ownership & Internet History" },
      { name: "description", content: "Stories, guides, and ideas about pixel art, collaborative internet projects, digital ownership, and the history of the web." },
    ],
    links: [{ rel: "canonical", href: "https://www.pixelcanvas.ink/blog" }],
  }),
  component: Page,
});

const articles = [
  { slug: "million-dollar-homepage-history", title: "The Million Dollar Homepage: The Viral Idea That Changed the Internet", excerpt: "In 2005, a student named Alex Tew sold pixels for $1 each and made $1 million. Here's the full story and why it still matters.", date: "June 2026", readTime: "6 min" },
  { slug: "pixel-art-history", title: "A Brief History of Pixel Art: From 8-Bit to Modern Masterpieces", excerpt: "Pixel art started as a technical constraint and became an art form. Trace its evolution from early video games to today's deliberate aesthetic.", date: "June 2026", readTime: "5 min" },
  { slug: "collaborative-internet-art", title: "r/place and the Power of Collaborative Internet Art", excerpt: "Reddit's r/place experiments revealed something remarkable: millions of strangers can cooperate to create art. What does that tell us?", date: "June 2026", readTime: "7 min" },
  { slug: "digital-ownership-nfts-pixels", title: "Digital Ownership Without NFTs: A Simpler Model", excerpt: "NFTs promised digital ownership but delivered complexity. There's a simpler, more honest way to own something online permanently.", date: "June 2026", readTime: "5 min" },
  { slug: "how-to-design-your-pixel", title: "How to Design Your PixelCanvas Square for Maximum Impact", excerpt: "Your 1×1 square is tiny — but visible to every visitor. Here's how to make your pixel count with color theory and design principles.", date: "June 2026", readTime: "4 min" },
];

function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">Stories, guides, and ideas about pixel art, digital ownership, and the internet.</p>
        <div className="space-y-8">
          {articles.map(a => (
            <article key={a.slug} className="border-b border-ink/10 pb-8">
              <Link to={`/blog/${a.slug}`} className="group">
                <h2 className="font-display text-xl group-hover:text-flame transition mb-2">{a.title}</h2>
              </Link>
              <p className="text-sm text-muted-foreground mb-3">{a.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{a.date}</span><span>·</span><span>{a.readTime} read</span><span>·</span>
                <Link to={`/blog/${a.slug}`} className="text-flame hover:underline">Read →</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
