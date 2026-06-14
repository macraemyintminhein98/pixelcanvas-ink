import { useEffect, useState } from "react";
import { getRecentClaims } from "@/lib/pixels.functions";

type Claim = {
  x: number;
  y: number;
  color: string;
  owner_name: string;
  owner_url: string | null;
  purchased_at: string;
};

export function LiveTicker() {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await getRecentClaims({ data: { limit: 30 } });
        if (alive) setClaims((r?.claims as Claim[]) ?? []);
      } catch (e) {
        console.error("getRecentClaims failed", e);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (claims.length === 0) return null;

  const row = [...claims, ...claims];
  return (
    <div className="brut-border border-x-0 overflow-hidden bg-ink py-2 text-paper">
      <div className="ticker flex gap-6 whitespace-nowrap text-sm">
        {row.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-flame" />
            <span
              className="inline-block h-3 w-3 brut-border"
              style={{ background: c.color, borderColor: "var(--color-paper)" }}
            />
            <span className="font-display tracking-wide">{c.owner_name}</span>
            <span className="opacity-70">claimed ({c.x},{c.y})</span>
            <span className="text-zap">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
