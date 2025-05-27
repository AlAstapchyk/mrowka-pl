"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "../ui/button";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await axios.delete("/api/delete-user", {
        withCredentials: true,
      });

      if (response.status === 200) router.push("/goodbye");
      else
        alert(
          "Failed to delete account: " +
            (response.data?.message || "Unknown error"),
        );
    } catch (error: any) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDeleteAccount}
      disabled={loading}
      variant="destructive"
      className="w-full max-w-xl"
    >
      {loading ? "Deleting..." : "Delete My Account"}
    </Button>
  );
}
