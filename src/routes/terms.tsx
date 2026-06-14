import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | PixelCanvas.ink" },
      { name: "description", content: "PixelCanvas.ink terms of service. Pixel purchase rules, content guidelines, refund policy, and governing law." },
    ],
    links: [{ rel: "canonical", href: "https://www.pixelcanvas.ink/terms" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10 space-y-4">
        <h1 className="font-display text-4xl">Terms of Service</h1>
        <p className="text-sm opacity-70">Last updated: June 2026</p>

        <section className="brut-border bg-paper p-6 space-y-4 text-sm">
          <div>
            <h2 className="font-display text-2xl">1. Pixel Purchases</h2>
            <p>All pixel purchases are final. Once claimed, a pixel is yours permanently and will remain displayed on the public canvas. You have 24 hours to request a refund if the pixel has not been customized.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">2. Content Rules</h2>
            <p>You may customize your pixel with a color, name, optional link, and optional image. Prohibited content includes: hate speech, harassment, sexually explicit material, doxxing, impersonation, malware links, or content infringing on others' intellectual property rights. AI-generated content is allowed only if it complies with these rules and you hold rights to publish it. Violations result in removal without refund.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">3. License</h2>
            <p>By purchasing a pixel, you grant PixelCanvas.ink a perpetual, non-exclusive license to display your customization as part of the public canvas artwork.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">4. Not a Security or NFT</h2>
            <p>PixelCanvas.ink is a digital collectible and public art participation project. It is not a security, token, investment, or NFT. No blockchain is involved.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">5. No Transferability</h2>
            <p>Pixels are tied to your account in v1 and are not resellable or transferable.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">6. No Warranty</h2>
            <p>PixelCanvas.ink is provided "as is" without warranties of any kind. To the maximum extent permitted by law, our liability is limited to the amount you paid us.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">7. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Washington, USA. Disputes will be resolved in state or federal courts in King County, Washington.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">8. Changes</h2>
            <p>We may update these Terms. Material changes will be announced on the site or via email.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">9. Contact</h2>
            <p>Questions: <a className="underline" href="mailto:macrae.xmyint@gmail.com">macrae.xmyint@gmail.com</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
