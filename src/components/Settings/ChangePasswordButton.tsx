"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { resetPassword } from "@/lib/auth-client";

const ChangePasswordButton = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(user?.email as string);
      toast.success("Check your email for the reset link.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} className="w-full max-w-xl">
      Change password
    </Button>
  );
};

export default ChangePasswordButton;
