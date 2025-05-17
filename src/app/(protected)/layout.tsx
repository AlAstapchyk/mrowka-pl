// src/app/(protected)/layout.tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
