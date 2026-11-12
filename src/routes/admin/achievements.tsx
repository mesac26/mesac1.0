import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Award, Plus, Search, Edit, Trash2, Eye, Calendar, Trophy } from "lucide-react";
import { mockAchievements } from "@/data/mock/achievements";
import type { Achievement } from "@/types/models";
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

export const Route = createFileRoute("/admin/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements Management — MESAC Admin" },
      {
        name: "description",
        content: "Manage national competitions, student design triumphs, and research awards.",
      },
    ],
  }),
  component: AdminAchievementsPage,
});

export function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Achievement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Competition",
    teamOrStudent: "Team Tarusa SAE CUSAT",
    year: "2024",
    eventOrCompetition: "Formula Bharat 2024",
    rank: "National Rank 1",
    description: "",
    image: "/images/achive/tarusa.jpg",
  });

  const filtered = achievements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.teamOrStudent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.eventOrCompetition &&
        a.eventOrCompetition.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      category: "Competition",
      teamOrStudent: "Team Tarusa SAE CUSAT",
      year: "2024",
      eventOrCompetition: "Formula Bharat 2024",
      rank: "National Rank 1",
      description: "",
      image: "/images/achive/tarusa.jpg",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      teamOrStudent: item.teamOrStudent,
      year: item.year,
      eventOrCompetition: item.eventOrCompetition || "",
      rank: item.rank || "",
      description: item.description || "",
      image: item.image || "/images/achive/tarusa.jpg",
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setAchievements((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                title: formData.title,
                category: formData.category,
                teamOrStudent: formData.teamOrStudent,
                year: formData.year,
                eventOrCompetition: formData.eventOrCompetition,
                rank: formData.rank,
                description: formData.description,
              }
            : i,
        ),
      );
      setEditingItem(null);
    } else {
      const newItem: Achievement = {
        id: `ach-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        teamOrStudent: formData.teamOrStudent,
        year: formData.year,
        eventOrCompetition: formData.eventOrCompetition,
        rank: formData.rank,
        description: formData.description,
        image: formData.image,
      };
      setAchievements((prev) => [newItem, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      setAchievements((prev) => prev.filter((i) => i.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Achievements Management"
          description="Record student victories, SAE Formula competitions, aerospace projects, and university honors."
        >
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Achievement</span>
          </Button>
        </AdminPageHeader>

        {/* Search */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-xs">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
            <Input
              placeholder="Search achievements by team, competition, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-40 w-full relative bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {item.rank && (
                    <div className="absolute top-3 left-3 bg-[#7c1d28] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-amber-300" />
                      <span>{item.rank}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {item.teamOrStudent}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="text-[11px] text-neutral-400 pt-1">
                    Year: {item.year} · {item.eventOrCompetition}
                  </div>
                </div>
              </div>

              <div className="p-3 px-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Edit achievement"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Delete achievement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              {editingItem ? "Edit Achievement" : "Add Student Achievement"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Team or Student Name *</Label>
              <Input
                value={formData.teamOrStudent}
                onChange={(e) => setFormData({ ...formData, teamOrStudent: e.target.value })}
                required
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Competition / Event</Label>
                <Input
                  value={formData.eventOrCompetition}
                  onChange={(e) => setFormData({ ...formData, eventOrCompetition: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Rank / Result</Label>
                <Input
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                rows={2}
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

      {/* Preview Dialog */}
      <Dialog open={previewItem !== null} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6 text-center">
          <Award className="h-10 w-10 text-amber-500 mx-auto mb-2" />
          <h4 className="font-bold text-base">{previewItem?.title}</h4>
          <p className="text-xs text-[#7c1d28] dark:text-amber-400 font-semibold mt-1">
            {previewItem?.teamOrStudent}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
            {previewItem?.description}
          </p>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Delete Achievement"
        description="Are you sure you want to delete this achievement record?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </AdminLayout>
  );
}
