import { useMemo, useRef, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createPixelCheckout } from "@/lib/pixels.functions";
import { uploadPixelImage } from "@/lib/uploads.functions";

type Props = {
  x: number;
  y: number;
  onClose: () => void;
};

const PALETTE = [
  "#ff5722", "#ffeb3b", "#0a0a0a", "#ffffff", "#22d3ee", "#a855f7",
  "#10b981", "#f43f5e", "#3b82f6", "#84cc16", "#f97316", "#ec4899",
];

function isCenter(x: number, y: number) {
  return x >= 40 && x <= 59 && y >= 40 && y <= 59;
}

export function PixelPurchaseModal({ x, y, onClose }: Props) {
  const [step, setStep] = useState<"form" | "pay">("form");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#ff5722");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB");
      return;
    }
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
      setError("Image must be PNG, JPEG, WEBP, or GIF");
      return;
    }
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      // Convert to base64 in chunks to avoid call-stack issues on large files
      const bytes = new Uint8Array(buf);
      let bin = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
      }
      const dataBase64 = btoa(bin);
      const { url } = await uploadPixelImage({
        data: {
          x,
          y,
          contentType: file.type as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
          dataBase64,
        },
      });
      setImageUrl(url);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const center = isCenter(x, y);
  const price = center ? 5 : 1;

  const fetchClientSecret = useMemo(
    () => async () => {
      if (clientSecret) return clientSecret;
      const res = await createPixelCheckout({
        data: {
          x,
          y,
          color,
          owner_name: name.trim(),
          owner_url: url.trim(),
          image_url: imageUrl.trim(),
          return_url: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&x=${x}&y=${y}`,
          environment: getStripeEnvironment(),
        },
      });
      if (!res.clientSecret) throw new Error("No client secret");
      setClientSecret(res.clientSecret);
      return res.clientSecret;
    },
    [clientSecret, x, y, color, name, url, imageUrl],
  );

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (url.trim()) {
      try {
        const u = new URL(url.trim());
        if (!/^https?:$/.test(u.protocol)) throw new Error();
      } catch {
        setError("URL must be a valid http(s) link");
        return;
      }
    }
    if (imageUrl.trim()) {
      try {
        const u = new URL(imageUrl.trim());
        if (!/^https?:$/.test(u.protocol)) throw new Error();
      } catch {
        setError("Image URL must be a valid http(s) link");
        return;
      }
    }
    setSubmitting(true);
    try {
      setStep("pay");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4">
      <div className="w-full max-w-xl brut-border bg-paper brut-shadow">
        <div className="flex items-center justify-between brut-border border-x-0 border-t-0 p-3">
          <div className="font-display text-sm uppercase">
            {step === "form" ? "Claim pixel" : "Pay"} · ({x}, {y}) · ${price}.00
            {center && <span className="ml-2 brut-border bg-zap px-1.5 py-0.5 text-[10px]">CENTER</span>}
          </div>
          <button onClick={onClose} className="brut-border px-2 text-sm">✕</button>
        </div>

        {step === "form" && (
          <form onSubmit={handleContinue} className="space-y-4 p-5">
            <div>
              <label className="font-display text-xs uppercase opacity-70">Display name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className="mt-1 w-full brut-border bg-paper px-3 py-2 text-sm outline-none"
                placeholder="Your name or handle"
              />
            </div>
            <div>
              <label className="font-display text-xs uppercase opacity-70">Link URL (optional)</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                maxLength={300}
                className="mt-1 w-full brut-border bg-paper px-3 py-2 text-sm outline-none"
                placeholder="https://yoursite.com"
              />
            </div>
            <div>
              <label className="font-display text-xs uppercase opacity-70">Image (optional)</label>
              <div className="mt-1 flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  maxLength={500}
                  className="flex-1 brut-border bg-paper px-3 py-2 text-sm outline-none"
                  placeholder="https://...png or upload →"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="brut-border bg-ink px-3 py-2 font-display text-xs uppercase text-paper brut-shadow-sm disabled:opacity-50"
                >
                  {uploading ? "..." : "Upload"}
                </button>
              </div>
              {imageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={imageUrl} alt="preview" className="h-12 w-12 brut-border object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-xs underline opacity-70"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="font-display text-xs uppercase opacity-70">Pixel color</label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {PALETTE.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 brut-border ${color === c ? "ring-2 ring-flame ring-offset-2" : ""}`}
                    style={{ background: c }}
                    aria-label={c}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-7 w-10 brut-border bg-paper"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 brut-border bg-zap/30 p-3">
              <div className="h-12 w-12 brut-border" style={{ background: color }} />
              <div className="text-xs">
                <div className="font-display">Preview</div>
                <div className="opacity-70">@({x}, {y}) · {center ? "Center zone — $5" : "Regular — $1"}</div>
              </div>
            </div>
            {error && <div className="brut-border bg-flame/20 px-3 py-2 text-xs text-flame">{error}</div>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full brut-border bg-flame px-4 py-3 font-display text-sm uppercase text-paper brut-shadow-sm disabled:opacity-50"
            >
              Continue to payment · ${price}.00
            </button>
          </form>
        )}

        {step === "pay" && (
          <div className="p-3">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>
    </div>
  );
}
