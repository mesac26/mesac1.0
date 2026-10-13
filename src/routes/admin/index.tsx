import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Archive,
  Calendar,
  Users,
  Inbox,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { mockArchiveDocuments } from "@/data/mock/archive";
import { mockEvents } from "@/data/mock/events";
import { mockTeamMembers } from "@/data/mock/team";
import { mockActivityLogs, mockArchiveReports, mockContactSubmissions } from "@/data/mock/admin";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard Overview — MESAC Admin" },
      {
        name: "description",
        content: "MESAC Administrator overview and administrative operations console.",
      },
    ],
  }),
  component: AdminDashboardOverview,
});

export function AdminDashboardOverview() {
  const [activeTab, setActiveTab] = useState<"activity" | "submissions">("activity");

  const archiveCount = mockArchiveDocuments.length;
  const eventsCount = mockEvents.length;
  const teamCount = mockTeamMembers.length;
  const pendingInboxCount =
    mockArchiveReports.filter((r) => r.status === "pending").length +
    mockContactSubmissions.filter((s) => s.status === "new").length;

  const statCards = [
    {
      label: "Archive Documents",
      value: archiveCount.toString(),
      subtext: "QP & syllabus records",
      icon: Archive,
      href: "/admin/archive",
      badge: "Launch Priority",
      accent: "border-[#7c1d28]/30 text-[#7c1d28] dark:text-amber-400",
    },
    {
      label: "Workshops & Events",
      value: eventsCount.toString(),
      subtext: "Conducted & planned",
      icon: Calendar,
      href: "/admin/events",
      accent: "border-blue-500/30 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Active Committee",
      value: teamCount.toString(),
      subtext: "2026-27 academic year",
      icon: Users,
      href: "/admin/team",
      accent: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending Submissions",
      value: pendingInboxCount.toString(),
      subtext: "Inbox & problem reports",
      icon: Inbox,
      href: "/admin/inbox",
      badge: pendingInboxCount > 0 ? "Needs Review" : undefined,
      accent: "border-amber-500/30 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <AdminPageHeader
          title="Administrative Overview"
          description="Manage departmental content, academic question papers, committee records, and incoming submissions."
          badge="Console Active"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/archive"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white px-3.5 py-2 text-xs font-bold transition shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Archive Document</span>
            </Link>
            <Link
              to="/admin/events"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700/80 px-3.5 py-2 text-xs font-bold transition"
            >
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span>New Event</span>
            </Link>
          </div>
        </AdminPageHeader>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.href}
                className="group relative rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs hover:border-[#7c1d28]/50 dark:hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      {card.label}
                    </span>
                    <div
                      className={`p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${card.accent}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 font-display text-3xl font-black text-neutral-900 dark:text-neutral-100">
                    {card.value}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="truncate">{card.subtext}</span>
                  {card.badge && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      {card.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Task Shortcuts Grid */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Quick Administrative Tasks
            </h2>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
              One-click access to core sections
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Upload QP", href: "/admin/archive", icon: Archive },
              { label: "Manage Events", href: "/admin/events", icon: Calendar },
              { label: "Update Team", href: "/admin/team", icon: Users },
              { label: "Faculty Directory", href: "/admin/department", icon: Users },
              { label: "Review Inbox", href: "/admin/inbox", icon: Inbox },
              { label: "Export Data", href: "/admin/backups", icon: ExternalLink },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link
                  key={shortcut.label}
                  to={shortcut.href}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 hover:border-[#7c1d28]/40 transition text-center group"
                >
                  <Icon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-[#7c1d28] dark:group-hover:text-amber-400 mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {shortcut.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Split Grid: Recent Activity & Recent Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Recent Activity Trail */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#7c1d28] dark:text-amber-400" />
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Recent Administrative Activity
                  </h3>
                </div>
                <Link
                  to="/admin/activity"
                  className="text-xs font-semibold text-[#7c1d28] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-2">
                {mockActivityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {log.entityTitle}
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400">{log.summary}</p>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                        By {log.actor.name} ·{" "}
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pending Inbox & Reports */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Submissions & Issue Reports
                  </h3>
                </div>
                <Link
                  to="/admin/inbox"
                  className="text-xs font-semibold text-[#7c1d28] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Inbox</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-2">
                {mockArchiveReports.slice(0, 2).map((report) => (
                  <div key={report.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {report.documentTitle}
                      </span>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                        {report.issueType.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                      {report.description}
                    </p>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      Reported by {report.reportedBy || "Student"} · Status: {report.status}
                    </div>
                  </div>
                ))}

                {mockContactSubmissions.slice(0, 2).map((contact) => (
                  <div key={contact.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {contact.name}
                      </span>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                        Contact Message
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                      {contact.subject}
                    </p>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      {contact.email} · Status: {contact.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Launch Priority Academic Archive Banner */}
        <div className="rounded-2xl border border-[#7c1d28]/30 bg-gradient-to-r from-[#7c1d28]/10 via-amber-500/5 to-transparent p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#7c1d28] text-white">
                Launch Priority
              </span>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Academic Archive Repository Management
              </h4>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl">
              CUSAT Mechanical question papers, university schemes, and subject syllabus documents
              are the flagship student resources. Perform health checks, upload PDFs, and update
              metadata anytime.
            </p>
          </div>
          <Link
            to="/admin/archive"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#7c1d28] hover:bg-[#63141f] text-white px-4 py-2 text-xs font-bold transition shrink-0"
          >
            <span>Manage Academic Archive</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
