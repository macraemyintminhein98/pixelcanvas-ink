type Props = {
  ownedCount: number;
  totalCount?: number;
};

export function CanvasLegend({ ownedCount, totalCount = 10000 }: Props) {
  const available = Math.max(0, totalCount - ownedCount);
  const pct = Math.round((ownedCount / totalCount) * 100);
  return (
    <div className="brut-border bg-paper p-3 brut-shadow-sm">
      <div className="font-display text-xs uppercase opacity-60">Legend</div>
      <div className="mt-2 grid gap-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 brut-border" style={{ background: "#ff5722" }} />
          Owned · {ownedCount.toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 brut-border bg-paper" />
          Available · {available.toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 brut-border" style={{ background: "rgba(255,193,7,0.55)" }} />
          Center zone · $5 each
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full brut-border bg-paper">
        <div className="h-full bg-flame" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[10px] opacity-60">{pct}% claimed</div>
    </div>
  );
}
