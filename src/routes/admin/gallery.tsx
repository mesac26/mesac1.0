import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Image,
  Plus,
  Upload,
  Calendar,
  Trash2,
  Edit,
  ExternalLink,
  FolderPlus,
  X,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { mockGalleryAlbums } from "@/data/mock/gallery";
import { mockEvents } from "@/data/mock/events";
import type { GalleryAlbum, GalleryCategory } from "@/types/models";
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

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery & Album Management — MESAC Admin" },
      {
        name: "description",
        content: "Manage event photo albums, workshop pictures, and media archives.",
      },
    ],
  }),
  component: AdminGalleryPage,
});

export function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(mockGalleryAlbums);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [deletingAlbumId, setDeletingAlbumId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Events" as GalleryCategory,
    description: "",
    coverImage: "/images/gallery/tw/tw-1.jpg",
    date: new Date().toISOString().split("T")[0],
    relatedEventId: mockEvents[0]?.id || "",
    imageCount: 12,
  });

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      category: "Events",
      description: "",
      coverImage: "/images/gallery/tw/tw-1.jpg",
      date: new Date().toISOString().split("T")[0],
      relatedEventId: mockEvents[0]?.id || "",
      imageCount: 0,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      category: album.category as GalleryCategory,
      description: album.description || "",
      coverImage: album.coverImage,
      date: album.date,
      relatedEventId: album.relatedEventId || "",
      imageCount: album.imageCount,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlbum) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === editingAlbum.id
            ? {
                ...a,
                title: formData.title,
                category: formData.category,
                description: formData.description,
                date: formData.date,
                relatedEventId: formData.relatedEventId,
              }
            : a,
        ),
      );
      setEditingAlbum(null);
    } else {
      const newAlbum: GalleryAlbum = {
        id: `album-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        coverImage: formData.coverImage,
        date: formData.date,
        imageCount: formData.imageCount || 1,
        relatedEventId: formData.relatedEventId,
      };
      setAlbums((prev) => [newAlbum, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingAlbumId) {
      setAlbums((prev) => prev.filter((a) => a.id !== deletingAlbumId));
      setDeletingAlbumId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Gallery & Albums Management"
          description="Organize official event photo albums and associate media archives with conducted workshops."
        >
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            <FolderPlus className="h-4 w-4 mr-1.5" />
            <span>Create Album</span>
          </Button>
        </AdminPageHeader>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album) => {
            const relatedEvent = mockEvents.find((e) => e.id === album.relatedEventId);
            return (
              <div
                key={album.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                        {album.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {album.imageCount} Photos
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
                      <div>Date: {album.date}</div>
                      {relatedEvent && (
                        <div className="text-amber-600 dark:text-amber-400 font-semibold truncate">
                          Event: {relatedEvent.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 px-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(album)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Edit album"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingAlbumId(album.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Delete album"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={isAddModalOpen || editingAlbum !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingAlbum(null);
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingAlbum ? "Edit Gallery Album" : "Create Photo Album"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Albums must be associated with an authorized event or workshop.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Album Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g. Induction Ceremony 2026 Photos"
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Associated Event *</Label>
              <select
                value={formData.relatedEventId}
                onChange={(e) => setFormData({ ...formData, relatedEventId: e.target.value })}
                className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                {mockEvents.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.date})
                  </option>
                ))}
              </select>
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

            <DialogFooter className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingAlbum(null);
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
                {editingAlbum ? "Save Changes" : "Create Album"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingAlbumId !== null}
        title="Delete Photo Album"
        description="Are you sure you want to delete this album? Associated media items will be unlinked."
        onConfirm={handleDelete}
        onClose={() => setDeletingAlbumId(null)}
      />
    </AdminLayout>
  );
}
