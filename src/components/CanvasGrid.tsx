import { useEffect, useMemo, useRef, useState } from "react";

const CANVAS_SIZE = 100;

export type ExtraPixel = {
  x: number;
  y: number;
  color: string;
  owner_name?: string;
  owner_url?: string | null;
  status?: "paid" | "pending";
};

type Props = {
  onSelect?: (id: number) => void;
  selected?: Set<number>;
  heatmap?: boolean;
  highlightHandle?: string | null;
  initialScale?: number;
  minimal?: boolean;
  maxScale?: number;
  minScale?: number;
  showCenterGlow?: boolean;
  extraPixels?: ExtraPixel[];
};

function isCenter(x: number, y: number) {
  return x >= 40 && x <= 59 && y >= 40 && y <= 59;
}

export function CanvasGrid({
  onSelect,
  selected,
  heatmap = false,
  highlightHandle = null,
  initialScale = 6,
  minimal = false,
  maxScale = 40,
  minScale = 2,
  showCenterGlow = true,
  extraPixels = [],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number; moved: boolean } | null>(null);
  const [hover, setHover] = useState<{ id: number; cx: number; cy: number } | null>(null);

  const pixelIndex = useMemo(() => {
    const m = new Map<number, ExtraPixel>();
    for (const p of extraPixels) m.set(p.y * CANVAS_SIZE + p.x, p);
    return m;
  }, [extraPixels]);

  const heat = useMemo(() => {
    if (!heatmap) return null;
    const h = new Float32Array(CANVAS_SIZE * CANVAS_SIZE);
    for (const p of extraPixels) {
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const x = p.x + dx, y = p.y + dy;
          if (x < 0 || y < 0 || x >= CANVAS_SIZE || y >= CANVAS_SIZE) continue;
          const d = Math.hypot(dx, dy);
          h[y * CANVAS_SIZE + x] += Math.max(0, 1 - d / 3);
        }
      }
    }
    let max = 0;
    for (const v of h) if (v > max) max = v;
    return { data: h, max };
  }, [heatmap, extraPixels]);

  // Draw base canvas
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = CANVAS_SIZE;
    c.height = CANVAS_SIZE;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (showCenterGlow) {
      const half = 10;
      const cx = CANVAS_SIZE / 2 - half;
      const cy = CANVAS_SIZE / 2 - half;
      ctx.fillStyle = "rgba(255,193,7,0.22)";
      ctx.fillRect(cx, cy, half * 2, half * 2);
      ctx.fillStyle = "rgba(255,152,0,0.18)";
      ctx.fillRect(cx + 3, cy + 3, half * 2 - 6, half * 2 - 6);
    }

    for (const p of extraPixels) {
      ctx.globalAlpha = p.status === "pending" ? 0.45 : 1;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 1, 1);
    }
    ctx.globalAlpha = 1;

    if (heat) {
      for (let i = 0; i < heat.data.length; i++) {
        const v = heat.data[i] / heat.max;
        if (v <= 0) continue;
        const x = i % CANVAS_SIZE, y = Math.floor(i / CANVAS_SIZE);
        ctx.fillStyle = `rgba(255,87,34,${v * 0.55})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [heat, showCenterGlow, extraPixels]);

  useEffect(() => {
    const o = overlayRef.current;
    if (!o) return;
    o.width = CANVAS_SIZE;
    o.height = CANVAS_SIZE;
    const ctx = o.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (selected && selected.size) {
      ctx.fillStyle = "rgba(255,235,59,0.85)";
      for (const id of selected) {
        const x = id % CANVAS_SIZE, y = Math.floor(id / CANVAS_SIZE);
        ctx.fillRect(x, y, 1, 1);
      }
    }
    if (highlightHandle) {
      const h = highlightHandle.toLowerCase();
      ctx.fillStyle = "rgba(255,87,34,0.9)";
      for (const p of extraPixels) {
        if ((p.owner_name || "").toLowerCase() === h) {
          ctx.fillRect(p.x, p.y, 1, 1);
        }
      }
    }
  }, [selected, highlightHandle, extraPixels]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = wrapRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const newScale = Math.max(minScale, Math.min(maxScale, scale * (e.deltaY < 0 ? 1.15 : 0.87)));
    const ratio = newScale / scale;
    setOrigin((o) => ({
      x: mx - (mx - o.x) * ratio,
      y: my - (my - o.y) * ratio,
    }));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrag({ x: e.clientX - origin.x, y: e.clientY - origin.y, moved: false });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (drag) {
      setOrigin({ x: e.clientX - drag.x, y: e.clientY - drag.y });
      if (!drag.moved) setDrag({ ...drag, moved: true });
      return;
    }
    const rect = wrapRef.current!.getBoundingClientRect();
    const cx = (e.clientX - rect.left - origin.x) / scale;
    const cy = (e.clientY - rect.top - origin.y) / scale;
    const x = Math.floor(cx), y = Math.floor(cy);
    if (x < 0 || y < 0 || x >= CANVAS_SIZE || y >= CANVAS_SIZE) {
      setHover(null);
      return;
    }
    setHover({ id: y * CANVAS_SIZE + x, cx: e.clientX - rect.left, cy: e.clientY - rect.top });
  };
  const handleMouseUp = () => setDrag(null);
  const handleClick = (e: React.MouseEvent) => {
    if (drag?.moved) return;
    if (!onSelect) return;
    const rect = wrapRef.current!.getBoundingClientRect();
    const cx = (e.clientX - rect.left - origin.x) / scale;
    const cy = (e.clientY - rect.top - origin.y) / scale;
    const x = Math.floor(cx), y = Math.floor(cy);
    if (x < 0 || y < 0 || x >= CANVAS_SIZE || y >= CANVAS_SIZE) return;
    onSelect(y * CANVAS_SIZE + x);
  };

  useEffect(() => {
    const w = wrapRef.current!;
    setOrigin({
      x: (w.clientWidth - CANVAS_SIZE * scale) / 2,
      y: (w.clientHeight - CANVAS_SIZE * scale) / 2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tipPixel = hover ? pixelIndex.get(hover.id) : undefined;
  const hoverX = hover ? hover.id % CANVAS_SIZE : 0;
  const hoverY = hover ? Math.floor(hover.id / CANVAS_SIZE) : 0;
  const hoverPrice = hover ? (isCenter(hoverX, hoverY) ? 5 : 1) : 1;

  return (
    <div
      ref={wrapRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { setDrag(null); setHover(null); }}
      onClick={handleClick}
      className={`relative h-full w-full overflow-hidden bg-paper select-none ${drag ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        backgroundImage:
          "linear-gradient(to right, oklch(0 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(0 0 0 / 0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        style={{
          transform: `translate(${origin.x}px, ${origin.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          imageRendering: "pixelated",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          position: "absolute",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ imageRendering: "pixelated", display: "block", width: CANVAS_SIZE, height: CANVAS_SIZE }}
        />
        <canvas
          ref={overlayRef}
          style={{
            imageRendering: "pixelated",
            position: "absolute",
            inset: 0,
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            pointerEvents: "none",
          }}
        />
      </div>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 brut-border bg-paper px-2 py-1.5 text-xs brut-shadow-sm"
          style={{ left: hover.cx + 14, top: hover.cy + 14 }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 brut-border"
              style={{ background: tipPixel?.color ?? "#ffffff" }}
            />
            <span className="font-display">({hoverX}, {hoverY})</span>
          </div>
          {tipPixel ? (
            tipPixel.status === "pending" ? (
              <div className="text-flame">Reserved — checkout in progress</div>
            ) : (
              <div className="mt-0.5">{tipPixel.owner_name}</div>
            )
          ) : (
            <div className="text-flame">Available · ${hoverPrice}</div>
          )}
        </div>
      )}

      {!minimal && extraPixels.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-3 mx-auto w-fit max-w-[90%] brut-border bg-paper px-3 py-1.5 text-center text-xs brut-shadow-sm">
          10,000 squares. None claimed yet — be the first.
        </div>
      )}

      {!minimal && (
        <div className="absolute bottom-3 left-3 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(maxScale, s * 1.25)); }}
            className="brut-border bg-paper px-2 py-1 text-xs font-bold brut-shadow-sm"
          >＋</button>
          <button
            onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(minScale, s / 1.25)); }}
            className="brut-border bg-paper px-2 py-1 text-xs font-bold brut-shadow-sm"
          >－</button>
          <div className="brut-border bg-paper px-2 py-1 text-xs">zoom {Math.round(scale)}x</div>
        </div>
      )}
    </div>
  );
}
