import { Link } from "@tanstack/react-router";
import { useAdsVisible } from "@/hooks/useAdsVisible";

function Upsell() {
  return (
    <Link
      to="/canvas"
      className="block text-center"
      style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}
    >
      🎨 Own a piece of the canvas — ads disappear when you buy pixels
    </Link>
  );
}

export function AdSlotTop() {
  const show = useAdsVisible();
  if (!show) return null;
  return (
    <div aria-label="Advertisement">
      <div
        className="adsense-slot-top"
        style={{
          background: "#f3f4f6",
          border: "2px dashed #d1d5db",
          width: 728,
          maxWidth: "100%",
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: 12,
          margin: "16px auto",
        }}
      >
        Advertisement
      </div>
      <Upsell />
    </div>
  );
}

export function AdSlotBottom() {
  const show = useAdsVisible();
  if (!show) return null;
  return (
    <div aria-label="Advertisement">
      <div
        className="adsense-slot-bottom"
        style={{
          background: "#f3f4f6",
          border: "2px dashed #d1d5db",
          width: 300,
          maxWidth: "100%",
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: 12,
          margin: "16px auto",
        }}
      >
        Advertisement
      </div>
      <Upsell />
    </div>
  );
}
