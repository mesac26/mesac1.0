import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { IntegrationNotice } from "./IntegrationNotice";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  ShieldAlert,
  Lock,
  RefreshCw,
  ArrowRight,
  Loader2,
  AlertOctagon,
  Home,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status, error, retrySessionCheck, resetToPrototype } = useAdminAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Loading State Guard
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] dark:bg-[#121214] p-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-[#7c1d28] p-3 flex items-center justify-center border border-white/20 shadow-xl mb-4 animate-pulse">
          <img src="/mesac-logo-real.png" alt="MESAC" className="h-full w-full object-contain" />
        </div>
        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Verifying MESAC Administrator Session
        </h2>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Checking access permissions with authentication provider...
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#7c1d28] dark:text-amber-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State Guard (Redirect to /admin/login)
  if (status === "unauthenticated") {
    const loginUrl = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] dark:bg-[#121214] p-4 text-center">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7c1d28]/10 text-[#7c1d28] dark:bg-[#7c1d28]/30 dark:text-[#f8b4bc]">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-neutral-50">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            You must be signed in with an authorized MESAC administrator account to access this
            section.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to={loginUrl}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white px-4 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition shadow-sm"
            >
              <span>Go to Admin Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Button
              variant="outline"
              onClick={resetToPrototype}
              className="text-xs h-9 rounded-xl border-dashed border-neutral-300 dark:border-neutral-700"
            >
              Resume Frontend Prototype Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized State Guard (Access Denied)
  if (status === "unauthorized") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] dark:bg-[#121214] p-4 text-center">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/40 p-8 shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-neutral-50">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your account does not have administrator privileges for the MESAC portal. Contact the
            Head of Division or association superadmin to request access.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2.5 text-xs sm:text-sm font-bold transition shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span>Return to Public Website</span>
            </Link>
            <Button variant="outline" onClick={resetToPrototype} className="text-xs h-9 rounded-xl">
              Reset to Prototype Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Error State Guard (Session verification failure)
  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] dark:bg-[#121214] p-4 text-center">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            <AlertOctagon className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-neutral-50">
            Session Verification Failed
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {error || "An unexpected error occurred while verifying your session status."}
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              onClick={() => retrySessionCheck()}
              className="w-full rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs sm:text-sm font-bold gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Session Check</span>
            </Button>
            <Button variant="outline" onClick={resetToPrototype} className="text-xs h-9 rounded-xl">
              Switch to Prototype Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Authorized / Prototype Preview: Render Complete Admin Workspace
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#121214] text-neutral-900 dark:text-neutral-100 flex flex-col">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden flex"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
              <AdminSidebar onCloseMobile={() => setIsMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />

          {/* Prototype Integration Banner */}
          <div className="px-4 sm:px-6 pt-4">
            <IntegrationNotice />
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
