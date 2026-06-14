import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

async function handlePixelCheckoutCompleted(session: any) {
  const md = session.metadata || {};
  if (md.kind !== "pixel_purchase") return;

  const x = Number(md.x);
  const y = Number(md.y);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return;

  const supabase = getSupabase();
  const { error } = await (supabase.from("pixels") as any).upsert(
    {
      x,
      y,
      color: md.color || "#ff5722",
      image_url: md.image_url || null,
      owner_name: md.owner_name || "Anonymous",
      owner_url: md.owner_url || null,
      stripe_session_id: session.id,
      status: "paid",
      pending_until: null,
    },
    { onConflict: "x,y" },
  );
  if (error) console.error("Pixel insert error:", error);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
    case "transaction.completed":
      await handlePixelCheckoutCompleted(event.data.object);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
