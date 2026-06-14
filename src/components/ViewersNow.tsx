import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ViewersNow() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel("presence:site", {
      config: { presence: { key: id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: Date.now() });
        }
      });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-2 brut-border bg-paper px-3 py-1.5 text-xs font-bold uppercase brut-shadow-sm">
      <span>🔥</span>
      <span className="font-display">{count}</span>
      <span>{count === 1 ? "person viewing right now" : "people viewing right now"}</span>
    </div>
  );
}
