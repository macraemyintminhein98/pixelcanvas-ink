import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="brut-border border-x-0 border-b-0 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl">PIXELCANVAS</div>
          <p className="mt-2 text-sm opacity-70">
            A public artwork. 10,000 squares. One internet.
          </p>
        </div>
        <div>
          <div className="mb-2 font-display text-xs uppercase opacity-60">Explore</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/canvas">Canvas</Link></li>
            <li><Link to="/leaderboard">Top buyers</Link></li>
            <li><Link to="/auth">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-display text-xs uppercase opacity-60">Trust</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/legal">Community Rules</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-2 font-display text-xs uppercase opacity-60">Heads up</div>
          <p className="text-xs opacity-70">
            PixelCanvas is a digital collectible & public art participation
            project. Not a security, not an NFT.
          </p>
        </div>
      </div>
      <div className="brut-border border-x-0 border-b-0 px-4 py-3 text-center text-xs opacity-60">
        © 2026 PixelCanvas.ink · Built for the internet.
      </div>
    </footer>
  );
}
