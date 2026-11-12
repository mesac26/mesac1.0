import React from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, badge, children }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-[#7c1d28]/10 text-[#7c1d28] dark:bg-[#7c1d28]/30 dark:text-[#f8b4bc] px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
}
