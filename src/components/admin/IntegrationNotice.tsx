import React from "react";
import { Info, AlertCircle, ShieldAlert } from "lucide-react";

interface IntegrationNoticeProps {
  message?: string;
  variant?: "info" | "warning" | "alert";
  className?: string;
}

export function IntegrationNotice({
  message = "Frontend Prototype: Changes update local component state for UI testing. Backend persistence, Drive sync, and server authorization will be integrated separately.",
  variant = "info",
  className = "",
}: IntegrationNoticeProps) {
  const styles = {
    info: "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200",
    warning: "bg-orange-500/10 border-orange-500/30 text-orange-900 dark:text-orange-200",
    alert: "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200",
  };

  const Icon = variant === "alert" ? ShieldAlert : variant === "warning" ? AlertCircle : Info;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs sm:text-sm font-medium transition-colors ${styles[variant]} ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
      <div className="flex-1 leading-relaxed">
        <span className="font-semibold uppercase tracking-wider text-[11px] block mb-0.5 text-amber-700 dark:text-amber-300">
          Backend Integration Notice
        </span>
        {message}
      </div>
    </div>
  );
}
