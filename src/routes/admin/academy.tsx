import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GraduationCap, Edit, Eye, ExternalLink, CheckCircle2, Clock, Code } from "lucide-react";
import { mockAcademyTracks } from "@/data/mock/academy";
import type { AcademyTrack } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/academy")({
  head: () => ({
    meta: [
      { title: "Academy Tracks Management — MESAC Admin" },
      {
        name: "description",
        content:
          "Manage the 6 technical skill development tracks, curriculum modules, and enrollment info.",
      },
    ],
  }),
  component: AdminAcademyPage,
});

export function AdminAcademyPage() {
  const [tracks, setTracks] = useState<AcademyTrack[]>(mockAcademyTracks);
  const [editingTrack, setEditingTrack] = useState<AcademyTrack | null>(null);
  const [previewTrack, setPreviewTrack] = useState<AcademyTrack | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    trackCode: "",
    level: "Intermediate" as "Beginner" | "Intermediate" | "Advanced",
    duration: "6 Weeks",
    description: "",
    enrollmentUrl: "https://forms.gle/mesac-academy-registration",
    modules: "3D CAD Modeling, FEA Stress Analysis, Thermal Simulation, Report Generation",
  });

  const handleOpenEdit = (t: AcademyTrack) => {
    setEditingTrack(t);
    setFormData({
      title: t.title || t.n || "",
      trackCode: t.trackCode || t.t || "",
      level: t.level || "Intermediate",
      duration: t.duration || "6 Weeks",
      description: t.description || t.d || "",
      enrollmentUrl: t.enrollmentUrl || "https://forms.gle/mesac-academy-registration",
      modules: (t.modules || t.tools || []).join(", "),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;

    const moduleArray = formData.modules
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    setTracks((prev) =>
      prev.map((t) =>
        t.id === editingTrack.id
          ? {
              ...t,
              title: formData.title,
              n: formData.title,
              trackCode: formData.trackCode,
              t: formData.trackCode,
              level: formData.level,
              duration: formData.duration,
              description: formData.description,
              d: formData.description,
              enrollmentUrl: formData.enrollmentUrl,
              modules: moduleArray,
              tools: moduleArray,
            }
          : t,
      ),
    );
    setEditingTrack(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Academy Tracks Management"
          description="Manage curriculum, software tools, prerequisites, and registration links for the 6 official technical tracks."
        />

        {/* 6 Skill Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tracks.map((track) => {
            const title = track.title || track.n || "Technical Track";
            const code = track.trackCode || track.t || "TRACK";
            const desc = track.description || track.d || "";
            const tools = track.modules || track.tools || [];

            return (
              <div
                key={track.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#7c1d28] dark:text-amber-400 bg-[#7c1d28]/10 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {code}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{track.duration || "6 Weeks"}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                    {title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {desc}
                  </p>

                  <div className="pt-2">
                    <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1.5">
                      Curriculum Tools & Modules
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tools.slice(0, 4).map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewTrack(track)}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Card</span>
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(track)}
                    className="text-xs h-8 rounded-xl"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    <span>Edit Track</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Track Modal */}
      <Dialog open={editingTrack !== null} onOpenChange={(open) => !open && setEditingTrack(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Academy Track</DialogTitle>
            <DialogDescription className="text-xs">
              Update track syllabus, duration, tools, and student enrollment forms.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Track Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Track Code</Label>
                <Input
                  value={formData.trackCode}
                  onChange={(e) => setFormData({ ...formData, trackCode: e.target.value })}
                  className="text-xs h-9 rounded-xl font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Enrollment Form URL</Label>
              <Input
                type="url"
                value={formData.enrollmentUrl}
                onChange={(e) => setFormData({ ...formData, enrollmentUrl: e.target.value })}
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Modules / Tools (Comma-separated)</Label>
              <Input
                value={formData.modules}
                onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Track Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingTrack(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#7c1d28] text-white text-xs font-bold rounded-xl"
              >
                Save Track
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewTrack !== null} onOpenChange={(open) => !open && setPreviewTrack(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[#7c1d28] dark:text-amber-400 bg-[#7c1d28]/10 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">
              {previewTrack?.trackCode || previewTrack?.t}
            </span>
            <h4 className="font-bold text-lg">{previewTrack?.title || previewTrack?.n}</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {previewTrack?.description || previewTrack?.d}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
