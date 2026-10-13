import React, { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  ShieldCheck,
  FlaskConical,
  Check,
  ChevronDown,
  Layers,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  onOpenMobile: () => void;
}

export function AdminHeader({ onOpenMobile }: AdminHeaderProps) {
  const { session, status, setSimulatedStatus, resetToPrototype, signOut } = useAdminAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/admin/login" });
  };

  // Convert current path into readable title
  const getPageTitle = (path: string) => {
    if (path === "/admin" || path === "/admin/") return "Dashboard Overview";
    const segment = path.replace("/admin/", "").split("/")[0];
    const map: Record<string, string> = {
      archive: "Academic Archive Manager",
      events: "Events & Workshops",
      gallery: "Gallery & Media",
      home: "Home Page Content",
      team: "Committee & Team",
      department: "Department & Faculty",
      achievements: "Achievements",
      placements: "Placements",
      academy: "Academy Tracks",
      inbox: "Inbox & Reports",
      activity: "Activity Log",
      backups: "Backups & Exports",
      admins: "Approved Admins",
      settings: "Site Settings",
    };
    return map[segment] || "Administration";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <Link to="/admin" className="hover:text-neutral-900 dark:hover:text-neutral-200">
              Admin
            </Link>
            <span>/</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate">
              {getPageTitle(currentPath)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick actions, State Simulator & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Developer Auth State Simulator Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition"
              title="Test route-guard states (frontend test utility)"
            >
              <FlaskConical className="h-3 w-3 text-amber-500" />
              <span className="truncate max-w-[120px]">
                {status === "prototype-preview" ? "Prototype Mode" : `Sim: ${status}`}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              Auth Guard State Simulator
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={resetToPrototype}
              className="text-xs cursor-pointer flex items-center justify-between"
            >
              <span>Prototype Preview (Active)</span>
              {status === "prototype-preview" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSimulatedStatus("unauthenticated")}
              className="text-xs cursor-pointer flex items-center justify-between"
            >
              <span>Simulate Unauthenticated</span>
              {status === "unauthenticated" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSimulatedStatus("unauthorized")}
              className="text-xs cursor-pointer flex items-center justify-between"
            >
              <span>Simulate Access Denied</span>
              {status === "unauthorized" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSimulatedStatus("error")}
              className="text-xs cursor-pointer flex items-center justify-between"
            >
              <span>Simulate Auth Server Error</span>
              {status === "error" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSimulatedStatus("loading")}
              className="text-xs cursor-pointer flex items-center justify-between"
            >
              <span>Simulate Loading State</span>
              {status === "loading" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Shortcut Link */}
        <Link
          to="/admin/inbox"
          className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          aria-label="View notifications and inbox"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
        </Link>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition focus:outline-none">
              <div className="h-8 w-8 rounded-lg bg-[#7c1d28] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {session?.user.name?.charAt(0) || "A"}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                  {session?.user.name || "Administrator"}
                </div>
                <div className="text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5 text-amber-500" />
                  <span className="capitalize">{session?.user.role || "superadmin"}</span>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">
                {session?.user.name}
              </div>
              <div className="text-[11px] font-normal text-neutral-600 dark:text-neutral-400 truncate">
                {session?.user.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="text-xs cursor-pointer">
                Site Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/admins" className="text-xs cursor-pointer">
                Manage Admins
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
