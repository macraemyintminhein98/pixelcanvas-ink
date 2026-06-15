import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-2 text-sm opacity-70">This square doesn’t exist (yet).</p>
        <div className="mt-6">
          <Link to="/" className="brut-border bg-flame px-4 py-2 text-sm font-bold uppercase text-paper brut-shadow-sm">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl">Something cracked.</h1>
        <p className="mt-2 text-sm opacity-70">An unexpected error occurred. Please try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 brut-border bg-ink px-4 py-2 text-sm font-bold uppercase text-paper brut-shadow-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "QiDKEpSFXi1CG1XvOa-KLvOfXoUFkHQUYAZVOPTQ368" },
      { title: "PixelCanvas — Claim your square on the public canvas" },
      { name: "description", content: "Buy a 1×1 square on a 10,000-square public canvas for $1. Customize it with a color, name, and link. Yours forever. Free to browse." },
      { property: "og:title", content: "PixelCanvas — A public artwork, one square at a time" },
      { property: "og:description", content: "Buy a 1×1 square on a 10,000-square public canvas for $1. Customize it with a color, name, and link. Yours forever. Free to browse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PixelCanvas — A public artwork, one square at a time" },
      { name: "twitter:description", content: "Buy a 1×1 square on a 10,000-square public canvas for $1. Customize it with a color, name, and link. Yours forever. Free to browse." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/237e0f3b-e513-4766-92d4-b87ec6948489/id-preview-d6f87bd5--eb790d46-fcb3-4edb-a242-5b7c67293009.lovable.app-1779331060535.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/237e0f3b-e513-4766-92d4-b87ec6948489/id-preview-d6f87bd5--eb790d46-fcb3-4edb-a242-5b7c67293009.lovable.app-1779331060535.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
    ],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
