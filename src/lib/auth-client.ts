"use client";

import { createClient } from "@/utils/supabase/client";

export async function resetPassword(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) {
    console.error("Reset password error:", error.message);
    throw new Error(error.message);
  }
}
