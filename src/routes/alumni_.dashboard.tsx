import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import {
  getAlumniSession,
  updateAlumniProfile,
  clearAlumniSession,
  addMeetRegistration,
  getMeetRegistrations,
  ALUMNI_GRADUATION_YEARS,
} from "@/data/mock/alumni";
import { mockEvents } from "@/data/mock/events";
import type {
  AlumniRecord,
  AlumniMeetRegistrationFormValues,
  AlumniMeetRegistrationRecord,
} from "@/types";
import {
  GraduationCap,
  User,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  X,
  LogOut,
  CalendarX,
  Users,
  Utensils,
  FileCheck,
  Send,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/alumni_/dashboard")({
  head: () => ({
    meta: [
      { title: "Alumni Dashboard — MESAC CUSAT" },
      {
        name: "description",
        content:
          "MESAC Alumni Dashboard — View and manage your personal information and register for alumni meets.",
      },
      { property: "og:title", content: "Alumni Dashboard — MESAC CUSAT" },
      {
        property: "og:description",
        content:
          "MESAC Alumni Dashboard — View and manage your personal information and register for alumni meets.",
      },
    ],
  }),
  component: AlumniDashboardPage,
});

export function AlumniDashboardPage() {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // In-memory Alumni Profile & Session State
  // -------------------------------------------------------------
  const [profile, setProfile] = useState<AlumniRecord>(() => getAlumniSession());

  // Section A: Personal Information Edit State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    graduationYear: profile.graduationYear,
    currentOccupation: profile.currentOccupation,
    email: profile.email,
    phone: profile.phone || "",
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);

  // Section B: Alumni Meet Registration State
  // Look up any upcoming alumni meets in mockEvents
  const upcomingAlumniMeets = useMemo(() => {
    return mockEvents.filter(
      (evt) =>
        evt.status === "upcoming" &&
        (evt.tag === "Alumni" || evt.title.toLowerCase().includes("alumni")),
    );
  }, []);

  const [showMeetForm, setShowMeetForm] = useState(false);
  const [meetFormData, setMeetFormData] = useState<AlumniMeetRegistrationFormValues>({
    name: profile.name,
    batch: profile.graduationYear,
    email: profile.email,
    phone: profile.phone || "",
    currentOccupation: profile.currentOccupation,
    attendanceMode: "In-Person",
    guestsCount: 0,
    dietaryPreference: "No Preference",
    notes: "",
  });
  const [meetFormErrors, setMeetFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingMeet, setIsSubmittingMeet] = useState(false);
  const [latestRegistration, setLatestRegistration] = useState<AlumniMeetRegistrationRecord | null>(
    () => {
      const existing = getMeetRegistrations();
      return existing.length > 0 ? existing[0] : null;
    },
  );

  // Handle Logout
  const handleLogout = () => {
    clearAlumniSession();
    toast.info("Logged out from Alumni Portal.");
    navigate({ to: "/alumni/login" });
  };

  // -------------------------------------------------------------
  // Personal Info Edit / Save Logic
  // -------------------------------------------------------------
  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStartEdit = () => {
    setEditForm({
      name: profile.name,
      graduationYear: profile.graduationYear,
      currentOccupation: profile.currentOccupation,
      email: profile.email,
      phone: profile.phone || "",
    });
    setEditErrors({});
    setIsEditingPersonal(true);
  };

  const handleCancelEdit = () => {
    setIsEditingPersonal(false);
    setEditErrors({});
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!editForm.name.trim()) errors.name = "Name is required.";
    if (!editForm.graduationYear.trim()) errors.graduationYear = "Graduation year is required.";
    if (!editForm.currentOccupation.trim())
      errors.currentOccupation = "Current occupation is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email.trim()) {
      errors.email = "Email ID is required.";
    } else if (!emailRegex.test(editForm.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsSavingPersonal(true);

    setTimeout(() => {
      const updated = updateAlumniProfile({
        name: editForm.name.trim(),
        graduationYear: editForm.graduationYear.trim(),
        currentOccupation: editForm.currentOccupation.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
      });

      setProfile(updated);
      setMeetFormData((prev) => ({
        ...prev,
        name: updated.name,
        batch: updated.graduationYear,
        email: updated.email,
        phone: updated.phone || prev.phone,
        currentOccupation: updated.currentOccupation,
      }));
      setIsSavingPersonal(false);
      setIsEditingPersonal(false);
      toast.success("Personal information updated successfully!");
    }, 350);
  };

  // -------------------------------------------------------------
  // Meet Registration Logic
  // -------------------------------------------------------------
  const handleMeetInputChange = (
    field: keyof AlumniMeetRegistrationFormValues,
    value: string | number,
  ) => {
    setMeetFormData((prev) => ({ ...prev, [field]: value }));
    if (meetFormErrors[field]) {
      setMeetFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMeetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!meetFormData.name.trim()) errors.name = "Full name is required.";
    if (!meetFormData.batch.trim()) errors.batch = "Batch is required.";
    if (!meetFormData.currentOccupation.trim())
      errors.currentOccupation = "Current occupation is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!meetFormData.email.trim()) {
      errors.email = "Email ID is required.";
    } else if (!emailRegex.test(meetFormData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!meetFormData.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (Object.keys(errors).length > 0) {
      setMeetFormErrors(errors);
      return;
    }

    setIsSubmittingMeet(true);

    setTimeout(() => {
      const rec = addMeetRegistration(meetFormData);
      setLatestRegistration(rec);
      setIsSubmittingMeet(false);
      setShowMeetForm(false);
      toast.success("Alumni meet registration submitted successfully!");
    }, 450);
  };

  return (
    <Layout>
      {/* PAGE HERO */}
      <PageHero
        eyebrow="ALUMNI NETWORK"
        title="Alumni Dashboard"
        subtitle={`Welcome, ${profile.name}. Manage your registered details and participate in MESAC alumni meets.`}
        variant="academic"
      />

      <section className="relative py-10 sm:py-14 lg:py-16 bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* USER SESSION BAR */}
          <Reveal>
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold border border-gold/30 grid place-items-center font-bold font-mono text-sm shrink-0">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      {profile.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gold/15 text-gold border border-gold/30">
                      {profile.alumniIdCode}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Batch of {profile.graduationYear} · {profile.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border hover:border-red-500/40 bg-card hover:bg-red-500/10 text-muted-foreground hover:text-red-400 px-3.5 py-2 text-xs font-semibold transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </Reveal>

          {/* ============================================================== */}
          {/* SECTION A: PERSONAL INFORMATION                                */}
          {/* ============================================================== */}
          <Reveal delay={40}>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/10 space-y-6">
              {/* SECTION HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold">
                      Section A
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                    Personal Information
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    View and update your registered alumni profile, current occupation, and contact
                    details.
                  </p>
                </div>

                {!isEditingPersonal && (
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-4 py-2.5 text-xs shadow-sm transition hover:brightness-105 active:scale-95 cursor-pointer self-start sm:self-center"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Information</span>
                  </button>
                )}
              </div>

              {isEditingPersonal ? (
                /* -------------------------------------------------------- */
                /* EDIT FORM                                                */
                /* -------------------------------------------------------- */
                <form
                  onSubmit={handleSavePersonal}
                  noValidate
                  className="space-y-5 animate-fade-in"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="edit-name"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleEditChange("name", e.target.value)}
                        className={`w-full rounded-xl border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                          editErrors.name ? "border-red-500 bg-red-500/5" : "border-border"
                        }`}
                      />
                      {editErrors.name && (
                        <p className="mt-1 text-xs text-red-400">{editErrors.name}</p>
                      )}
                    </div>

                    {/* Batch / Year of Graduation */}
                    <div>
                      <label
                        htmlFor="edit-year"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Batch / Year of Graduation <span className="text-amber-500">*</span>
                      </label>
                      <select
                        id="edit-year"
                        value={editForm.graduationYear}
                        onChange={(e) => handleEditChange("graduationYear", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        {ALUMNI_GRADUATION_YEARS.map((y) => (
                          <option key={y} value={y.toString()} className="bg-card text-foreground">
                            Batch of {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Current Occupation */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="edit-occupation"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Current Occupation <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="edit-occupation"
                        type="text"
                        value={editForm.currentOccupation}
                        onChange={(e) => handleEditChange("currentOccupation", e.target.value)}
                        placeholder="e.g. Senior Propulsion Specialist, ISRO"
                        className={`w-full rounded-xl border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                          editErrors.currentOccupation
                            ? "border-red-500 bg-red-500/5"
                            : "border-border"
                        }`}
                      />
                      {editErrors.currentOccupation && (
                        <p className="mt-1 text-xs text-red-400">{editErrors.currentOccupation}</p>
                      )}
                    </div>

                    {/* Email ID */}
                    <div>
                      <label
                        htmlFor="edit-email"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Email ID <span className="text-amber-500">*</span>
                      </label>
                      <input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                        className={`w-full rounded-xl border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                          editErrors.email ? "border-red-500 bg-red-500/5" : "border-border"
                        }`}
                      />
                      {editErrors.email && (
                        <p className="mt-1 text-xs text-red-400">{editErrors.email}</p>
                      )}
                    </div>

                    {/* Phone Number / Contact Details */}
                    <div>
                      <label
                        htmlFor="edit-phone"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Contact Phone
                      </label>
                      <input
                        id="edit-phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => handleEditChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold"
                      />
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={isSavingPersonal}
                      className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-6 py-2.5 text-xs shadow-md transition hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer"
                    >
                      {isSavingPersonal ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-secondary px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* -------------------------------------------------------- */
                /* VIEW DETAILS (Displays updated values in real-time)      */
                /* -------------------------------------------------------- */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                      <User className="h-3.5 w-3.5 text-gold" />
                      <span>Full Name</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-foreground">{profile.name}</p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                      <Calendar className="h-3.5 w-3.5 text-gold" />
                      <span>Batch / Graduation Year</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-foreground">
                      Batch of {profile.graduationYear}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                      <Briefcase className="h-3.5 w-3.5 text-gold" />
                      <span>Current Occupation</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-foreground">
                      {profile.currentOccupation}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                      <Mail className="h-3.5 w-3.5 text-gold" />
                      <span>Email ID</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-foreground break-all">
                      {profile.email}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                      <Phone className="h-3.5 w-3.5 text-gold" />
                      <span>Contact Phone</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-foreground">
                      {profile.phone || (
                        <span className="text-muted-foreground font-normal">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* ============================================================== */}
          {/* SECTION B: ALUMNI MEET REGISTRATION                           */}
          {/* ============================================================== */}
          <Reveal delay={80}>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/10 space-y-6">
              {/* SECTION HEADER */}
              <div className="space-y-1 pb-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold">
                    Section B
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                  Alumni Meet Registration
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Stay updated with upcoming alumni gatherings, conventions, and reunions hosted by
                  MESAC.
                </p>
              </div>

              {/* 1. UPCOMING MEETS LIST OR EMPTY STATE */}
              {upcomingAlumniMeets.length > 0 ? (
                /* Render upcoming meets if any exist in the project */
                <div className="space-y-4">
                  {upcomingAlumniMeets.map((meet) => (
                    <div
                      key={meet.id}
                      className="rounded-2xl border border-gold/40 bg-gold/5 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold">
                          Upcoming Meet
                        </span>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {meet.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {meet.date} · {meet.location}
                        </p>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 pt-1">
                          {meet.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowMeetForm(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl gradient-gold text-primary font-bold px-5 py-2.5 text-xs shadow-md shrink-0 cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* MANDATED EMPTY STATE:
                   If no upcoming alumni meet information exists in the current project,
                   show a simple empty state stating that no upcoming alumni meets have been announced.
                   Do not invent event names, dates, venues, or other event details.
                */
                <div className="rounded-2xl border border-border/80 bg-background/50 p-8 sm:p-10 text-center space-y-4">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-muted-foreground border border-border">
                    <CalendarX className="h-7 w-7" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      No upcoming alumni meets have been announced.
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      There are currently no scheduled alumni meets announced by MESAC. Official
                      updates regarding the next alumni gathering will be published here.
                    </p>
                  </div>

                  {/* Option to register/express interest or view form */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMeetForm((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-2.5 text-xs font-bold transition cursor-pointer"
                    >
                      <FileCheck className="h-4 w-4" />
                      <span>
                        {showMeetForm
                          ? "Hide Registration Form"
                          : "Pre-Register / Submit Meet Registration"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. REGISTRATION CONFIRMATION DISPLAY (AFTER SUCCESSFUL SUBMISSION) */}
              {latestRegistration && !showMeetForm && (
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-6 sm:p-8 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                        Registration Confirmed
                      </span>
                      <h4 className="font-display text-lg font-bold text-foreground">
                        Alumni Meet Registration Recorded
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Thank you,{" "}
                    <span className="font-semibold text-foreground">{latestRegistration.name}</span>
                    . Your registration for the MESAC Alumni Meet has been submitted.
                  </p>

                  <div className="rounded-xl border border-border/80 bg-background/80 p-4 text-xs space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                      <div>
                        <span className="font-medium text-[11px] block text-muted-foreground/70">
                          Registered Attendee
                        </span>
                        <span className="font-semibold text-foreground">
                          {latestRegistration.name} (Batch of {latestRegistration.batch})
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-[11px] block text-muted-foreground/70">
                          Mode of Attendance
                        </span>
                        <span className="font-semibold text-foreground">
                          {latestRegistration.attendanceMode} ({latestRegistration.guestsCount}{" "}
                          Guest(s))
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-[11px] block text-muted-foreground/70">
                          Contact
                        </span>
                        <span className="font-semibold text-foreground">
                          {latestRegistration.email} · {latestRegistration.phone}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-[11px] block text-muted-foreground/70">
                          Dietary Preference
                        </span>
                        <span className="font-semibold text-foreground">
                          {latestRegistration.dietaryPreference || "No Preference"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      Ref ID:{" "}
                      <code className="font-mono text-foreground font-bold">
                        {latestRegistration.id}
                      </code>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMeetForm(true)}
                      className="text-xs font-bold text-gold hover:underline cursor-pointer"
                    >
                      Update Registration Details
                    </button>
                  </div>
                </div>
              )}

              {/* 3. ALUMNI MEET REGISTRATION FORM */}
              {showMeetForm && (
                <div className="rounded-2xl border border-border bg-background/80 p-6 sm:p-8 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-gold/10 text-gold grid place-items-center">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-foreground">
                          Alumni Meet Registration Form
                        </h4>
                        <span className="text-[11px] text-muted-foreground">
                          Submit your attendance and participation details for the alumni meet
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowMeetForm(false)}
                      className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleMeetSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Full Name <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={meetFormData.name}
                          onChange={(e) => handleMeetInputChange("name", e.target.value)}
                          className={`w-full rounded-xl border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                            meetFormErrors.name ? "border-red-500 bg-red-500/5" : "border-border"
                          }`}
                        />
                        {meetFormErrors.name && (
                          <p className="mt-1 text-xs text-red-400">{meetFormErrors.name}</p>
                        )}
                      </div>

                      {/* Batch */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Batch / Graduation Year <span className="text-amber-500">*</span>
                        </label>
                        <select
                          value={meetFormData.batch}
                          onChange={(e) => handleMeetInputChange("batch", e.target.value)}
                          className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          {ALUMNI_GRADUATION_YEARS.map((y) => (
                            <option
                              key={y}
                              value={y.toString()}
                              className="bg-card text-foreground"
                            >
                              Batch of {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Current Occupation */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Current Occupation <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={meetFormData.currentOccupation}
                          onChange={(e) =>
                            handleMeetInputChange("currentOccupation", e.target.value)
                          }
                          className={`w-full rounded-xl border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                            meetFormErrors.currentOccupation
                              ? "border-red-500 bg-red-500/5"
                              : "border-border"
                          }`}
                        />
                        {meetFormErrors.currentOccupation && (
                          <p className="mt-1 text-xs text-red-400">
                            {meetFormErrors.currentOccupation}
                          </p>
                        )}
                      </div>

                      {/* Attendance Mode */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Mode of Attendance <span className="text-amber-500">*</span>
                        </label>
                        <select
                          value={meetFormData.attendanceMode}
                          onChange={(e) =>
                            handleMeetInputChange(
                              "attendanceMode",
                              e.target.value as "In-Person" | "Virtual",
                            )
                          }
                          className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          <option value="In-Person" className="bg-card text-foreground">
                            In-Person (SOE CUSAT Campus)
                          </option>
                          <option value="Virtual" className="bg-card text-foreground">
                            Virtual (Online Live Stream)
                          </option>
                        </select>
                      </div>

                      {/* Email ID */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Email ID <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={meetFormData.email}
                          onChange={(e) => handleMeetInputChange("email", e.target.value)}
                          className={`w-full rounded-xl border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                            meetFormErrors.email ? "border-red-500 bg-red-500/5" : "border-border"
                          }`}
                        />
                        {meetFormErrors.email && (
                          <p className="mt-1 text-xs text-red-400">{meetFormErrors.email}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Contact Phone <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={meetFormData.phone}
                          onChange={(e) => handleMeetInputChange("phone", e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`w-full rounded-xl border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold ${
                            meetFormErrors.phone ? "border-red-500 bg-red-500/5" : "border-border"
                          }`}
                        />
                        {meetFormErrors.phone && (
                          <p className="mt-1 text-xs text-red-400">{meetFormErrors.phone}</p>
                        )}
                      </div>

                      {/* Accompanying Guests */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Accompanying Guests
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          value={meetFormData.guestsCount}
                          onChange={(e) =>
                            handleMeetInputChange(
                              "guestsCount",
                              Math.max(0, parseInt(e.target.value, 10) || 0),
                            )
                          }
                          className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold"
                        />
                      </div>

                      {/* Dietary Preference */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Dietary Preference
                        </label>
                        <select
                          value={meetFormData.dietaryPreference || "No Preference"}
                          onChange={(e) =>
                            handleMeetInputChange(
                              "dietaryPreference",
                              e.target.value as "Vegetarian" | "Non-Vegetarian" | "No Preference",
                            )
                          }
                          className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition min-h-[42px] focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          <option value="No Preference" className="bg-card text-foreground">
                            No Preference
                          </option>
                          <option value="Vegetarian" className="bg-card text-foreground">
                            Vegetarian
                          </option>
                          <option value="Non-Vegetarian" className="bg-card text-foreground">
                            Non-Vegetarian
                          </option>
                        </select>
                      </div>

                      {/* Notes / Suggestions */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                          Notes / Suggestions for the Alumni Meet (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={meetFormData.notes || ""}
                          onChange={(e) => handleMeetInputChange("notes", e.target.value)}
                          placeholder="e.g. Happy to mentor students during the session, or suggestions for venue arrangements."
                          className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-gold"
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingMeet}
                        className="inline-flex items-center gap-2 rounded-xl gradient-gold text-primary font-bold px-7 py-2.5 text-xs shadow-md transition hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer min-h-[42px]"
                      >
                        {isSubmittingMeet ? (
                          <>
                            <span className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Submit Registration</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMeetForm(false)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer min-h-[42px]"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
