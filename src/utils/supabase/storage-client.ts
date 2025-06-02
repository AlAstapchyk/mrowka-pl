"use client";

import { createClient } from "./client";

export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("avatars")
      .list(`${userId}/`);

    if (error) {
      console.error("Error listing avatar files:", error.message);
      return null;
    }

    const file = data?.find((f) => f.name.startsWith("avatar"));
    if (!file) {
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${userId}/${file.name}`);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error("Error fetching avatar URL:", err);
    return null;
  }
};

export const getCompanyLogoUrl = async (
  companyId: string,
): Promise<string | null> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.storage
      .from("company-logos")
      .list(`${companyId}/`);

    if (error) {
      console.error("Error listing company logo files:", error.message);
      return null;
    }

    const file = data?.[0];
    if (!file) return null;

    const { data: publicUrlData } = supabase.storage
      .from("company-logos")
      .getPublicUrl(`${companyId}/${file.name}`);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error("Error fetching company logo URL:", err);
    return null;
  }
};
