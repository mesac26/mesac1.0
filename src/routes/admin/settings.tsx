import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Settings,
  Globe,
  Share2,
  Palette,
  Shield,
  Save,
  CheckCircle2,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { mockSiteSettings } from "@/data/mock/site";
import type { SiteSettings } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Site Settings — MESAC Admin" },
      {
        name: "description",
        content:
          "Configure official association details, social links, theme tokens, and privacy controls.",
      },
    ],
  }),
  component: AdminSettingsPage,
});

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "social" | "appearance" | "privacy">(
    "general",
  );

  // General Settings
  const [siteName, setSiteName] = useState(mockSiteSettings.siteName);
  const [orgName, setOrgName] = useState(mockSiteSettings.organizationName);
  const [tagline, setTagline] = useState(mockSiteSettings.tagline);
  const [contactEmail, setContactEmail] = useState(mockSiteSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(
    mockSiteSettings.contactPhone || "+91 484 2862615",
  );
  const [officeAddress, setOfficeAddress] = useState(mockSiteSettings.officeAddress);

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://www.instagram.com/mesa_cusat",
    linkedin: "https://www.linkedin.com/company/mesa-cusat",
    youtube: "https://youtube.com/@mesacusat",
    whatsapp: "",
  });

  // Privacy Settings (Default MUST be hidden)
  const [hideStudentPhones, setHideStudentPhones] = useState(true);
  const [hideStudentEmails, setHideStudentEmails] = useState(true);
  const [hideFacultyPhones, setHideFacultyPhones] = useState(true);
  const [requireTurnstile, setRequireTurnstile] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings updated in local state (Backend sync pending).");
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6">
        <AdminPageHeader
          title="Site & Association Settings"
          description="Manage institutional branding, official contacts, social links, and public privacy policies."
        >
          <Button
            type="submit"
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            <Save className="h-4 w-4 mr-1.5" />
            <span>Save Settings</span>
          </Button>
        </AdminPageHeader>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "general"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>General</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "social"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Social Links</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "appearance"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>Appearance & Brand</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "privacy"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>Privacy Defaults</span>
          </button>
        </div>

        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="h-16 w-16 rounded-2xl bg-[#7c1d28] p-3 flex items-center justify-center border border-white/20 shadow-sm">
                <img
                  src="/mesac-logo-real.png"
                  alt="MESAC"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Official Association Emblem
                </h4>
                <p className="text-xs text-neutral-500">
                  PNG format, transparent background. Asset located at /public/mesac-logo-real.png
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Portal Name</Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Organization Title</Label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold">Official Tagline</Label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Email</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department Phone</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold">Office Address</Label>
                <Textarea
                  rows={2}
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Social Links */}
        {activeTab === "social" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Verified Social Profiles
            </h3>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <span>Instagram Profile URL</span>
                </Label>
                <Input
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Linkedin className="h-4 w-4 text-sky-600" />
                  <span>LinkedIn Organization URL</span>
                </Label>
                <Input
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Youtube className="h-4 w-4 text-red-600" />
                  <span>YouTube Channel URL</span>
                </Label>
                <Input
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Appearance */}
        {activeTab === "appearance" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                MESAC University Brand Tokens
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Colours, typography, and contrast tokens configured according to the engineering
                association requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="h-10 w-full rounded-xl bg-[#7c1d28] border border-black/10" />
                <div className="text-xs font-bold">Deep Maroon</div>
                <div className="font-mono text-[11px] text-neutral-500">#7c1d28 (Primary)</div>
              </div>

              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="h-10 w-full rounded-xl bg-[#c59b27] border border-black/10" />
                <div className="text-xs font-bold">Restrained Gold</div>
                <div className="font-mono text-[11px] text-neutral-500">#c59b27 (Accent)</div>
              </div>

              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="h-10 w-full rounded-xl bg-[#faf9f6] border border-neutral-300 dark:bg-[#121214]" />
                <div className="text-xs font-bold">Neutral Surface</div>
                <div className="font-mono text-[11px] text-neutral-500">Off-white / Charcoal</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Privacy Defaults (MANDATORY REQUIREMENT) */}
        {activeTab === "privacy" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Contact Privacy & Data Protection Defaults</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Requirements mandate that personal contact details default to hidden to prevent
                accidental exposure of student or faculty information.
              </p>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 space-y-4 pt-2">
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Hide Student Phone Numbers by Default
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Never expose personal mobile numbers on public committee cards.
                  </div>
                </div>
                <Switch checked={hideStudentPhones} onCheckedChange={setHideStudentPhones} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Hide Student Personal Email Addresses by Default
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Only institutional department emails can be surfaced if explicitly permitted.
                  </div>
                </div>
                <Switch checked={hideStudentEmails} onCheckedChange={setHideStudentEmails} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Hide Faculty Direct Phones
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Direct numbers remain confidential unless department extension is provided.
                  </div>
                </div>
                <Switch checked={hideFacultyPhones} onCheckedChange={setHideFacultyPhones} />
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
