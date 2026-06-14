import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/legal")({
  head: () => ({ meta: [{ title: "Legal — Canvas Stake" }] }),
  component: LegalPage,
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="brut-border bg-paper p-6">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 space-y-2 text-sm opacity-80">{children}</div>
    </section>
  );
}

function LegalPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
        <div className="font-display text-xs uppercase opacity-60">Trust & compliance</div>
        <h1 className="font-display text-4xl">The rules of the canvas.</h1>

        <Section id="terms" title="Terms of service">
          <p>Canvas Stake offers participation in a public digital artwork. A purchased square grants you a non-exclusive, revocable license to display custom content on a specific tile, subject to moderation. You do not acquire copyright in the overall artwork, nor any security or financial instrument.</p>
          <p>We may pause, relocate, or end the project. We will give you 30 days notice and refund any unmoderated squares at full price.</p>
        </Section>

        <Section id="privacy" title="Privacy">
          <p>We store your email, handle, hashed password, owned squares, referral code, and basic payment metadata. We never sell your data. Logs are kept for 90 days. You can request export or deletion at any time.</p>
        </Section>

        <Section id="rules" title="Community rules">
          <p>No hate speech, slurs, harassment, sexual content, doxxing, impersonation, copyrighted logos, or links to malicious content. All custom content (color, text, stamp) is reviewed. Repeat offenders lose their squares with no refund.</p>
        </Section>

        <Section id="refund" title="Refund policy">
          <p>Full refund within 24 hours of purchase if the square has not been customized and approved. Premium upgrades are refundable within the same window. After moderation approval, sales are final.</p>
        </Section>

        <Section id="positioning" title="What this is (and isn’t)">
          <p>Canvas Stake is a digital collectible and public art participation experience. It is <strong>not</strong> an NFT, not a token, not a security, not an investment product. There is no secondary market or transfer mechanism in v1. Owning a square does not transfer copyright in any logo, name, or third-party content.</p>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
