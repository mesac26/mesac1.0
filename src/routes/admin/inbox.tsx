import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Inbox,
  Mail,
  GraduationCap,
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Send,
  User,
  Phone,
} from "lucide-react";
import {
  mockContactSubmissions,
  mockEnrollmentSubmissions,
  mockArchiveReports,
} from "@/data/mock/admin";
import type { ContactSubmission, EnrollmentSubmission } from "@/types/models";
import type { ArchiveProblemReport } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox & Submissions — MESAC Admin" },
      {
        name: "description",
        content:
          "Incoming student enrollment applications, general contact inquiries, and archive issue reports.",
      },
    ],
  }),
  component: AdminInboxPage,
});

export function AdminInboxPage() {
  const [activeTab, setActiveTab] = useState<"contacts" | "enrollments" | "reports">("contacts");
  const [contacts, setContacts] = useState<ContactSubmission[]>(mockContactSubmissions);
  const [enrollments, setEnrollments] = useState<EnrollmentSubmission[]>(mockEnrollmentSubmissions);
  const [reports, setReports] = useState<ArchiveProblemReport[]>(mockArchiveReports);

  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [selectedReport, setSelectedReport] = useState<ArchiveProblemReport | null>(null);

  const markContactStatus = (id: string, status: ContactSubmission["status"]) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    if (selectedContact?.id === id) {
      setSelectedContact((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const markEnrollmentStatus = (id: string, status: EnrollmentSubmission["status"]) => {
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const markReportStatus = (id: string, status: ArchiveProblemReport["status"]) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selectedReport?.id === id) {
      setSelectedReport((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Inbox & Submissions"
          description="Review contact inquiries, student skill-track enrollments, and academic paper problem reports."
        />

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("contacts")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "contacts"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Contact Messages ({contacts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("enrollments")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "enrollments"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Enrollments ({enrollments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === "reports"
                ? "border-[#7c1d28] text-[#7c1d28] dark:text-amber-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Archive Reports ({reports.length})</span>
          </button>
        </div>

        {/* Tab 1: Contacts */}
        {activeTab === "contacts" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {contacts.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {item.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "new"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {item.subject}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">{item.message}</p>
                  <div className="text-[11px] text-neutral-400 pt-0.5">
                    {item.email} · {item.phone || "No phone"} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContact(item)}
                    className="text-xs rounded-xl h-8"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    <span>View Message</span>
                  </Button>
                  {item.status === "new" && (
                    <Button
                      size="sm"
                      onClick={() => markContactStatus(item.id, "read")}
                      className="bg-neutral-900 text-white text-xs h-8 rounded-xl"
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Enrollments */}
        {activeTab === "enrollments" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {enr.studentName}
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      ({enr.registrationNumber})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        enr.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : enr.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {enr.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {enr.branch} · Semester {enr.semester}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Email: {enr.email} · Phone: {enr.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markEnrollmentStatus(enr.id, "approved")}
                    className="text-xs rounded-xl h-8 text-emerald-600 hover:bg-emerald-50"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markEnrollmentStatus(enr.id, "rejected")}
                    className="text-xs rounded-xl h-8 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === "reports" && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                      {rep.issueType.replace("_", " ")}
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {rep.documentTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {rep.description}
                  </p>
                  <div className="text-[11px] text-neutral-400">
                    Reported by {rep.reportedBy} ({rep.reporterEmail})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport(rep)}
                    className="text-xs rounded-xl h-8"
                  >
                    View Report
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => markReportStatus(rep.id, "resolved")}
                    className="bg-[#7c1d28] text-white text-xs h-8 rounded-xl font-bold"
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Contact Dialog */}
      <Dialog open={selectedContact !== null} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Inquiry Message</DialogTitle>
            <DialogDescription className="text-xs">
              From {selectedContact?.name} ({selectedContact?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Subject:
              </span>
              <p className="text-sm font-semibold mt-0.5">{selectedContact?.subject}</p>
            </div>
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Message Body:
              </span>
              <p className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 mt-1 leading-relaxed">
                {selectedContact?.message}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedContact(null)}
              className="text-xs rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
