import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

const CENTER_MIN = 40;
const CENTER_MAX = 59;
const RESERVATION_MINUTES = 10;
const TOTAL_SQUARES = 100 * 100;

function isCenter(x: number, y: number) {
  return x >= CENTER_MIN && x <= CENTER_MAX && y >= CENTER_MIN && y <= CENTER_MAX;
}

function getAdminSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export type PublicPixel = {
  x: number;
  y: number;
  color: string;
  image_url: string | null;
  owner_name: string;
  owner_url: string | null;
  purchased_at: string;
  status: "paid" | "pending";
};

export const listPixels = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getAdminSupabase();
  const nowIso = new Date().toISOString();
  // Return both paid pixels and active pending reservations so the canvas
  // can mark in-flight squares as unavailable.
  const { data, error } = await (supabase
    .from("pixels") as any)
    .select("x,y,color,image_url,owner_name,owner_url,purchased_at,status,pending_until")
    .or(`status.eq.paid,and(status.eq.pending,pending_until.gt.${nowIso})`)
    .limit(10000);
  if (error) {
    console.error("[listPixels] db error:", error.message);
    throw new Error("Unable to load canvas. Please try again.");
  }
  return { pixels: (data ?? []) as PublicPixel[] };
});

export const getCanvasStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getAdminSupabase();
  const { data, error } = await (supabase
    .from("pixels") as any)
    .select("x,y,owner_name,purchased_at")
    .eq("status", "paid");
  if (error) {
    console.error("[getCanvasStats] db error:", error.message);
    return { sold: 0, total: TOTAL_SQUARES, revenue: 0, buyers: 0 };
  }
  const rows = (data ?? []) as Array<{ x: number; y: number; owner_name: string }>;
  let revenue = 0;
  const buyers = new Set<string>();
  for (const r of rows) {
    revenue += isCenter(r.x, r.y) ? 5 : 1;
    if (r.owner_name) buyers.add(r.owner_name.toLowerCase());
  }
  return { sold: rows.length, total: TOTAL_SQUARES, revenue, buyers: buyers.size };
});

export const getRecentClaims = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ limit: z.number().int().min(1).max(50).default(12) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const supabase = getAdminSupabase();
    const { data: rows, error } = await (supabase
      .from("pixels") as any)
      .select("x,y,color,owner_name,owner_url,purchased_at")
      .eq("status", "paid")
      .order("purchased_at", { ascending: false })
      .limit(data.limit);
    if (error) {
      console.error("[getRecentClaims] db error:", error.message);
      return { claims: [] };
    }
    return { claims: rows ?? [] };
  });

export const getLeaderboard = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getAdminSupabase();
  const { data, error } = await (supabase
    .from("pixels") as any)
    .select("x,y,owner_name,owner_url,purchased_at")
    .eq("status", "paid")
    .limit(10000);
  if (error) {
    console.error("[getLeaderboard] db error:", error.message);
    return { owners: [] };
  }
  const map = new Map<
    string,
    { owner_name: string; owner_url: string | null; count: number; spent: number; first: string }
  >();
  for (const r of (data ?? []) as Array<any>) {
    const key = (r.owner_name || "Anonymous").toLowerCase();
    const price = isCenter(r.x, r.y) ? 5 : 1;
    const cur = map.get(key);
    if (cur) {
      cur.count += 1;
      cur.spent += price;
      if (r.purchased_at < cur.first) cur.first = r.purchased_at;
    } else {
      map.set(key, {
        owner_name: r.owner_name || "Anonymous",
        owner_url: r.owner_url || null,
        count: 1,
        spent: price,
        first: r.purchased_at,
      });
    }
  }
  const owners = [...map.values()].sort((a, b) => b.count - a.count);
  return { owners };
});

export const getOwnerProfile = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ handle: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = getAdminSupabase();
    const { data: rows, error } = await (supabase
      .from("pixels") as any)
      .select("x,y,color,image_url,owner_name,owner_url,purchased_at")
      .eq("status", "paid")
      .ilike("owner_name", data.handle)
      .limit(10000);
    if (error) {
      console.error("[getOwnerProfile] db error:", error.message);
      return { owner: null };
    }
    if (!rows || rows.length === 0) return { owner: null };
    const owner_name = rows[0].owner_name;
    const owner_url = rows.find((r: any) => r.owner_url)?.owner_url || null;
    const first = rows.reduce((acc: string, r: any) => (r.purchased_at < acc ? r.purchased_at : acc), rows[0].purchased_at);
    return {
      owner: {
        owner_name,
        owner_url,
        first_claim: first,
        squares: rows,
      },
    };
  });

