import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Administrative portal login for MESAC (Mechanical Engineering Students' Association, CUSAT).",
      },
    ],
  }),
  component: AdminLoginPage,
});

type LoginMode = "idle" | "submitting" | "email_sent" | "error" | "unauthorized_notice";

export function AdminLoginPage() {
  const { signInWithGoogle, signInWithEmail, resetToPrototype } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<LoginMode>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setMode("submitting");
    setStatusMessage("Connecting to Google OAuth identity provider...");
    setTimeout(() => {
      setMode("error");
      setStatusMessage(
        "OAuth Integration Pending: The backend developer will connect the Google Workspace Client ID and redirect callbacks.",
      );
    }, 1000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setMode("error");
      setStatusMessage("Please enter a valid institutional email address.");
      return;
    }

    setMode("submitting");
    setStatusMessage("Verifying administrator authorization for this email...");

    setTimeout(() => {
      // If student or unknown email, show clean access denied preview
      if (email.endsWith("@gmail.com") && !email.includes("mesac") && !email.includes("cusat")) {
        setMode("unauthorized_notice");
        setStatusMessage(
          `Account (${email}) is not listed in the MESAC Approved Administrators registry. Contact the Head of Division or superadmin to request access.`,
        );
      } else {
        setMode("email_sent");
        setStatusMessage(
          `Verification initiated for ${email}. Backend email authentication (one-time code or magic link) is pending server implementation.`,
        );
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#121214] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header / Public Back Link */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to MESAC Website</span>
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 rounded-full">
          Restricted Portal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="rounded-3xl bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-[#7c1d28] p-3 flex items-center justify-center border border-white/20 shadow-md">
              <img
                src="/mesac-logo-real.png"
                alt="MESAC Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="pt-2">
              <h1 className="font-display text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
                MESAC Administration
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Mechanical Engineering Students' Association · CUSAT
              </p>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1 max-w-sm mx-auto">
              This console is restricted to verified MESAC committee members and departmental
              faculty administrators.
            </p>
          </div>

          {/* Feedback & Notice Banners */}
          {mode === "error" && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-800 dark:text-red-300 flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Sign-In Notice</span>
                {statusMessage}
              </div>
            </div>
          )}

          {mode === "unauthorized_notice" && (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Account Not Authorized</span>
                {statusMessage}
              </div>
            </div>
          )}

          {mode === "email_sent" && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Verification Ready</span>
                {statusMessage}
              </div>
            </div>
          )}

          {/* Action 1: Google Workspace Sign-In */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={mode === "submitting"}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700/80 font-bold text-xs sm:text-sm transition shadow-xs disabled:opacity-60"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
              <span className="bg-white dark:bg-[#18181b] px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 absolute">
                or institutional email
              </span>
            </div>
          </div>

          {/* Action 2: Institutional Email Flow */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label
                htmlFor="admin-email"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Administrator Email Address
              </Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3 text-neutral-400" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cusat.ac.in"
                  required
                  disabled={mode === "submitting"}
                  className="pl-10 text-xs sm:text-sm h-10 rounded-xl"
                />
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Official CUSAT or approved association administrator account.
              </p>
            </div>

            <button
              type="submit"
              disabled={mode === "submitting"}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white font-bold text-xs sm:text-sm transition shadow-sm disabled:opacity-60"
            >
              {mode === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Continue with Email</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Development Integration Quick Links */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <div className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
              Frontend Development & Preview
            </div>
            <Link
              to="/admin"
              onClick={() => resetToPrototype()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7c1d28] dark:text-amber-400 hover:underline"
            >
              <span>Enter Dashboard in Prototype Mode</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
          Authorized personnel only. All access attempts and administrative modifications are
          audited and logged with IP timestamp records.
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-neutral-600 dark:text-neutral-400">
        © 2026 MESAC · Division of Mechanical Engineering, School of Engineering, CUSAT
      </footer>
    </div>
  );
}
