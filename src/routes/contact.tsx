import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import {
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Compass,
  Building2,
  Navigation,
  Copy,
  Check,
  Linkedin,
  UserCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Location — MESAC CUSAT" },
      {
        name: "description",
        content:
          "Contact MESAC — Division of Mechanical Engineering, School of Engineering, Cochin University of Science and Technology (CUSAT), Kochi, Kerala.",
      },
      { property: "og:title", content: "Contact MESAC CUSAT" },
      {
        property: "og:description",
        content: "Get in touch with the MESAC team, direct helplines, and campus location map.",
      },
    ],
  }),
  component: ContactPage,
});

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const INITIAL_FORM: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ContactFormValues>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mesactechnical@gmail.com");
    setCopiedEmail(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validateForm = (): boolean => {
    const errors: ContactFormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Please enter your name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Frontend-only simulation: does not connect to email or backend API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setLastSubmittedName(formData.name.trim());
      toast.success("Message Recorded (Prototype)", {
        description: "Your message has been received in this frontend prototype.",
      });
    }, 450);
  };

  return (
    <Layout>
      <PageHero
        variant="contact"
        eyebrow="Reach Out To Us"
        title={
          <>
            Contact <span className="italic text-gold">MESAC CUSAT.</span>
          </>
        }
        subtitle="Connect with the Mechanical Engineering Students Association at School of Engineering, CUSAT."
      />

      {/* QUICK CONTACT CHANNELS */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
          <div className="grid gap-6 md:grid-cols-3">
            {/* OFFICIAL EMAIL & SECRETARY HELPLINE */}
            <Reveal delay={40}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8 card-lift flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold grid place-items-center font-bold">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                        Official Contact Email
                      </div>
                      <a
                        href="mailto:mesactechnical@gmail.com"
                        className="font-display text-base font-extrabold text-foreground hover:text-gold transition break-all"
                      >
                        mesactechnical@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground pt-3 border-t border-border/60">
                    <div className="flex items-center gap-2 font-mono text-foreground font-semibold">
                      <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>KALIDASAN - 8921552313</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Division of Mechanical Engineering, School of Engineering, CUSAT.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <a
                    href="mailto:mesactechnical@gmail.com"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl gradient-gold py-2.5 px-4 text-xs font-bold text-primary shadow-sm hover:brightness-105 active:scale-95 transition min-h-[38px]"
                  >
                    <span>Send Mail</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-secondary/60 hover:bg-secondary p-2.5 text-xs font-semibold text-foreground transition cursor-pointer min-h-[38px] min-w-[38px]"
                    title="Copy Email Address"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </Reveal>

            {/* HELPLINE & STUDENT CONTACTS */}
            <Reveal delay={80}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8 card-lift flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold grid place-items-center font-bold">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                        Website & Enquiries
                      </div>
                      <div className="font-display text-base font-extrabold text-foreground">
                        Direct Helpline Numbers
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-border/60 font-mono text-xs">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>ASHISH - 60066 20730</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>AIBEL JOY - 90617 40269</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="tel:+916006620730"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/80 hover:bg-secondary py-2.5 px-4 text-xs font-bold text-foreground transition min-h-[38px]"
                  >
                    <Phone className="h-3.5 w-3.5 text-gold" />
                    <span>Call Helpline</span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* DIVISION LEADERSHIP */}
            <Reveal delay={120}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8 card-lift flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold grid place-items-center font-bold">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                        Division Leadership
                      </div>
                      <div className="font-display text-base font-extrabold text-foreground">
                        Faculty Advisor & Core Team
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5 pt-3 border-t border-border/60 text-xs">
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-gold">
                        Head of Division & Faculty Advisor
                      </div>
                      <div className="font-semibold text-foreground">Dr. BIJU N</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                      <div>
                        <div className="text-[10px] font-mono uppercase font-bold text-gold">
                          President
                        </div>
                        <div className="font-semibold text-foreground">JAANAKY RENGITH</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase font-bold text-gold">
                          Secretary
                        </div>
                        <div className="font-semibold text-foreground">KALIDASAN V R</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-gold font-semibold pt-2">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">Division of Mechanical Engineering, CUSAT</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FRONTEND CONTACT MESSAGE FORM */}
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold">
                <MessageSquare className="h-4 w-4" />
                <span>Message Inquiries</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Leave a Note for <span className="italic text-gold">MESAC</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Have a query regarding Yantra events, academy workshops, alumni coordination, or
                department initiatives? Fill out the form below or contact our student leads
                directly.
              </p>
              <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground space-y-1.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-gold" />
                  <span>Frontend Prototype Note</span>
                </div>
                <p>
                  This form is currently a frontend prototype. Submissions are validated locally in
                  your browser. For immediate correspondence, email{" "}
                  <a href="mailto:mesactechnical@gmail.com" className="text-gold underline">
                    mesactechnical@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lift">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                        Frontend Prototype Recorded
                      </span>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Message Received!
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-foreground">{lastSubmittedName}</strong>!
                      Your inquiry has been recorded in this frontend demo. For official responses,
                      please reach out via{" "}
                      <code className="text-gold">mesactechnical@gmail.com</code>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData(INITIAL_FORM);
                      }}
                      className="mt-2 rounded-xl gradient-gold text-primary font-bold px-6 py-2.5 text-xs transition hover:brightness-105 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                        >
                          Your Name <span className="text-gold">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            if (formErrors.name)
                              setFormErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="e.g. Sandra VM"
                          aria-invalid={Boolean(formErrors.name)}
                          aria-describedby={formErrors.name ? "name-err" : undefined}
                          className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                            formErrors.name ? "border-red-500/80" : "border-border"
                          }`}
                        />
                        {formErrors.name && (
                          <p
                            id="name-err"
                            className="mt-1 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            <span>{formErrors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                        >
                          Email Address <span className="text-gold">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, email: e.target.value }));
                            if (formErrors.email)
                              setFormErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="sandra@cusat.ac.in"
                          aria-invalid={Boolean(formErrors.email)}
                          aria-describedby={formErrors.email ? "email-err" : undefined}
                          className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                            formErrors.email ? "border-red-500/80" : "border-border"
                          }`}
                        />
                        {formErrors.email && (
                          <p
                            id="email-err"
                            className="mt-1 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            <span>{formErrors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Subject / Query Topic <span className="text-gold">*</span>
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, subject: e.target.value }));
                          if (formErrors.subject)
                            setFormErrors((prev) => ({ ...prev, subject: undefined }));
                        }}
                        placeholder="e.g. Yantra Techfest / CAD Workshop Inquiry"
                        aria-invalid={Boolean(formErrors.subject)}
                        aria-describedby={formErrors.subject ? "sub-err" : undefined}
                        className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition min-h-[42px] ${
                          formErrors.subject ? "border-red-500/80" : "border-border"
                        }`}
                      />
                      {formErrors.subject && (
                        <p
                          id="sub-err"
                          className="mt-1 text-xs text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.subject}</span>
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1"
                      >
                        Message <span className="text-gold">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, message: e.target.value }));
                          if (formErrors.message)
                            setFormErrors((prev) => ({ ...prev, message: undefined }));
                        }}
                        placeholder="Write your inquiry or question here..."
                        aria-invalid={Boolean(formErrors.message)}
                        aria-describedby={formErrors.message ? "msg-err" : undefined}
                        className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-gold transition ${
                          formErrors.message ? "border-red-500/80" : "border-border"
                        }`}
                      />
                      {formErrors.message && (
                        <p
                          id="msg-err"
                          className="mt-1 text-xs text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          <span>{formErrors.message}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto rounded-xl gradient-gold text-primary font-bold px-8 py-3 text-xs shadow-glass hover:brightness-105 active:scale-95 transition cursor-pointer min-h-[42px] disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          <span>Recording Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* OFFICIAL PORTALS & SOCIAL HANDLES */}
          <Reveal delay={140}>
            <div className="rounded-3xl border border-border bg-secondary/30 p-8 text-center space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Official CUSAT Portals & Social Handles
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://www.instagram.com/mesa_cusat?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:border-gold hover:text-gold shadow-sm transition"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-500" />
                  <span>Instagram</span>
                  <ExternalLink className="h-3.5 w-3.5 text-gold" />
                </a>

                <a
                  href="https://www.linkedin.com/company/mesa-cusat"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:border-gold hover:text-gold shadow-sm transition"
                >
                  <Linkedin className="h-4 w-4 text-blue-500" />
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3.5 w-3.5 text-gold" />
                </a>

                <a
                  href="https://soe.cusat.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:border-gold hover:text-gold shadow-sm transition"
                >
                  <span>SOE CUSAT Website</span>
                  <ExternalLink className="h-3.5 w-3.5 text-gold" />
                </a>

                <a
                  href="https://admissions.cusat.ac.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:border-gold hover:text-gold shadow-sm transition"
                >
                  <span>CUSAT Admissions Portal</span>
                  <ExternalLink className="h-3.5 w-3.5 text-gold" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LOCATION & CAMPUS MAP SECTION */}
      <section className="py-16 bg-secondary/20 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Reveal>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-extrabold text-gold uppercase tracking-wider mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Campus Location</span>
                  </div>
                  <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                    Visit Us At CUSAT Campus
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Located at the heart of Cochin University of Science and Technology in
                    Kalamassery, Kochi.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        Complete Postal Address
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Division of Mechanical Engineering,
                        <br />
                        School of Engineering, CUSAT,
                        <br />
                        Kalamassery, Cochin — 682022, Kerala, India
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-border/60">
                    <Compass className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-foreground">Key Landmarks</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Adjacent to CUSAT University Library & South Campus Main Gate.
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=School+of+Engineering+CUSAT+Kalamassery"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full gradient-gold px-6 py-3 text-xs font-bold text-primary shadow-lg hover:brightness-105 transition"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions On Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl h-[380px] sm:h-[420px] relative">
                  <iframe
                    title="CUSAT School of Engineering Map Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.9888200259837!2d76.3262693758364!3d10.038379272718131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c36395b2909%3A0xe107d6124504c553!2sSchool%20of%20Engineering%2C%20CUSAT!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="w-full h-full border-0 grayscale opacity-90 contrast-125 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