const httpUrl = (max: number) =>
  z
    .string()
    .trim()
    .url()
    .max(max)
    .refine((u) => /^https?:\/\//i.test(u), "URL must use http or https");

const CheckoutInput = z.object({
  x: z.number().int().min(0).max(99),
  y: z.number().int().min(0).max(99),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  owner_name: z.string().trim().min(1).max(60),
  owner_url: httpUrl(300).optional().or(z.literal("")),
  image_url: httpUrl(500).optional().or(z.literal("")),
  return_url: httpUrl(2000),
  environment: z.enum(["sandbox", "live"]),
});

export const createPixelCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CheckoutInput.parse(input))
  .handler(async ({ data }) => {
    const supabase = getAdminSupabase();

    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const requestOrigin = request ? new URL(request.url).origin : null;
    let parsedReturn: URL;
    try {
      parsedReturn = new URL(data.return_url);
    } catch {
      throw new Error("Invalid return URL");
    }
    if (!requestOrigin || parsedReturn.origin !== requestOrigin) {
      throw new Error("Invalid return URL");
    }

    // Check current state
    const { data: existing } = await (supabase
      .from("pixels") as any)
      .select("id,status,pending_until")
      .eq("x", data.x)
      .eq("y", data.y)
      .maybeSingle();

    const now = Date.now();
    if (existing) {
      if (existing.status === "paid") {
        throw new Error("That square was just taken — pick another.");
      }
      if (
        existing.status === "pending" &&
        existing.pending_until &&
        new Date(existing.pending_until).getTime() > now
      ) {
        throw new Error("That square is being claimed right now — try again in a few minutes or pick another.");
      }
    }

    // Reserve atomically BEFORE creating the Stripe session.
    // The unique index on (x,y) makes concurrent inserts safe — only one wins.
    const pendingUntil = new Date(now + RESERVATION_MINUTES * 60 * 1000).toISOString();
    const reservationRow = {
      x: data.x,
      y: data.y,
      color: data.color,
      image_url: data.image_url || null,
      owner_name: data.owner_name,
      owner_url: data.owner_url || null,
      stripe_session_id: null as string | null,
      status: "pending",
      pending_until: pendingUntil,
    };

    let reservedId: string | null = null;
    if (existing) {
      // Stale pending — take it over by id, but only if it's still stale.
      const { data: updated, error: updErr } = await (supabase.from("pixels") as any)
        .update(reservationRow)
        .eq("id", existing.id)
        .neq("status", "paid")
        .or(`pending_until.is.null,pending_until.lt.${new Date(now).toISOString()}`)
        .select("id")
        .maybeSingle();
      if (updErr || !updated) {
        throw new Error("That square was just taken — pick another.");
      }
      reservedId = updated.id;
    } else {
      const { data: inserted, error: insErr } = await (supabase.from("pixels") as any)
        .insert(reservationRow)
        .select("id")
        .single();
      if (insErr || !inserted) {
        // Most likely unique-constraint violation from a concurrent caller
        throw new Error("That square was just taken — pick another.");
      }
      reservedId = inserted.id;
    }

    const env: StripeEnv = data.environment;
    const stripe = createStripeClient(env);

    const center = isCenter(data.x, data.y);
    const priceLookupKey = center ? "pixel_center_price" : "pixel_regular_price";
    const amountLabel = center ? "Center Pixel" : "Pixel";

    try {
      const prices = await stripe.prices.list({ lookup_keys: [priceLookupKey] });
      if (!prices.data.length) throw new Error("Checkout is temporarily unavailable.");
      const price = prices.data[0];

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.return_url,
        payment_intent_data: {
          description: `${amountLabel} (${data.x},${data.y})`,
        },
        metadata: {
          kind: "pixel_purchase",
          x: String(data.x),
          y: String(data.y),
          color: data.color,
          owner_name: data.owner_name,
          owner_url: data.owner_url ?? "",
          image_url: data.image_url ?? "",
        },
      });

      // Record session id on the reservation so the webhook can correlate.
      await (supabase.from("pixels") as any)
        .update({ stripe_session_id: session.id })
        .eq("id", reservedId)
        .eq("status", "pending");

      return { clientSecret: session.client_secret };
    } catch (err) {
      // Release the reservation so the square doesn't sit locked.
      await (supabase.from("pixels") as any)
        .delete()
        .eq("id", reservedId)
        .eq("status", "pending");
      throw err;
    }
  });
