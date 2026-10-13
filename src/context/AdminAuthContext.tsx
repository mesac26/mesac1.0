import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AdminAuthStatus, AdminSession } from "@/types/admin";
import { mockAdminUsers } from "@/data/mock/admin";

interface AdminAuthContextType {
  status: AdminAuthStatus;
  session: AdminSession | null;
  error: string | null;
  isPrototypeMode: boolean;
  /** Initiates Google OAuth sign-in flow (Pending Backend) */
  signInWithGoogle: () => Promise<{ success: boolean; message: string }>;
  /** Initiates Email sign-in flow (Pending Backend) */
  signInWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  /** Signs out the current admin session */
  signOut: () => Promise<void>;
  /** Allows developers to simulate any guard state to verify UI */
  setSimulatedStatus: (status: AdminAuthStatus) => void;
  /** Clears simulation and resets to standard development prototype preview */
  resetToPrototype: () => void;
  /** Retry session verification */
  retrySessionCheck: () => Promise<void>;
}

const defaultSession: AdminSession = {
  user: mockAdminUsers[0], // Dr. Jacob Elias (Superadmin fixture)
  tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  provider: "prototype",
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  // By default, during frontend development, we run in "prototype-preview" mode
  // so admins and developers can test all the interactive screens.
  const [status, setStatus] = useState<AdminAuthStatus>("prototype-preview");
  const [session, setSession] = useState<AdminSession | null>(defaultSession);
  const [error, setError] = useState<string | null>(null);

  // In production, the backend developer will wire this to a real `/api/auth/session` check:
  const checkSession = useCallback(async () => {
    // If we're already manually simulating a test state, do not overwrite
    if (status !== "prototype-preview" && status !== "authenticated") {
      return;
    }
  }, [status]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signInWithGoogle = async () => {
    // Contract placeholder for Google Workspace OAuth
    return {
      success: false,
      message:
        "Backend OAuth integration pending. When connected, this initiates the Google Workspace SSO flow.",
    };
  };

  const signInWithEmail = async (email: string) => {
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid university email address." };
    }
    return {
      success: true,
      message:
        "Sign-in link / verification code flow is pending backend email service integration.",
    };
  };

  const signOut = async () => {
    setSession(null);
    setStatus("unauthenticated");
  };

  const setSimulatedStatus = (newStatus: AdminAuthStatus) => {
    setStatus(newStatus);
    if (newStatus === "unauthenticated" || newStatus === "unauthorized") {
      // In unauthenticated state, there is no session
      if (newStatus === "unauthenticated") {
        setSession(null);
      }
    } else if (newStatus === "error") {
      setError("Session verification failed: Unable to connect to authentication server.");
    } else {
      setSession(defaultSession);
      setError(null);
    }
  };

  const resetToPrototype = () => {
    setStatus("prototype-preview");
    setSession(defaultSession);
    setError(null);
  };

  const retrySessionCheck = async () => {
    setStatus("loading");
    setTimeout(() => {
      resetToPrototype();
    }, 600);
  };

  const isPrototypeMode = status === "prototype-preview";

  return (
    <AdminAuthContext.Provider
      value={{
        status,
        session,
        error,
        isPrototypeMode,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        setSimulatedStatus,
        resetToPrototype,
        retrySessionCheck,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
