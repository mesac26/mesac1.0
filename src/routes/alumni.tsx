import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ALUMNI_GRADUATION_YEARS, registerAlumniInMemory } from "@/data/mock/alumni";
import type { AlumniRegistrationFormValues, AlumniRegistrationErrors, AlumniRecord } from "@/types";
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  LogIn,
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  User,
  KeyRound,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [
      { title: "Alumni Registration — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Register with the MESAC Alumni Network — Division of Mechanical Engineering, School of Engineering, Cochin University of Science and Technology (CUSAT).",
      },
      { property: "og:title", content: "Alumni Registration — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "Register with the MESAC Alumni Network — Division of Mechanical Engineering, School of Engineering, Cochin University of Science and Technology (CUSAT).",
      },
    ],
  }),
  component: AlumniRegistrationPage,
});

const INITIAL_FORM_VALUES: AlumniRegistrationFormValues = {
  name: "",
  graduationYear: "",
  currentOccupation: "",
  email: "",
  password: "",
};

function AlumniRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AlumniRegistrationFormValues>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<AlumniRegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState<AlumniRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Field change handler
  const handleInputChange = (field: keyof AlumniRegistrationFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Required-field validation
  const validateForm = (): boolean => {
    const errors: AlumniRegistrationErrors = {};

    // 1. Name (required)
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    // 2. Batch / Year of Graduation (required)
    if (!formData.graduationYear.trim()) {
      errors.graduationYear = "Batch / Year of Graduation is required.";
    }

    // 3. Current Occupation (required)
    const trimmedOccupation = formData.currentOccupation.trim();
    if (!trimmedOccupation) {
      errors.currentOccupation = "Current Occupation is required.";
    }

    // 4. Email ID (required & valid)
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = "Email ID is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    // 5. Password (required)
    const trimmedPassword = (formData.password || "").trim();
    if (!trimmedPassword) {
      errors.password = "Password is required.";
    } else if (trimmedPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // Submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();
    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(`alumni-${firstErrorKey}`);
        if (el) el.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Frontend validation & in-memory demo registration (strictly no password persistence)
    setTimeout(() => {
      const newRecord = registerAlumniInMemory({
        name: formData.name,
        graduationYear: formData.graduationYear,
        currentOccupation: formData.currentOccupation,
        email: formData.email,
      });

      setRegisteredRecord(newRecord);
      setIsSubmitting(false);
      toast.success("Alumni registered successfully!");
      window.scrollTo({ top: 320, behavior: "smooth" });
    }, 450);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Alumni ID copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_VALUES);
    setFormErrors({});
    setRegisteredRecord(null);
    setCopiedCode(false);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* PAGE HERO */}
      <PageHero
        eyebrow="ALUMNI NETWORK"
        title="Alumni Registration"
        subtitle="Connect with generations of Mechanical Engineering graduates from the School of Engineering, CUSAT. Register below to join the MESAC Alumni Network."
        variant="academic"
      />

      <section className="relative py-12 sm:py-16 lg:py-20 bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {registeredRecord ? (
            /* ========================================================== */
            /* SUCCESS STATE                                              */
            /* ========================================================== */
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-xl shadow-black/20 text-center space-y-8 animate-fade-in">
                {/* SUCCESS BADGE & HEADING */}
                <div className="space-y-3">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="h-3 w-3" />
                    <span>Registration Recorded</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                    Registration Successful!
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
                    Welcome to the{" "}
                    <span className="font-semibold text-foreground">MESAC Alumni Network</span>.
                    Your alumni profile has been successfully created.
                  </p>
                </div>

                {/* GENERATED ALUMNI ID CODE */}
                <div className="max-w-md mx-auto rounded-2xl border-2 border-gold/40 bg-gold/5 p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold block">
                    Your Generated Alumni ID
                  </span>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider text-gold select-all px-4 py-2 rounded-xl bg-background/80 border border-gold/30">
                      {registeredRecord.alumniIdCode}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(registeredRecord.alumniIdCode)}
                      aria-label="Copy alumni ID"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold px-3.5 py-2.5 text-xs font-semibold transition active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-muted-foreground pt-1">
                    Please retain this unique ID code for official MESAC alumni verification.
                  </p>
                </div>

                {/* SUMMARY CARD (Password excluded for privacy/security) */}
                <div className="rounded-2xl border border-border bg-secondary/30 p-5 sm:p-6 text-left max-w-xl mx-auto space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gold" />
                    <span>Registered Information</span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-xs border-t border-border/60">
                    <div>
                      <dt className="text-muted-foreground text-[11px]">Name</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {registeredRecord.name}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Batch / Graduation Year</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        Batch of {registeredRecord.graduationYear}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Current Occupation</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {registeredRecord.currentOccupation}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Email ID</dt>
                      <dd className="font-semibold text-foreground mt-0.5 break-all">
                        {registeredRecord.email}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* ACTIONS */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/alumni/dashboard" })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full gradient-gold text-primary font-bold px-7 py-3 text-sm shadow-md transition hover:brightness-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold min-h-[44px]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Go to Alumni Dashboard</span>
                  </button>

                  <Link
                    to="/alumni/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card hover:bg-secondary text-foreground font-semibold px-6 py-3 text-sm transition min-h-[44px]"
                  >
                    <LogIn className="h-4 w-4 text-gold" />
                    <span>Alumni Login</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-transparent hover:bg-secondary/50 text-muted-foreground hover:text-foreground px-5 py-3 text-xs font-semibold transition min-h-[44px]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Register Another</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            /* ========================================================== */
            /* REGISTRATION FORM STATE                                    */
            /* ========================================================== */
            <div className="space-y-8">
              {/* TOP NOTICE & LOGIN LINK */}
              <Reveal>
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gold/10 text-gold grid place-items-center shrink-0">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold">
                        School of Engineering, CUSAT
                      </span>
                      <h2 className="font-display text-lg sm:text-xl font-extrabold text-foreground">
                        MESAC Alumni Registration
                      </h2>
                    </div>
                  </div>

                  <Link
                    to="/alumni/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-2.5 text-xs font-bold transition self-stretch sm:self-auto justify-center"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Already Registered? Login</span>
                  </Link>
                </div>
              </Reveal>

              {/* FORM CONTAINER */}
              <Reveal delay={50}>
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/10">
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* FIELD 1: NAME */}
                    <div>
                      <label
                        htmlFor="alumni-name"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                      >
                        Name <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          id="alumni-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="e.g. Rahul Kumar"
                          aria-required="true"
                          aria-invalid={Boolean(formErrors.name)}
                          aria-describedby={formErrors.name ? "err-name" : undefined}
                          className={`w-full rounded-xl border bg-background pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                            formErrors.name
                              ? "border-red-500/80 bg-red-500/5"
                              : "border-border hover:border-border/80 focus:border-gold"
                          }`}
                        />
                      </div>
                      {formErrors.name && (
                        <p
                          id="err-name"
                          className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* ROW: BATCH / YEAR OF GRADUATION & CURRENT OCCUPATION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* FIELD 2: BATCH / YEAR OF GRADUATION */}
                      <div>
                        <label
                          htmlFor="alumni-graduationYear"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Batch / Year of Graduation <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="alumni-graduationYear"
                            required
                            value={formData.graduationYear}
                            onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.graduationYear)}
                            aria-describedby={
                              formErrors.graduationYear ? "err-graduationYear" : undefined
                            }
                            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold appearance-none cursor-pointer ${
                              formErrors.graduationYear
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-border hover:border-border/80 focus:border-gold"
                            }`}
                          >
                            <option value="" disabled className="bg-card text-muted-foreground">
                              Select Batch / Year
                            </option>
                            {ALUMNI_GRADUATION_YEARS.map((year) => (
                              <option
                                key={year}
                                value={year.toString()}
                                className="bg-card text-foreground"
                              >
                                Batch of {year}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                          </div>
                        </div>
                        {formErrors.graduationYear && (
                          <p
                            id="err-graduationYear"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.graduationYear}</span>
                          </p>
                        )}
                      </div>

                      {/* FIELD 3: CURRENT OCCUPATION */}
                      <div>
                        <label
                          htmlFor="alumni-currentOccupation"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Current Occupation <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <input
                            id="alumni-currentOccupation"
                            type="text"
                            required
                            value={formData.currentOccupation}
                            onChange={(e) => handleInputChange("currentOccupation", e.target.value)}
                            placeholder="e.g. Design Engineer, Tata Motors"
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.currentOccupation)}
                            aria-describedby={
                              formErrors.currentOccupation ? "err-currentOccupation" : undefined
                            }
                            className={`w-full rounded-xl border bg-background pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                              formErrors.currentOccupation
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-border hover:border-border/80 focus:border-gold"
                            }`}
                          />
                        </div>
                        {formErrors.currentOccupation && (
                          <p
                            id="err-currentOccupation"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.currentOccupation}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ROW: EMAIL ID & PASSWORD */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* FIELD 4: EMAIL ID */}
                      <div>
                        <label
                          htmlFor="alumni-email"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Email ID <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                          </div>
                          <input
                            id="alumni-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="rahul.kumar@example.com"
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.email)}
                            aria-describedby={formErrors.email ? "err-email" : undefined}
                            className={`w-full rounded-xl border bg-background pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                              formErrors.email
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-border hover:border-border/80 focus:border-gold"
                            }`}
                          />
                        </div>
                        {formErrors.email && (
                          <p
                            id="err-email"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.email}</span>
                          </p>
                        )}
                      </div>

                      {/* FIELD 5: PASSWORD (Masked input) */}
                      <div>
                        <label
                          htmlFor="alumni-password"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Password <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                            <KeyRound className="h-4 w-4" />
                          </div>
                          <input
                            id="alumni-password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="Create a password"
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.password)}
                            aria-describedby={formErrors.password ? "err-password" : undefined}
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
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {formErrors.password && (
                          <p
                            id="err-password"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.password}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4 space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full gradient-gold text-primary font-bold px-10 py-3.5 text-sm shadow-md transition hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:pointer-events-none cursor-pointer focus-visible:ring-2 focus-visible:ring-gold min-h-[46px]"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              <span>Registering...</span>
                            </>
                          ) : (
                            <>
                              <GraduationCap className="h-4 w-4" />
                              <span>Register</span>
                            </>
                          )}
                        </button>

                        <span className="text-xs text-muted-foreground">
                          Already have an account?{" "}
                          <Link
                            to="/alumni/login"
                            className="font-bold text-gold hover:underline transition"
                          >
                            Login here
                          </Link>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground/80 pt-1">
                        <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <p>
                          Your information is kept secure and used exclusively for MESAC alumni
                          activities, student mentorship programs, and official correspondence.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
