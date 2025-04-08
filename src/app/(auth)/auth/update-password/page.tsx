"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error("Update Failed\n" + error.message);
    } else {
      toast.success(
        "Password updated!\n" + "You can now log in with your new password.",
      );
      router.push("/login");
    }
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-md space-y-4 p-4">
      <h2 className="text-2xl font-semibold">Set a new password</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
