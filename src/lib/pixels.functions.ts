import { supabase } from "@/integrations/supabase/client";

const CENTER_MIN = 40;
const CENTER_MAX = 59;
const TOTAL_SQUARES = 100 * 100;

export function isCenter(x: number, y: number) {
  return x >= CENTER_MIN && x <= CENTER_MAX && y >= CENTER_MIN && y <= CENTER_MAX;
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

export const listPixels = async (): Promise<{ pixels: PublicPixel[] }> => {
  const nowIso = new Date().toISOString();
  const { data, error } = await (supabase.from("pixels") as any)
    .select("x,y,color,image_url,owner_name,owner_url,purchased_at,status,pending_until")
    .or(`status.eq.paid,and(status.eq.pending,pending_until.gt.${nowIso})`)
    .limit(10000);
  if (error) throw new Error("Unable to load canvas.");
  return { pixels: (data ?? []) as PublicPixel[] };
};

export const getCanvasStats = async (): Promise<{ sold: number; total: number; revenue: number; buyers: number }> => {
  const { data, error } = await (supabase.from("pixels") as any)
    .select("x,y,owner_name")
    .eq("status", "paid");
  if (error) return { sold: 0, total: TOTAL_SQUARES, revenue: 0, buyers: 0 };
  const rows = (data ?? []) as Array<{ x: number; y: number; owner_name: string }>;
  let revenue = 0;
  const buyers = new Set<string>();
  for (const r of rows) {
    revenue += isCenter(r.x, r.y) ? 5 : 1;
    if (r.owner_name) buyers.add(r.owner_name.toLowerCase());
  }
  return { sold: rows.length, total: TOTAL_SQUARES, revenue, buyers: buyers.size };
};

export const getRecentClaims = async (opts?: { data?: { limit?: number } }): Promise<{ claims: any[] }> => {
  const limit = opts?.data?.limit ?? 12;
  const { data, error } = await (supabase.from("pixels") as any)
    .select("x,y,color,owner_name,owner_url,purchased_at")
    .eq("status", "paid")
    .order("purchased_at", { ascending: false })
    .limit(limit);
  if (error) return { claims: [] };
  return { claims: data ?? [] };
};

export const getLeaderboard = async (): Promise<{ owners: any[] }> => {
  const { data, error } = await (supabase.from("pixels") as any)
    .select("x,y,owner_name,owner_url,purchased_at")
    .eq("status", "paid")
    .limit(10000);
  if (error) return { owners: [] };
  const map = new Map<string, any>();
  for (const r of (data ?? []) as Array<any>) {
    const key = (r.owner_name || "Anonymous").toLowerCase();
    const price = isCenter(r.x, r.y) ? 5 : 1;
    const cur = map.get(key);
    if (cur) { cur.count += 1; cur.spent += price; if (r.purchased_at < cur.first) cur.first = r.purchased_at; }
    else map.set(key, { owner_name: r.owner_name || "Anonymous", owner_url: r.owner_url || null, count: 1, spent: price, first: r.purchased_at });
  }
  return { owners: [...map.values()].sort((a, b) => b.count - a.count) };
};

export const getOwnerProfile = async (opts: { data: { handle: string } }): Promise<{ owner: any }> => {
  const { data, error } = await (supabase.from("pixels") as any)
    .select("x,y,color,image_url,owner_name,owner_url,purchased_at")
    .eq("status", "paid")
    .ilike("owner_name", opts.data.handle)
    .limit(10000);
  if (error || !data?.length) return { owner: null };
  const first = data.reduce((acc: string, r: any) => (r.purchased_at < acc ? r.purchased_at : acc), data[0].purchased_at);
  return { owner: { owner_name: data[0].owner_name, owner_url: data.find((r: any) => r.owner_url)?.owner_url || null, first_claim: first, squares: data } };
};

export const createPixelCheckout = async (_: any): Promise<{ clientSecret: string }> => {
  throw new Error("Pixel purchases require server setup.");
};
