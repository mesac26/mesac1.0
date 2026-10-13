import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Sparkles, Save, Upload, Bell, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/home")({
  head: () => ({
    meta: [
      { title: "Home Page Content Editor — MESAC Admin" },
      {
        name: "description",
        content:
          "Configure hero copy, highlighted stats, banner announcements, and featured items.",
      },
    ],
  }),
  component: AdminHomePageEditor,
});

export function AdminHomePageEditor() {
  const [heroTitle, setHeroTitle] = useState("MESAC 2026");
  const [heroTagline, setHeroTagline] = useState(
    "Mechanical Engineering Students' Association · School of Engineering, CUSAT",
  );
  const [heroDescription, setHeroDescription] = useState(
    "A premier engineering association dedicated to technical innovation, Formula student racing, industrial robotics, and academic excellence.",
  );

  // Announcement Banner
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [announcementText, setAnnouncementText] = useState(
    "Academic Archive Live: Access 2019 Scheme Previous Year Question Papers & Syllabi directly.",
  );
  const [announcementLink, setAnnouncementLink] = useState("/archive");

  // Highlighted Stats
  const [stats, setStats] = useState([
    { label: "Founded", value: "1995" },
    { label: "Active Members", value: "450+" },
    { label: "Workshops Hosted", value: "35+" },
    { label: "Archive QP Records", value: "120+" },
  ]);

  const handleStatChange = (index: number, field: "label" | "value", val: string) => {
    setStats((prev) => prev.map((s, idx) => (idx === index ? { ...s, [field]: val } : s)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Home page content updated in local state (Backend sync pending).");
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6">
        <AdminPageHeader
          title="Home Page Content Management"
          description="Edit public landing page headlines, hero banners, statistics, and announcement bars."
        >
          <Button
            type="submit"
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4 shadow-xs"
          >
            <Save className="h-4 w-4 mr-1.5" />
            <span>Save Home Content</span>
          </Button>
        </AdminPageHeader>

        {/* Section 1: Announcement Banner */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Top Announcement Banner
              </h3>
            </div>
            <Switch checked={announcementEnabled} onCheckedChange={setAnnouncementEnabled} />
          </div>

          {announcementEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold">Announcement Text</Label>
                <Input
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Destination Link</Label>
                <Input
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Hero Section Content */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
            Hero Headline & Intro Copy
          </h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hero Heading</Label>
              <Input
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="text-xs h-9 rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Association Subheading</Label>
              <Input
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                className="text-xs h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Introductory Description</Label>
              <Textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Highlighted Statistics */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Highlighted Statistics Cards
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((st, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2"
              >
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-neutral-400">
                    Metric Value
                  </Label>
                  <Input
                    value={st.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    className="text-xs h-8 rounded-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-neutral-400">Label</Label>
                  <Input
                    value={st.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    className="text-xs h-8 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
