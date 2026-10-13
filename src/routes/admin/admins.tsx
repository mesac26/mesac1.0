import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  UserCheck,
  Plus,
  Trash2,
  ShieldCheck,
  Mail,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { mockAdminUsers } from "@/data/mock/admin";
import type { AdminUser, AdminUserRole } from "@/types/models";
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
import { toast } from "sonner";

export const Route = createFileRoute("/admin/admins")({
  head: () => ({
    meta: [
      { title: "Approved Administrators — MESAC Admin" },
      {
        name: "description",
        content: "Manage approved administrator accounts and role privileges for the MESAC portal.",
      },
    ],
  }),
  component: AdminManagementPage,
});

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdminUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "editor" as AdminUserRole,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      role: "editor",
    });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid administrator email.");
      return;
    }

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    setIsAddModalOpen(false);
    toast.success("Administrator invited to local list. Backend access policy update pending.");
  };

  const handleDelete = () => {
    if (deletingAdminId) {
      if (admins.length <= 1) {
        toast.error("Cannot remove the last remaining administrator account.");
        setDeletingAdminId(null);
        return;
      }
      setAdmins((prev) => prev.filter((a) => a.id !== deletingAdminId));
      setDeletingAdminId(null);
      toast.info("Administrator removed from local view. Backend permission revocation pending.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Approved Administrators"
          description="Grant or revoke administrative access to the MESAC management dashboard."
        >
          <Button
            onClick={handleOpenAdd}
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Approved Admin</span>
          </Button>
        </AdminPageHeader>

        {/* Security Warning Notice */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/10 p-4 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block text-neutral-900 dark:text-neutral-100">
              Access & Authorization Enforcement
            </span>
            <p className="text-neutral-600 dark:text-neutral-300 mt-0.5">
              Approved administrators have full access to manage all portal content. The backend
              server verifies identity and permissions independently on every API request.
            </p>
          </div>
        </div>

        {/* Admin Directory Table */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3 pl-4">Administrator</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="p-3 pl-4 font-bold text-neutral-900 dark:text-neutral-100">
                      {adm.name}
                    </td>
                    <td className="p-3 font-mono text-neutral-600 dark:text-neutral-400">
                      {adm.email}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#7c1d28]/10 text-[#7c1d28] dark:bg-[#7c1d28]/30 dark:text-[#f8b4bc]">
                        {adm.role}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500">
                      {adm.lastLoginAt ? new Date(adm.lastLoginAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="p-3 text-right pr-4">
                      <button
                        onClick={() => setDeletingAdminId(adm.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Revoke Admin Access"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Approved Administrator</DialogTitle>
            <DialogDescription className="text-xs">
              Authorize a faculty member or student executive with administration privileges.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Display Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Prof. Anand K."
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">CUSAT / Institutional Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="name@cusat.ac.in"
                className="text-xs h-9 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Administrator Role</Label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as AdminUserRole })
                }
                className="w-full h-9 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <option value="editor">Editor (Content & Archive Management)</option>
                <option value="superadmin">Superadmin (Full Access + Admin Management)</option>
                <option value="moderator">Moderator (Inbox & Submissions)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#7c1d28] text-white text-xs font-bold rounded-xl"
              >
                Add Administrator
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingAdminId !== null}
        title="Revoke Administrator Access?"
        description="Are you sure you want to remove this user from the approved administrators list? They will no longer be able to access the admin console or modify website records."
        confirmLabel="Yes, Revoke Access"
        onConfirm={handleDelete}
        onClose={() => setDeletingAdminId(null)}
      />
    </AdminLayout>
  );
}
