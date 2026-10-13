import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Database,
  Download,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  HardDrive,
  Calendar,
} from "lucide-react";
import { mockBackups } from "@/data/mock/admin";
import type { BackupRecord } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/backups")({
  head: () => ({
    meta: [
      { title: "Backups & System Exports — MESAC Admin" },
      {
        name: "description",
        content:
          "Download full database backups, archive document indexes, and verify system snapshots.",
      },
    ],
  }),
  component: AdminBackupsPage,
});

export function AdminBackupsPage() {
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);
  const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleTriggerExport = () => {
    setIsExportConfirmOpen(false);
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      toast.info(
        "Export requested: Backend snapshot generation is pending server-side implementation.",
      );
    }, 1500);
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Backups & Data Export"
          description="Manage automated database snapshots, archive manifest exports, and system redundancy."
        >
          <Button
            onClick={() => setIsExportConfirmOpen(true)}
            disabled={isExporting}
            className="rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white text-xs font-bold h-9 px-4"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1.5" />
                <span>Trigger Manual Snapshot</span>
              </>
            )}
          </Button>
        </AdminPageHeader>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>Last Automated Backup</span>
            </div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">
              Today at 02:00 AM
            </div>
            <p className="text-[11px] text-neutral-500">
              Integrity verified with SHA-256 checksum matching.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span>Next Scheduled Backup</span>
            </div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">
              Tomorrow at 02:00 AM
            </div>
            <p className="text-[11px] text-neutral-500">
              Automated daily cron handled by backend storage worker.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <HardDrive className="h-4 w-4 text-blue-500" />
              <span>Total Snapshots</span>
            </div>
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100">
              {backups.length} Available
            </div>
            <p className="text-[11px] text-neutral-500">
              Retention policy keeps last 30 daily snapshots.
            </p>
          </div>
        </div>

        {/* Export History Table */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Snapshot & Archive Manifest History
            </h3>
            <span className="text-[11px] text-neutral-400">
              Backend S3 / Drive export integration
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3 pl-4">Snapshot Archive</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Creation Date</th>
                  <th className="p-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {backups.map((bkp) => (
                  <tr key={bkp.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <td className="p-3 pl-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {bkp.name}
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400">
                      {bkp.type.replace("_", " ")}
                    </td>
                    <td className="p-3 font-semibold">{formatBytes(bkp.sizeBytes)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {bkp.status}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500">
                      {new Date(bkp.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-right pr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info(
                            "Download payload is generated dynamically by backend storage.",
                          )
                        }
                        className="text-xs h-8 rounded-xl"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        <span>Download</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isExportConfirmOpen}
        title="Initiate Full System Export?"
        description="This will compile all academic archive records, user activity logs, and content models into a compressed JSON bundle. This operation may take several seconds on production servers."
        confirmLabel="Initiate Export"
        variant="warning"
        onConfirm={handleTriggerExport}
        onClose={() => setIsExportConfirmOpen(false)}
      />
    </AdminLayout>
  );
}
