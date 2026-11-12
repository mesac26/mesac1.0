import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Tag,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Eye,
} from "lucide-react";
import { mockEvents } from "@/data/mock/events";
import { isEventUpcoming } from "@/lib/events";
import type { Event, EventCategory } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [
      { title: "Events & Workshops Management — MESAC Admin" },
      {
        name: "description",
        content: "Manage upcoming workshops, seminars, and industrial visits conducted by MESAC.",
      },
    ],
  }),
  component: AdminEventsPage,
});

export function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"all" | "upcoming" | "past">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [previewEvent, setPreviewEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    tag: "Workshop" as EventCategory,
    date: new Date().toISOString().split("T")[0],
    location: "Mechanical Seminar Hall, SOE CUSAT",
    coordinator: "MESAC Technical Team",
    desc: "",
    registrationUrl: "",
    registrationOpen: true,
    images: ["/public/images/events/daikin-workshop-2025-1.jpg"],
    galleryAlbumId: "",
  });

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const isUpcoming = isEventUpcoming(ev);
      const matchesScope =
        scopeFilter === "all" ||
        (scopeFilter === "upcoming" && isUpcoming) ||
        (scopeFilter === "past" && !isUpcoming);

      const matchesSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "all" || ev.tag === categoryFilter;

      return matchesScope && matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, scopeFilter, categoryFilter]);

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      tag: "Workshop",
      date: new Date().toISOString().split("T")[0],
      location: "Mechanical Seminar Hall, SOE CUSAT",
      coordinator: "MESAC Technical Team",
      desc: "",
      registrationUrl: "",
      registrationOpen: true,
      images: ["/images/events/daikin-workshop-2025-1.jpg"],
      galleryAlbumId: "",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (ev: Event) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      tag: ev.tag as EventCategory,
      date: ev.date,
      location: ev.location,
      coordinator: ev.coordinator,
      desc: ev.desc,
      registrationUrl: ev.registrationUrl || "",
      registrationOpen: ev.registrationOpen ?? true,
      images: ev.images.length > 0 ? ev.images : ["/images/events/daikin-workshop-2025-1.jpg"],
      galleryAlbumId: ev.galleryAlbumId || "",
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === editingEvent.id
            ? {
                ...item,
                title: formData.title,
                tag: formData.tag,
                date: formData.date,
                location: formData.location,
                coordinator: formData.coordinator,
                desc: formData.desc,
                registrationUrl: formData.registrationUrl,
                registrationOpen: formData.registrationOpen,
                galleryAlbumId: formData.galleryAlbumId,
              }
            : item,
        ),
      );
      setEditingEvent(null);
    } else {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        tag: formData.tag,
        date: formData.date,
        location: formData.location,
        coordinator: formData.coordinator,
        desc: formData.desc,
        registrationUrl: formData.registrationUrl,
        registrationOpen: formData.registrationOpen,
        images: formData.images,
        galleryAlbumId: formData.galleryAlbumId,
      };
      setEvents((prev) => [newEvent, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingEventId) {
      setEvents((prev) => prev.filter((ev) => ev.id !== deletingEventId));
      setDeletingEventId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Events & Workshops Management"
          description="Create and schedule technical masterclasses, industrial visits, guest talks, and competitions."
        >
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Create New Event</span>
          </Button>
        </AdminPageHeader>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
              <Input
                placeholder="Search events by title, description, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value as "all" | "upcoming" | "past")}
                className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <option value="all">All Statuses (Upcoming & Past)</option>
                <option value="upcoming">Upcoming Events Only</option>
                <option value="past">Past Events Archive</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <option value="all">All Categories</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Industrial Visit">Industrial Visit</option>
                <option value="Technical Talk">Technical Talk</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => {
            const isUpcoming = isEventUpcoming(ev);
            return (
              <div
                key={ev.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="h-40 w-full relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <img
                      src={ev.images[0] || "/images/home/hero.jpg"}
                      alt={ev.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                        {ev.tag}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isUpcoming
                            ? "bg-emerald-500 text-white"
                            : "bg-neutral-700 text-neutral-200"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Past"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {ev.desc}
                    </p>

                    <div className="pt-2 space-y-1 text-[11px] text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 px-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewEvent(ev)}
                    className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Card</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(ev)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      aria-label="Edit event"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingEventId(ev.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      aria-label="Delete event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Event Dialog */}
      <Dialog
        open={isAddModalOpen || editingEvent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingEvent(null);
          }
        }}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingEvent ? "Edit Event Details" : "Create New Association Event"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure event dates, registration links, venue, and descriptions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Event Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g. Aerodynamics & CFD Industrial Masterclass"
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category / Tag</Label>
                <select
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value as EventCategory })
                  }
                  className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Industrial Visit">Industrial Visit</option>
                  <option value="Technical Talk">Technical Talk</option>
                  <option value="Competition">Competition</option>
                  <option value="Flagship">Flagship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Event Date (YYYY-MM-DD) *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Venue / Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g. Mechanical Seminar Hall, SOE CUSAT"
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Registration URL (Optional)</Label>
                <Input
                  type="url"
                  placeholder="https://forms.gle/..."
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                  className="text-xs h-9 rounded-xl"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Event Description *</Label>
                <Textarea
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  required
                  placeholder="Overview of the workshop, objectives, and targeted student batch..."
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEvent(null);
                }}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold rounded-xl"
              >
                {editingEvent ? "Save Changes" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Public Card Preview Dialog */}
      <Dialog open={previewEvent !== null} onOpenChange={(open) => !open && setPreviewEvent(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Public Event Preview</DialogTitle>
          </DialogHeader>
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 bg-neutral-50 dark:bg-neutral-800/40">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#7c1d28] text-white">
              {previewEvent?.tag}
            </span>
            <h4 className="font-bold text-base">{previewEvent?.title}</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{previewEvent?.desc}</p>
            <div className="text-xs space-y-1 text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <div>Date: {previewEvent?.date}</div>
              <div>Location: {previewEvent?.location}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewEvent(null)}
              className="text-xs rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingEventId !== null}
        title="Delete Event"
        description="Are you sure you want to permanently delete this event? This action will remove it from the public schedule and events archive."
        onConfirm={handleDelete}
        onClose={() => setDeletingEventId(null)}
      />
    </AdminLayout>
  );
}
