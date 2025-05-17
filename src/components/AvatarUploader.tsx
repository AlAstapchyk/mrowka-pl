"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, ChangeEvent, useEffect } from "react";
import { getAvatarUrl } from "@/utils/supabase/storage-client";
import { LucideUser } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AvatarUploader({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFetch, setAvatarFetch] = useState<boolean>(true);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    setUploading(true);

    try {
      // List all files
      const supabase = createClient();
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("avatars")
        .list(`${userId}/`);

      if (listError) throw listError;

      // Delete all files if any exist
      if (existingFiles && existingFiles.length > 0) {
        const pathsToDelete = existingFiles.map(
          (file) => `${userId}/${file.name}`,
        );
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove(pathsToDelete);
        if (deleteError) throw deleteError;
      }

      // Upload the new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const url = data?.publicUrl;

      setAvatarUrl(url || null);
    } catch (err: any) {
      console.error("Upload failed:", err.message || err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    getAvatarUrl(userId).then((url) => {
      setAvatarUrl(url);
      setAvatarFetch(false);
    });
  }, [userId]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-[100px] w-[100px]">
        {avatarUrl && (
          <Image
            src={avatarUrl ? `${avatarUrl}?v=${new Date().toString()}` : ""}
            alt="Avatar"
            width={100}
            height={100}
            className="aspect-square rounded-full object-cover"
            loading="eager"
          />
        )}

        {!avatarFetch && !avatarUrl && (
          <LucideUser width={100} height={100} strokeWidth={1} />
        )}
      </div>

      <Button asChild disabled={uploading}>
        <label>
          {uploading ? "Uploading..." : "Upload Avatar"}
          <input type="file" accept="image/*" onChange={handleUpload} hidden />
        </label>
      </Button>
    </div>
  );
}
