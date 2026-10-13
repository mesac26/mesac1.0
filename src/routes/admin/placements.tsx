import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Briefcase, Plus, Search, Edit, Trash2, Building, Eye, AlertCircle } from "lucide-react";
import { mockPlacements } from "@/data/mock/placements";
import type { Placement } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/placements")({
  head: () => ({
    meta: [
      { title: "Placements Management — MESAC Admin" },
      {
        name: "description",
        content:
          "Track student corporate recruitments, core mechanical offers, and batch statistics.",
      },
    ],
  }),
  component: AdminPlacementsPage,
});

export function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>(mockPlacements);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Placement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentName: "",
    company: "",
    role: "Graduate Engineer Trainee",
    academicYear: "2025-26",
    packageLpa: 8.5,
    category: "Core Mechanical",
  });

  const batches = useMemo(() => {
    return Array.from(new Set(placements.map((p) => p.academicYear)))
      .sort()
      .reverse();
  }, [placements]);

  const filtered = useMemo(() => {
    return placements.filter((p) => {
      const matchesBatch = selectedBatch === "all" || p.academicYear === selectedBatch;
      const matchesSearch =
        (p.studentName && p.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.role && p.role.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesBatch && matchesSearch;
    });
  }, [placements, selectedBatch, searchQuery]);

  const handleOpenAdd = () => {
    setFormData({
      studentName: "",
      company: "",
      role: "Graduate Engineer Trainee",
      academicYear: batches[0] || "2025-26",
      packageLpa: 8.5,
      category: "Core Mechanical",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Placement) => {
    setEditingItem(p);
    setFormData({
      studentName: p.studentName || "",
      company: p.company,
      role: p.role || "",
      academicYear: p.academicYear,
      packageLpa: typeof p.packageLpa === "number" ? p.packageLpa : 8,
      category: p.category || "Core Mechanical",
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setPlacements((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                studentName: formData.studentName,
                company: formData.company,
                role: formData.role,
                academicYear: formData.academicYear,
                packageLpa: formData.packageLpa,
                category: formData.category,
              }
            : i,
        ),
      );
      setEditingItem(null);
    } else {
      const newItem: Placement = {
        id: `plc-${Date.now()}`,
        studentName: formData.studentName,
        company: formData.company,
        role: formData.role,
        academicYear: formData.academicYear,
        packageLpa: formData.packageLpa,
        category: formData.category,
      };
      setPlacements((prev) => [newItem, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      setPlacements((prev) => prev.filter((i) => i.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Placements Management"
          description="Manage corporate campus recruitments, offers, companies, and batch placement records."
        >
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Placement Record</span>
          </Button>
        </AdminPageHeader>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
              <Input
                placeholder="Search by student name, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  Batch {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3 pl-4">Student Name</th>
                  <th className="p-3">Recruiting Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="p-3 pl-4 font-bold text-neutral-900 dark:text-neutral-100">
                      {item.studentName || "Placed Student"}
                    </td>
                    <td className="p-3 font-semibold text-[#7c1d28] dark:text-amber-400">
                      {item.company}
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400">
                      {item.role || "Core Engineer"}
                    </td>
                    <td className="p-3">{item.academicYear}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {item.category || "Mechanical"}
                      </span>
                    </td>
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
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
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={isAddModalOpen || editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingItem ? "Edit Placement Record" : "Add Placement Record"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Student Name *</Label>
              <Input
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Company Name *</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Batch / Year</Label>
                <Input
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Designation</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
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
                {editingItem ? "Save Changes" : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Placement Record"
        description="Are you sure you want to delete this placement record?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </AdminLayout>
  );
}
