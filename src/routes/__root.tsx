import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppLoaderProvider } from "../context/AppLoaderContext";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AlertCircle, LayoutDashboard, Home } from "lucide-react";

function NotFoundComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-center">
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 sm:p-12 shadow-sm max-w-lg w-full space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 dark:text-neutral-50 font-display">
              404
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-100">
              Admin Screen Not Found
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The administrative endpoint at{" "}
              <code className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                {pathname}
              </code>{" "}
              does not exist or has been reorganized.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition min-h-[42px]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Return to Dashboard</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2.5 text-xs sm:text-sm font-semibold transition min-h-[42px]"
              >
                <Home className="h-4 w-4" />
                <span>Public Site</span>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MESAC 2026 — Mechanical Engineering Students' Association" },
      {
        name: "description",
        content: "Mechanical Engineering Students' Association - MESAC Official Portal",
      },
      { name: "author", content: "MESAC CUSAT" },
      {
        property: "og:title",
        content: "MESAC 2026 — Mechanical Engineering Students' Association",
      },
      {
        property: "og:description",
        content: "Mechanical Engineering Students' Association - MESAC Official Portal",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as never },
      { rel: "preconnect", href: "https://fonts.cdnfonts.com", crossOrigin: "anonymous" as never },
      {
        rel: "stylesheet",
        href: "https://fonts.cdnfonts.com/css/garet",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.setItem('mesac-theme', 'dark');
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } catch(e) {}
              })();
            `,
          }}
        />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="page-transition-enter">
      {children}
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppLoaderProvider>
        <AdminAuthProvider>
          {/* Subtle CSS fade-in transition applied on route change */}
          <PageTransitionWrapper>
            <Outlet />
          </PageTransitionWrapper>
        </AdminAuthProvider>
      </AppLoaderProvider>
    </QueryClientProvider>
  );
}
