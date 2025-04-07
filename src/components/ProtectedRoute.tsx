"use client";

import { useAuth } from "@/providers/AuthProvider";
import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        <span>Verifying your session...</span>
      </div>
    );
  }

  // Middleware already handled unauthenticated users
  return <>{children}</>;
}
