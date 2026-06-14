import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | PixelCanvas.ink" },
      { name: "description", content: "PixelCanvas.ink privacy policy. Learn how we handle your data, Google AdSense cookies, Stripe payments, and your CCPA/GDPR rights." },
    ],
    links: [{ rel: "canonical", href: "https://www.pixelcanvas.ink/privacy-policy" }],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-10 space-y-4">
        <h1 className="font-display text-4xl">Privacy Policy</h1>
        <p className="text-sm opacity-70">Last updated: June 2026</p>

        <section className="brut-border bg-paper p-6 space-y-4 text-sm">
          <div>
            <h2 className="font-display text-2xl">1. Data We Collect</h2>
            <p>When you create an account, we collect your email address (and name if you sign in via Google). We store the pixels you claim, your customizations (color, name, link, image), and basic payment metadata from Stripe (customer ID, payment status — never card numbers).</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">2. Google Sign-In</h2>
            <p>If you use Google sign-in, we receive only your email and basic profile for authentication. We do not access your Drive, contacts, calendar, or any other Google service.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">3. Payments (Stripe)</h2>
            <p>Pixel purchases are processed by Stripe. We never see or store your card details. Stripe's privacy policy: <a className="underline" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">4. Advertising — Google AdSense</h2>
            <p>Signed-out visitors and free users see ads served by Google AdSense. Google and its partners use cookies to serve ads based on your prior visits to this and other sites. You can opt out of personalized advertising at <a className="underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">google.com/settings/ads</a>. Purchasing any pixel removes ads for your account.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">5. Analytics</h2>
            <p>We may use lightweight, privacy-friendly analytics to understand aggregate usage. No personally identifying information is shared with analytics providers.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">6. Your Rights (CCPA & GDPR)</h2>
            <p>You can delete your account at any time from your account settings. Deleting your account removes your account record and associated data. California and EU/UK residents have additional rights including access, correction, portability, and deletion. Email us to exercise these rights.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">7. Data Retention</h2>
            <p>We keep your data as long as your account is active. Deleted accounts are permanently removed.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">8. Children</h2>
            <p>PixelCanvas.ink is not directed to children under 13 and we do not knowingly collect data from them.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl">9. Contact</h2>
            <p>Privacy questions: <a className="underline" href="mailto:macrae.xmyint@gmail.com">macrae.xmyint@gmail.com</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
