import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Canvas Stake" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "magic" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/canvas" });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/canvas" });
      } else if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/canvas` },
        });
        if (error) throw error;
        setMsg({ type: "success", text: "Check your email for the magic link." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/canvas`,
            data: { handle: handle.trim() || null },
          },
        });
        if (error) throw error;
        setMsg({ type: "success", text: "Account created. Check your email to confirm, then sign in." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/canvas`,
    });
    if (result?.error) {
      setMsg({ type: "error", text: result.error.message || "Google sign-in failed" });
      return;
    }
    if (!result?.redirected) navigate({ to: "/canvas" });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="mx-auto grid max-w-4xl gap-4 px-4 py-12 md:grid-cols-2">
        <div className="brut-border bg-zap p-8 brut-shadow">
          <div className="font-display text-xs uppercase">Stake your claim</div>
          <h1 className="mt-2 font-display text-4xl">Sign in to Canvas Stake.</h1>
          <p className="mt-3 text-sm">One account. All your squares. Customize, refer friends, earn credits.</p>
        </div>
        <div className="brut-border bg-paper p-6 brut-shadow-sm">
          <div className="flex gap-2 text-xs font-bold uppercase">
            {[
              ["signin", "Sign in"],
              ["magic", "Magic link"],
              ["signup", "Create account"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => { setMode(k as any); setMsg(null); }}
                className={`brut-border px-2 py-1 ${mode === k ? "bg-ink text-paper" : "bg-paper"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full brut-border bg-paper px-3 py-2 text-sm outline-none"
            />
            {mode !== "magic" && (
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className="w-full brut-border bg-paper px-3 py-2 text-sm outline-none"
              />
            )}
            {mode === "signup" && (
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Pick a handle (optional)"
                maxLength={40}
                className="w-full brut-border bg-paper px-3 py-2 text-sm outline-none"
              />
            )}
            {msg && (
              <div
                className={`brut-border px-3 py-2 text-xs ${
                  msg.type === "error" ? "bg-flame/20 text-flame" : "bg-zap/40"
                }`}
              >
                {msg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full brut-border bg-flame px-3 py-2 font-display text-sm uppercase text-paper brut-shadow-sm disabled:opacity-50"
            >
              {loading ? "Working…" : mode === "signin" ? "Sign in" : mode === "magic" ? "Send magic link" : "Create my account"}
            </button>
          </form>
          <div className="my-3 flex items-center gap-2 text-[10px] uppercase opacity-50">
            <div className="h-px flex-1 bg-ink/30" /> or <div className="h-px flex-1 bg-ink/30" />
          </div>
          <button
            onClick={handleGoogle}
            className="w-full brut-border bg-paper px-3 py-2 font-display text-xs uppercase brut-shadow-sm"
          >
            Continue with Google
          </button>
          <Link to="/canvas" className="mt-3 block text-center text-xs underline">
            Skip & explore the canvas →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
