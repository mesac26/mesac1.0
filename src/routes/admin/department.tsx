import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Building2,
  Users,
  GraduationCap,
  FlaskConical,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  ShieldAlert,
  Save,
} from "lucide-react";
import {
  mockFacultyList,
  mockPrograms,
  mockLabs,
  mockDepartmentOverview,
} from "@/data/mock/department";
import type { FacultyMember, DepartmentProgram, Lab } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/department")({
  head: () => ({
    meta: [
      { title: "Department & Faculty Management — MESAC Admin" },
      {
        name: "description",
        content:
          "Manage SOE Mechanical Division information, faculty directory, programs, and labs.",
      },
    ],
  }),
  component: AdminDepartmentPage,
});

export function AdminDepartmentPage() {
  const [activeTab, setActiveTab] = useState<"faculty" | "overview" | "programs" | "labs">(
    "faculty",
  );
  const [faculty, setFaculty] = useState<FacultyMember[]>(mockFacultyList);
  const [programs, setPrograms] = useState<DepartmentProgram[]>(mockPrograms);
  const [labs, setLabs] = useState<Lab[]>(mockLabs);
  const [overview, setOverview] = useState(mockDepartmentOverview);

  // Faculty modal state
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [deletingFacultyId, setDeletingFacultyId] = useState<string | null>(null);

  const [facultyForm, setFacultyForm] = useState({
    name: "",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering",
    email: "",
    phone: "",
    specialization: "",
    showContact: false, // DEFAULT MUST BE HIDDEN
  });

  const handleOpenAddFaculty = () => {
    setFacultyForm({
      name: "",
      designation: "Assistant Professor",
      role: "Assistant Professor",
      department: "Division of Mechanical Engineering",
      email: "",
      phone: "",
      specialization: "",
      showContact: false, // Default is hidden
    });
    setIsAddFacultyOpen(true);
  };

  const handleOpenEditFaculty = (f: FacultyMember) => {
    setEditingFaculty(f);
    setFacultyForm({
      name: f.name,
      designation: f.designation,
      role: f.role,
      department: f.department,
      email: f.email || "",
      phone: f.phone || "",
      specialization: f.specialization || "",
      showContact: f.showContact ?? false,
    });
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      setFaculty((prev) =>
        prev.map((item) =>
          item.id === editingFaculty.id
            ? {
                ...item,
                name: facultyForm.name,
                designation: facultyForm.designation,
                role: facultyForm.role,
                email: facultyForm.email,
                phone: facultyForm.phone,
                specialization: facultyForm.specialization,
                showContact: facultyForm.showContact,
              }
            : item,
        ),
      );
      setEditingFaculty(null);
    } else {
      const newF: FacultyMember = {
        id: `fac-${Date.now()}`,
        name: facultyForm.name,
        designation: facultyForm.designation,
        role: facultyForm.role,
        department: facultyForm.department,
        email: facultyForm.email,
        phone: facultyForm.phone,
        specialization: facultyForm.specialization,
        showContact: facultyForm.showContact,
        img: "/images/team/faculty.png",
      };
      setFaculty((prev) => [newF, ...prev]);
      setIsAddFacultyOpen(false);
    }
  };

  const handleDeleteFaculty = () => {
    if (deletingFacultyId) {
      setFaculty((prev) => prev.filter((f) => f.id !== deletingFacultyId));
      setDeletingFacultyId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Department & Faculty Management"
          description="Manage official information for the Division of Mechanical Engineering, School of Engineering, CUSAT."
        >
          {activeTab === "faculty" && (
            <Button
              onClick={handleOpenAddFaculty}
              className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Add Faculty Member</span>
            </Button>
          )}
        </AdminPageHeader>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("faculty")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "faculty"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Faculty Directory ({faculty.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "overview"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Department & HOD</span>
          </button>
          <button
            onClick={() => setActiveTab("programs")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "programs"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Academic Programs</span>
          </button>
          <button
            onClick={() => setActiveTab("labs")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "labs"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            <span>Laboratories</span>
          </button>
        </div>

        {/* Tab 1: Faculty */}
        {activeTab === "faculty" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="p-3 pl-4">Name</th>
                    <th className="p-3">Designation / Role</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3">Contact Privacy</th>
                    <th className="p-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {faculty.map((f) => (
                    <tr key={f.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                      <td className="p-3 pl-4 font-bold text-neutral-900 dark:text-neutral-100">
                        {f.name}
                      </td>
                      <td className="p-3 text-neutral-700 dark:text-neutral-300 font-medium">
                        {f.designation}
                      </td>
                      <td className="p-3 text-neutral-500 max-w-xs truncate">
                        {f.specialization || "Thermal / Design"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            f.showContact
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                          }`}
                        >
                          {f.showContact ? "Public" : "Hidden (Default)"}
                        </span>
                      </td>
                      <td className="p-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditFaculty(f)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingFacultyId(f.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Overview & HOD */}
        {activeTab === "overview" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              Department Overview & Head of Division
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department Title</Label>
                <Input
                  value={overview.name}
                  onChange={(e) => setOverview({ ...overview, name: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Established Year</Label>
                <Input
                  type="number"
                  value={overview.establishedYear}
                  onChange={(e) =>
                    setOverview({ ...overview, establishedYear: parseInt(e.target.value) || 1995 })
                  }
                  className="text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold">Summary & History</Label>
                <Textarea
                  rows={4}
                  value={overview.summary}
                  onChange={(e) => setOverview({ ...overview, summary: e.target.value })}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Programs */}
        {activeTab === "programs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7c1d28] text-white">
                    {prog.degree}
                  </span>
                  <span className="text-xs text-neutral-500 font-semibold">{prog.duration}</span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {prog.name}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{prog.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Labs */}
        {activeTab === "labs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-2"
              >
                <FlaskConical className="h-6 w-6 text-amber-500 mb-1" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {lab.name}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{lab.description}</p>
                <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  Location: {lab.location}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faculty Add / Edit Dialog */}
      <Dialog
        open={isAddFacultyOpen || editingFaculty !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddFacultyOpen(false);
            setEditingFaculty(null);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingFaculty ? "Edit Faculty Member" : "Add Faculty Member"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveFaculty} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Faculty Name *</Label>
              <Input
                value={facultyForm.name}
                onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Input
                  value={facultyForm.designation}
                  onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Specialization</Label>
                <Input
                  value={facultyForm.specialization}
                  onChange={(e) =>
                    setFacultyForm({ ...facultyForm, specialization: e.target.value })
                  }
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            {/* Privacy compliance: default hidden */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Public Contact Visibility
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Default is hidden. Keep email/phone confidential.
                  </div>
                </div>
                <Switch
                  checked={facultyForm.showContact}
                  onCheckedChange={(val) => setFacultyForm({ ...facultyForm, showContact: val })}
                />
              </div>
              {facultyForm.showContact && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
                  <Input
                    type="email"
                    placeholder="Institutional Email"
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    className="text-xs h-8 rounded-lg"
                  />
                  <Input
                    placeholder="Department Phone Extension"
                    value={facultyForm.phone}
                    onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
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
                  setIsAddFacultyOpen(false);
                  setEditingFaculty(null);
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
                {editingFaculty ? "Save Changes" : "Save Faculty"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingFacultyId !== null}
        title="Delete Faculty Member"
        description="Are you sure you want to remove this faculty member from the directory?"
        onConfirm={handleDeleteFaculty}
        onClose={() => setDeletingFacultyId(null)}
      />
    </AdminLayout>
  );
}
