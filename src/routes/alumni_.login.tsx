import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { loginAlumniInMemory } from "@/data/mock/alumni";
import type { AlumniLoginFormValues, AlumniLoginErrors } from "@/types";
import {
  GraduationCap,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/alumni_/login")({
  head: () => ({
    meta: [
      { title: "Alumni Login — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Login to the MESAC Alumni Portal — access your alumni dashboard, update personal details, and register for alumni meets.",
      },
      { property: "og:title", content: "Alumni Login — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "Login to the MESAC Alumni Portal — access your alumni dashboard, update personal details, and register for alumni meets.",
      },
    ],
  }),
  component: AlumniLoginPage,
});

const INITIAL_LOGIN_VALUES: AlumniLoginFormValues = {
  email: "",
  password: "",
};

function AlumniLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AlumniLoginFormValues>(INITIAL_LOGIN_VALUES);
  const [formErrors, setFormErrors] = useState<AlumniLoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof AlumniLoginFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: AlumniLoginErrors = {};

    // 1. Email ID validation
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = "Email ID is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    // 2. Password validation
    const trimmedPassword = (formData.password || "").trim();
    if (!trimmedPassword) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();
    if (!isValid) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const el = document.getElementById(`login-${firstError}`);
        if (el) el.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Frontend demo login simulation (no persistent credentials stored)
    setTimeout(() => {
      loginAlumniInMemory(formData.email);
      setIsSubmitting(false);
      toast.success("Login successful! Welcome to the Alumni Portal.");
      navigate({ to: "/alumni/dashboard" });
    }, 400);
  };

  // Quick fill helper for testing demo credentials
  const handleUseDemoAccount = () => {
    setFormData({
      email: "rahul.k@alumni.cusat.ac.in",
      password: "password123",
    });
    setFormErrors({});
  };

  return (
    <Layout>
      {/* PAGE HERO */}
      <PageHero
        eyebrow="ALUMNI NETWORK"
        title="Alumni Login"
        subtitle="Sign in to your MESAC Alumni account to access your personal dashboard and register for upcoming alumni meets."
        variant="academic"
      />

      <section className="relative py-12 sm:py-16 lg:py-20 bg-background text-foreground">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-xl shadow-black/20 space-y-6">
              {/* CARD HEADER */}
              <div className="space-y-2 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold/10 text-gold border border-gold/20">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-foreground tracking-tight">
                  Alumni Portal Sign In
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enter your registered credentials to access your dashboard.
                </p>
              </div>

              {/* DEMO NOTICE BADGE */}
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-3 flex items-start gap-2.5 text-xs text-muted-foreground">
                <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>
                    <span className="font-bold text-foreground">Frontend Demo Mode:</span> Enter
                    your registered email or use the pre-seeded demo alumni account.
                  </p>
                  <button
                    type="button"
                    onClick={handleUseDemoAccount}
                    className="text-[11px] font-bold text-gold hover:underline cursor-pointer"
                  >
                    Click to fill demo account details
                  </button>
                </div>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleLogin} noValidate className="space-y-5">
                {/* FIELD 1: EMAIL ID */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                  >
                    Email ID <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="e.g. rahul.k@alumni.cusat.ac.in"
                      aria-required="true"
                      aria-invalid={Boolean(formErrors.email)}
                      aria-describedby={formErrors.email ? "err-login-email" : undefined}
                      className={`w-full rounded-xl border bg-background pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                        formErrors.email
                          ? "border-red-500/80 bg-red-500/5"
                          : "border-border hover:border-border/80 focus:border-gold"
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p
                      id="err-login-email"
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* FIELD 2: PASSWORD (Masked input) */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                  >
                    Password <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      aria-required="true"
                      aria-invalid={Boolean(formErrors.password)}
                      aria-describedby={formErrors.password ? "err-login-password" : undefined}
                      className={`w-full rounded-xl border bg-background pl-10 pr-10 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                        formErrors.password
                          ? "border-red-500/80 bg-red-500/5"
                          : "border-border hover:border-border/80 focus:border-gold"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p
                      id="err-login-password"
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{formErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* LOGIN BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-gold text-primary font-bold px-6 py-3.5 text-sm shadow-md transition hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:pointer-events-none cursor-pointer focus-visible:ring-2 focus-visible:ring-gold min-h-[46px]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span>Login to Dashboard</span>
                      </>
                    )}
                  </button>
                </div>

                {/* LINK TO REGISTRATION PAGE */}
                <div className="pt-3 border-t border-border/60 text-center space-y-3">
                  <p className="text-xs text-muted-foreground">Don't have an alumni account yet?</p>
                  <Link
                    to="/alumni"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground font-semibold px-4 py-2.5 text-xs transition"
                  >
                    <span>Register as MESAC Alumni</span>
                    <ArrowRight className="h-3.5 w-3.5 text-gold" />
                  </Link>
                </div>
              </form>
            </div>
          </Reveal>

          {/* PRIVACY & SECURITY NOTE */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/80 text-center">
            <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
            <span>Frontend demo implementation ready for future backend integration.</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
