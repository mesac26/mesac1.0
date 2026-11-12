import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Users,
  Plus,
  Archive,
  Calendar,
  Trash2,
  Edit,
  Mail,
  Linkedin,
  Eye,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { mockTeamMembers, mockAcademicYears } from "@/data/mock/team";
import type { TeamMember, TeamRoleTier } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Committee & Team Management — MESAC Admin" },
      {
        name: "description",
        content: "Manage executive committee, student leads, and academic year archives.",
      },
    ],
  }),
  component: AdminTeamPage,
});

export function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [activeYear, setActiveYear] = useState<string>("2026-27");
  const [viewMode, setViewMode] = useState<"current" | "archived">("current");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [previewMember, setPreviewMember] = useState<TeamMember | null>(null);
  const [isNewYearModalOpen, setIsNewYearModalOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState("2027-28");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    tier: "core" as TeamRoleTier,
    academicYear: "2026-27",
    img: "/images/team/president.jpg",
    email: "",
    linkedin: "",
    showContactPublicly: false, // Default MUST be hidden
  });

  const displayedMembers = members.filter((m) =>
    viewMode === "current" ? m.academicYear === "2026-27" : m.academicYear !== "2026-27",
  );

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      role: "",
      tier: "core",
      academicYear: activeYear,
      img: "/images/team/president.jpg",
      email: "",
      linkedin: "",
      showContactPublicly: false, // Default is hidden
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      tier: m.tier,
      academicYear: m.academicYear,
      img: m.img,
      email: m.email || "",
      linkedin: m.linkedin || "",
      showContactPublicly: false, // Default is hidden
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: formData.name,
                role: formData.role,
                tier: formData.tier,
                academicYear: formData.academicYear,
                img: formData.img,
                email: formData.email,
                linkedin: formData.linkedin,
              }
            : m,
        ),
      );
      setEditingMember(null);
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        tier: formData.tier,
        academicYear: formData.academicYear,
        img: formData.img,
        email: formData.email,
        linkedin: formData.linkedin,
      };
      setMembers((prev) => [newMember, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingMemberId) {
      setMembers((prev) => prev.filter((m) => m.id !== deletingMemberId));
      setDeletingMemberId(null);
    }
  };

  const handleStartNewYear = () => {
    // Archive current committee to historical records
    // Note: Frontend state only, does not delete
    setActiveYear(newYearInput);
    setIsNewYearModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Committee & Team Management"
          description="Manage current office bearers, faculty advisors, and historical committee archives."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewYearModalOpen(true)}
              className="text-xs h-9 rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-300"
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Start New Academic Year</span>
            </Button>
            <Button
              onClick={handleOpenAdd}
              className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Add Member</span>
            </Button>
          </div>
        </AdminPageHeader>

        {/* View Toggle */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setViewMode("current")}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === "current"
                ? "bg-[#7c1d28] text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Current Committee ({activeYear})
          </button>
          <button
            onClick={() => setViewMode("archived")}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === "archived"
                ? "bg-[#7c1d28] text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Historical Archives ({mockAcademicYears.length} Batches)
          </button>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-48 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 text-white backdrop-blur-xs">
                      {member.tier}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {member.name}
                  </h4>
                  <p className="text-xs text-[#7c1d28] dark:text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                    {member.role}
                  </p>
                  <div className="text-[11px] text-neutral-500 pt-1">
                    Academic Year: {member.academicYear}
                  </div>
                </div>
              </div>

              <div className="p-3 px-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => setPreviewMember(member)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Card</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Edit member"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingMemberId(member.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Delete member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start New Academic Year Modal */}
      <Dialog open={isNewYearModalOpen} onOpenChange={setIsNewYearModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Start New Academic Year</span>
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              This workflow will archive the current committee ({activeYear}) into the historical
              records before creating the new leadership council. Existing member records are
              preserved and never deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label className="text-xs font-semibold">New Academic Year Period</Label>
            <Input
              value={newYearInput}
              onChange={(e) => setNewYearInput(e.target.value)}
              placeholder="e.g. 2027-28"
              className="text-xs h-9 rounded-xl font-mono"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewYearModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleStartNewYear}
              className="bg-[#7c1d28] text-white text-xs font-bold rounded-xl"
            >
              Archive & Start Year
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Member Dialog */}
      <Dialog
        open={isAddModalOpen || editingMember !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingMember(null);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingMember ? "Edit Committee Member" : "Add Committee Member"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Designation / Role *</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. President, Secretary, Technical Lead"
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Role Tier</Label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value as TeamRoleTier })
                  }
                  className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="advisor">Faculty Advisor</option>
                  <option value="core">Core Executive</option>
                  <option value="lead">Lead / Head</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="member">Member</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Academic Year</Label>
                <Input
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            {/* Privacy Compliance Section: Default MUST be hidden */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Contact Visibility
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Default is hidden to protect student privacy.
                  </div>
                </div>
                <Switch
                  checked={formData.showContactPublicly}
                  onCheckedChange={(val) => setFormData({ ...formData, showContactPublicly: val })}
                />
              </div>
              {formData.showContactPublicly && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                  <Input
                    placeholder="Institutional Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-xs h-8 rounded-lg"
                  />
                  <Input
                    placeholder="LinkedIn Profile URL"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="text-xs h-8 rounded-lg"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingMember(null);
                }}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#7c1d28] text-white text-xs font-bold rounded-xl"
              >
                {editingMember ? "Save Changes" : "Save Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Member Card Preview Modal */}
      <Dialog
        open={previewMember !== null}
        onOpenChange={(open) => !open && setPreviewMember(null)}
      >
        <DialogContent className="max-w-xs text-center rounded-3xl p-6">
          <div className="h-32 w-32 mx-auto rounded-full overflow-hidden border-2 border-[#7c1d28] p-1 shadow-md">
            <img
              src={previewMember?.img}
              alt={previewMember?.name}
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <h4 className="font-bold text-base mt-3">{previewMember?.name}</h4>
          <p className="text-xs text-[#7c1d28] dark:text-amber-400 font-bold uppercase tracking-wider">
            {previewMember?.role}
          </p>
          <p className="text-[11px] text-neutral-400">{previewMember?.academicYear}</p>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingMemberId !== null}
        title="Remove Committee Member"
        description="Are you sure you want to remove this member? This will delete their public profile card."
        onConfirm={handleDelete}
        onClose={() => setDeletingMemberId(null)}
      />
    </AdminLayout>
  );
}
