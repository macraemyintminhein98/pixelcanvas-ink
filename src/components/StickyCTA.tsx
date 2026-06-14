import { Link } from "@tanstack/react-router";

export function StickyCTA() {
  return (
    <div className="fixed bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 md:bottom-4 md:w-auto">
      <Link
        to="/canvas"
        className="flex w-full items-center justify-center gap-3 brut-border bg-flame px-5 py-4 text-paper brut-shadow transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 md:py-3"
      >
        <span className="font-display text-base uppercase md:text-sm">Claim your square · $1</span>
      </Link>
    </div>
  );
}
