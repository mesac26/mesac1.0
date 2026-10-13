import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Archive,
  Calendar,
  Image,
  Users,
  Award,
  Briefcase,
  Building2,
  GraduationCap,
  Inbox,
  Activity,
  Database,
  UserCheck,
  Settings,
  ExternalLink,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  const navigationGroups = [
    {
      title: "Core",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: "Academic Archive",
          href: "/admin/archive",
          icon: Archive,
          badge: "Priority",
          badgeColor: "bg-[#7c1d28] text-white",
        },
      ],
    },
    {
      title: "Content & Media",
      items: [
        {
          label: "Events & Workshops",
          href: "/admin/events",
          icon: Calendar,
        },
        {
          label: "Gallery & Media",
          href: "/admin/gallery",
          icon: Image,
        },
        {
          label: "Home Page Content",
          href: "/admin/home",
          icon: Sparkles,
        },
      ],
    },
    {
      title: "Association & Faculty",
      items: [
        {
          label: "Committee & Team",
          href: "/admin/team",
          icon: Users,
        },
        {
          label: "Department & Faculty",
          href: "/admin/department",
          icon: Building2,
        },
        {
          label: "Achievements",
          href: "/admin/achievements",
          icon: Award,
        },
        {
          label: "Placements",
          href: "/admin/placements",
          icon: Briefcase,
        },
        {
          label: "Academy Tracks",
          href: "/admin/academy",
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Operations & System",
      items: [
        {
          label: "Inbox & Reports",
          href: "/admin/inbox",
          icon: Inbox,
          badge: "3",
          badgeColor: "bg-amber-500 text-neutral-950 font-bold",
        },
        {
          label: "Activity Log",
          href: "/admin/activity",
          icon: Activity,
        },
        {
          label: "Backups & Exports",
          href: "/admin/backups",
          icon: Database,
        },
        {
          label: "Approved Admins",
          href: "/admin/admins",
          icon: UserCheck,
        },
        {
          label: "Site Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="flex flex-col h-full bg-[#18181b] text-neutral-200 border-r border-neutral-800 w-72 shrink-0 select-none">
      {/* Brand & Organization Header */}
      <div className="flex items-center justify-between p-4 px-5 border-b border-neutral-800">
        <Link
          to="/admin"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="h-10 w-10 rounded-xl bg-[#7c1d28] p-1.5 flex items-center justify-center border border-white/10 shadow-md">
            <img
              src="/mesac-logo-real.png"
              alt="MESAC Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>MESAC</span>
              <span className="text-[10px] font-semibold tracking-normal px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Admin
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 font-medium truncate max-w-[140px]">
              Dept of Mechanical · CUSAT
            </div>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav List with custom scrollbar */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive = item.exact
                ? currentPath === item.href
                : currentPath.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-[#7c1d28] text-white shadow-xs font-semibold"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-800/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-amber-300"
                          : "text-neutral-400 group-hover:text-neutral-200"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-2 ${
                        item.badgeColor || "bg-neutral-700 text-neutral-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer: Public Link & Status */}
      <div className="p-3 border-t border-neutral-800 bg-[#141416]/50 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            <span>Open Public Website</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        </Link>
        <div className="px-3 py-1 flex items-center justify-between text-[10px] text-neutral-400">
          <span>MESAC v1.0 • 2026</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Console Live</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
