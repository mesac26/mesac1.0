import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import {
  ALUMNI_GRADUATION_YEARS,
  ALUMNI_DEPARTMENTS,
  generateAlumniHandle,
} from "@/data/mock/alumni";
import type {
  AlumniRegistrationFormValues,
  AlumniRegistrationErrors,
  AlumniDepartment,
  AlumniRecord,
} from "@/types";
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [
      { title: "Alumni — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Register with the MESAC Alumni Network — Division of Mechanical Engineering, School of Engineering, Cochin University of Science and Technology (CUSAT).",
      },
      { property: "og:title", content: "Alumni — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "Register with the MESAC Alumni Network — Division of Mechanical Engineering, School of Engineering, Cochin University of Science and Technology (CUSAT).",
      },
    ],
  }),
  component: AlumniPage,
});

const INITIAL_FORM_VALUES: AlumniRegistrationFormValues = {
  fullName: "",
  graduationYear: "",
  department: "",
  email: "",
  phone: "",
  organization: "",
  location: "",
};

function AlumniPage() {
  const [formData, setFormData] = useState<AlumniRegistrationFormValues>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<AlumniRegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState<AlumniRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Field change handler
  const handleInputChange = (field: keyof AlumniRegistrationFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation logic
  const validateForm = (): boolean => {
    const errors: AlumniRegistrationErrors = {};

    // 1. Full Name (required, min 2 chars)
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      errors.fullName = "Full name is required.";
    } else if (trimmedName.length < 2) {
      errors.fullName = "Please enter your full name (at least 2 characters).";
    }

    // 2. Graduation Year (required)
    if (!formData.graduationYear.trim()) {
      errors.graduationYear = "Graduation year is required.";
    }

    // 3. Department (required)
    if (!formData.department) {
      errors.department = "Please select your department.";
    }

    // 4. Email (required, valid email pattern)
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    // 5. Phone Number (required, minimum 7 digits, digits and standard symbols)
    const trimmedPhone = formData.phone.trim();
    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (!trimmedPhone) {
      errors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 7) {
      errors.phone = "Please enter a valid phone number (at least 7 digits).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle registration submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus the first error element if possible
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const el = document.getElementById(`alumni-${firstErrorField}`);
        if (el) el.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Brief tactile transition state (frontend only, no API call)
    setTimeout(() => {
      const generatedCode = generateAlumniHandle(formData.fullName);
      const newRecord: AlumniRecord = {
        ...formData,
        id: `alm-${Date.now()}`,
        alumniIdCode: generatedCode,
        registeredAt: new Date().toISOString(),
      };

      setRegisteredRecord(newRecord);
      setIsSubmitting(false);
      window.scrollTo({ top: 320, behavior: "smooth" });
    }, 400);
  };

  // Copy alumni ID code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Alumni ID copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Reset form to register another alumni
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
        title="Alumni"
        subtitle="Connect with generations of Mechanical Engineering graduates from the School of Engineering, CUSAT. Register your details below to join the MESAC Alumni Network."
        variant="academy"
      />

      {/* MAIN REGISTRATION CONTENT */}
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
                  </p>
                </div>

                {/* PROMINENT GENERATED ALUMNI NAME / CODE */}
                <div className="max-w-md mx-auto rounded-2xl border-2 border-gold/40 bg-gold/5 p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold block">
                    Your Generated Alumni Name
                  </span>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider text-gold select-all px-4 py-2 rounded-xl bg-background/80 border border-gold/30">
                      {registeredRecord.alumniIdCode}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(registeredRecord.alumniIdCode)}
                      aria-label="Copy alumni name"
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
                    Please save this name for future alumni activities.
                  </p>
                </div>

                {/* REGISTRATION SUMMARY CARD */}
                <div className="rounded-2xl border border-border bg-secondary/30 p-5 sm:p-6 text-left max-w-xl mx-auto space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gold" />
                    <span>Registered Details</span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-xs border-t border-border/60">
                    <div>
                      <dt className="text-muted-foreground text-[11px]">Full Name</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {registeredRecord.fullName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Graduation Year</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        Batch of {registeredRecord.graduationYear}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Department</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {registeredRecord.department}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Email</dt>
                      <dd className="font-semibold text-foreground mt-0.5 break-all">
                        {registeredRecord.email}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted-foreground text-[11px]">Phone</dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {registeredRecord.phone}
                      </dd>
                    </div>

                    {registeredRecord.organization && (
                      <div>
                        <dt className="text-muted-foreground text-[11px]">Organization</dt>
                        <dd className="font-semibold text-foreground mt-0.5">
                          {registeredRecord.organization}
                        </dd>
                      </div>
                    )}

                    {registeredRecord.location && (
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground text-[11px]">Location</dt>
                        <dd className="font-semibold text-foreground mt-0.5">
                          {registeredRecord.location}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* BACK TO REGISTRATION BUTTON */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center justify-center gap-2 rounded-full gradient-gold text-primary font-bold px-8 py-3.5 text-sm shadow-md transition hover:brightness-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Register Another Alumni</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            /* ========================================================== */
            /* REGISTRATION FORM STATE                                    */
            /* ========================================================== */
            <div className="space-y-8">
              {/* INTRO CARD */}
              <Reveal>
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gold/10 text-gold grid place-items-center">
                      <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold">
                        School of Engineering, CUSAT
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                        MESAC Alumni Registration
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Please provide your contact and graduation details to stay in touch with MESAC
                    initiatives, student mentorship programs, and future alumni engagements.
                  </p>
                </div>
              </Reveal>

              {/* FORM CARD */}
              <Reveal delay={60}>
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/10">
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* ROW 1: FULL NAME & GRADUATION YEAR */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* 1. Full Name */}
                      <div>
                        <label
                          htmlFor="alumni-fullName"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Full Name <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="alumni-fullName"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="e.g. Rahul Kumar"
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.fullName)}
                            aria-describedby={formErrors.fullName ? "err-fullName" : undefined}
                            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                              formErrors.fullName
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-border hover:border-border/80 focus:border-gold"
                            }`}
                          />
                        </div>
                        {formErrors.fullName && (
                          <p
                            id="err-fullName"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.fullName}</span>
                          </p>
                        )}
                      </div>

                      {/* 2. Graduation Year */}
                      <div>
                        <label
                          htmlFor="alumni-graduationYear"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Graduation Year <span className="text-amber-500">*</span>
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
                              Select Graduation Year
                            </option>
                            {ALUMNI_GRADUATION_YEARS.map((year) => (
                              <option
                                key={year}
                                value={year.toString()}
                                className="bg-card text-foreground"
                              >
                                {year}
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
                    </div>

                    {/* ROW 2: DEPARTMENT & EMAIL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* 3. Department */}
                      <div>
                        <label
                          htmlFor="alumni-department"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Department <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="alumni-department"
                            required
                            value={formData.department}
                            onChange={(e) =>
                              handleInputChange("department", e.target.value as AlumniDepartment)
                            }
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.department)}
                            aria-describedby={formErrors.department ? "err-department" : undefined}
                            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold appearance-none cursor-pointer ${
                              formErrors.department
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-border hover:border-border/80 focus:border-gold"
                            }`}
                          >
                            <option value="" disabled className="bg-card text-muted-foreground">
                              Select Department
                            </option>
                            {ALUMNI_DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept} className="bg-card text-foreground">
                                {dept}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <Building className="h-4 w-4" />
                          </div>
                        </div>
                        {formErrors.department && (
                          <p
                            id="err-department"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.department}</span>
                          </p>
                        )}
                      </div>

                      {/* 4. Email */}
                      <div>
                        <label
                          htmlFor="alumni-email"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Email <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
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
                            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
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
                    </div>

                    {/* ROW 3: PHONE NUMBER & CURRENT ORGANIZATION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* 5. Phone Number */}
                      <div>
                        <label
                          htmlFor="alumni-phone"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Phone Number <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="alumni-phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+91 98765 43210"
                            aria-required="true"
                            aria-invalid={Boolean(formErrors.phone)}
                            aria-describedby={formErrors.phone ? "err-phone" : undefined}
                            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold ${
                              formErrors.phone
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-border hover:border-border/80 focus:border-gold"
                            }`}
                          />
                        </div>
                        {formErrors.phone && (
                          <p
                            id="err-phone"
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-medium"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{formErrors.phone}</span>
                          </p>
                        )}
                      </div>

                      {/* 6. Current Organization / Company (optional) */}
                      <div>
                        <label
                          htmlFor="alumni-organization"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                        >
                          Current Organization / Company{" "}
                          <span className="text-muted-foreground/60 text-[10px] font-normal">
                            (Optional)
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            id="alumni-organization"
                            type="text"
                            value={formData.organization}
                            onChange={(e) => handleInputChange("organization", e.target.value)}
                            placeholder="e.g. Tata Motors / ISRO / Self-Employed"
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none hover:border-border/80 focus:border-gold focus-visible:ring-2 focus-visible:ring-gold transition min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ROW 4: CURRENT LOCATION */}
                    <div>
                      <label
                        htmlFor="alumni-location"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1.5"
                      >
                        Current Location{" "}
                        <span className="text-muted-foreground/60 text-[10px] font-normal">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="alumni-location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="e.g. Kochi, India or Munich, Germany"
                          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none hover:border-border/80 focus:border-gold focus-visible:ring-2 focus-visible:ring-gold transition min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON & PROTOTYPE NOTICE */}
                    <div className="pt-4 space-y-4">
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

                      <div className="flex items-start gap-2 text-xs text-muted-foreground/80 pt-1">
                        <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <p>
                          Your information will be used exclusively for MESAC alumni coordination,
                          events, and official academic correspondence from CUSAT.
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
