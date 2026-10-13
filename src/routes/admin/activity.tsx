import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Activity, Clock, Search, Filter, ShieldCheck, User } from "lucide-react";
import { mockActivityLogs } from "@/data/mock/admin";
import type { ActivityLogEntry } from "@/types/admin";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/activity")({
  head: () => ({
    meta: [
      { title: "Activity & Audit Log — MESAC Admin" },
      {
        name: "description",
        content: "Audit trail of administrative modifications, document uploads, and site updates.",
      },
    ],
  }),
  component: AdminActivityPage,
});

export function AdminActivityPage() {
  const [logs] = useState<ActivityLogEntry[]>(mockActivityLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.entityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, actionFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Administrative Activity & Audit Log"
          description="Detailed audit log recording actions, timestamps, and administrator identities."
        />

        {/* Filter Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-xs">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
              <Input
                placeholder="Search audit trail by record title, actor name, or action summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 px-3 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <option value="all">All Actions</option>
              <option value="create">Created</option>
              <option value="update">Updated</option>
              <option value="delete">Deleted</option>
              <option value="status_change">Status Change</option>
              <option value="export">Export</option>
            </select>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    {log.entityTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {log.action}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{log.summary}</p>
                <div className="text-[11px] text-neutral-500 flex items-center gap-2 pt-1">
                  <User className="h-3 w-3" />
                  <span>
                    {log.actor.name} ({log.actor.email})
                  </span>
                  <span>•</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
