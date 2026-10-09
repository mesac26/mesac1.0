import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 text-gold mb-4 shadow-inner">
        {icon || <FolderOpen className="h-7 w-7" aria-hidden="true" />}
      </div>
      <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center rounded-xl gradient-gold text-primary font-bold px-5 py-2.5 text-xs sm:text-sm min-h-[40px] hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
