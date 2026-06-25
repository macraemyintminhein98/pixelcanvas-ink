import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | PixelCanvas.ink" },
      { name: "description", content: "Get in touch with the PixelCanvas team. Report issues, ask questions, or request a refund." },
    ],
    links: [{ rel: "canonical", href: "https://www.pixelcanvas.ink/contact" }],
  }),
  component: Page,
});

function Page() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        <h1 className="font-display text-4xl">Contact Us</h1>
        <p className="text-muted-foreground">
          Questions about your pixel, a payment issue, or just want to say hello? Fill out the form below and we'll get back to you within 1–2 business days.
        </p>

        {submitted ? (
          <div className="brut-border bg-zap/30 p-8 text-center space-y-3">
            <div className="text-4xl">✅</div>
            <h2 className="font-display text-2xl">Message received!</h2>
            <p className="text-sm">We'll reply to <strong>{form.email}</strong> within 1–2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="name">Your Name</label>
              <input
                id="name" type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full brut-border bg-paper px-3 py-2 text-sm focus:outline-none"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="email">Email Address</label>
              <input
                id="email" type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full brut-border bg-paper px-3 py-2 text-sm focus:outline-none"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="message">Message</label>
              <textarea
                id="message" required rows={5} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full brut-border bg-paper px-3 py-2 text-sm focus:outline-none resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <button type="submit" className="brut-border bg-flame px-6 py-2 font-display text-sm uppercase text-paper brut-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
              Send Message
            </button>
          </form>
        )}

        <div className="border-t pt-6 text-sm space-y-1 text-muted-foreground">
          <p><strong>Email:</strong> <a href="mailto:contact@pixelcanvas.ink" className="underline text-flame">contact@pixelcanvas.ink</a></p>
          <p><strong>Response time:</strong> 1–2 business days</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
