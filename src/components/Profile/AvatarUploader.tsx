"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, ChangeEvent, useEffect, useCallback, DragEvent } from "react";
import { User, Upload, X, Camera, ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

interface AvatarFile {
  url: string;
  size?: number;
  uploadedAt: string;
  fileName: string;
}

const acceptedTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

const acceptedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const maxFileSize = 2 * 1024 * 1024; // 2MB

export default function AvatarUploader({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<AvatarFile | null>(null);
  const [isAvatarFetching, setIsAvatarFetching] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const supabase = createClient();

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'Please upload a JPG, PNG, WebP, or GIF image';
    }
    if (file.size > maxFileSize) {
      return 'Image size must be less than 2MB';
    }
    return null;
  };

  const updateAvatarInDatabase = async (avatarUrl: string | null) => {
    try {
      const response = await axios.patch(`/api/users/${userId}/avatar`, {
        avatarUrl,
      });

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        `HTTP ${error.response?.status}: Failed to update avatar`;
      console.error("Failed to update avatar URL in database:", message);
      throw new Error(message);
    }
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    setUploading(true);
    setError(null);

    try {
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("avatars")
        .list(`${userId}/`);

      if (listError) throw listError;

      if (existingFiles && existingFiles.length > 0) {
        const pathsToDelete = existingFiles.map(
          (file) => `${userId}/${file.name}`,
        );
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove(pathsToDelete);
        if (deleteError) throw deleteError;
      }

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

      if (url) {
        await updateAvatarInDatabase(url);

        setAvatarFile({
          url: url,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          fileName: file.name,
        });
      }
    } catch (err: any) {
      console.error("Upload failed:", err.message || err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      await uploadFile(droppedFiles[0]);
    }
  }, []);

  const handleRemoveAvatar = async () => {
    if (!avatarFile) return;

    try {
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("avatars")
        .list(`${userId}/`);

      if (listError) throw listError;

      if (existingFiles && existingFiles.length > 0) {
        const pathsToDelete = existingFiles.map(
          (file) => `${userId}/${file.name}`,
        );
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove(pathsToDelete);
        if (deleteError) throw deleteError;
      }

      await updateAvatarInDatabase(null);

      setAvatarFile(null);
    } catch (err: any) {
      console.error("Delete failed:", err.message || err);
      setError(err.message || "Failed to delete avatar. Please try again.");
    }
  };

  const getAvatarFile = async (userId: string): Promise<AvatarFile | null> => {
    try {
      const { data } = await axios.get(`/api/users/${userId}/avatar`);

      if (data?.avatarUrl) {
        return {
          url: data.avatarUrl,
          uploadedAt: new Date().toISOString(),
          fileName: 'avatar',
        };
      }
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        console.error("Error fetching avatar from API:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    getAvatarFile(userId).then((file) => {
      setAvatarFile(file);
      setIsAvatarFetching(false);
    });
  }, [userId]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Error Message */}
      {error && (
        <div className="w-full p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Avatar Display with Drag & Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`relative group cursor-pointer transition-all duration-200 rounded-full
            ${isDragging ? 'scale-105 ring-4 ring-gray-200' : ''}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            type="file"
            accept={acceptedExtensions.join(',')}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full z-10"
            disabled={uploading}
          />

          <div className="relative">
            {/* Avatar Image or Placeholder */}
            <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
              {!isAvatarFetching && avatarFile ? (
                <Image
                  src={`${avatarFile.url}?v=${new Date().getTime()}`}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : !isAvatarFetching ? (
                <User className="w-16 h-16 text-gray-400" strokeWidth={1} />
              ) : (
                <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Upload Overlay */}
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center 
        bg-black/60 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isHovering || isDragging ? 'opacity-100 scale-105' : 'opacity-0 scale-95 pointer-events-none'}
    `}
            >
              <div className="text-center text-white">
                {isDragging ? (
                  <>
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 animate-bounce" />
                    <p className="text-xs font-medium">Drop here</p>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xs font-medium">Change</p>
                  </>
                )}
              </div>
            </div>

            {/* Upload Progress Indicator */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Upload className="w-8 h-8 mx-auto mb-1 animate-pulse" />
                  <p className="text-xs font-medium">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Upload Button */}
          <Button asChild disabled={uploading} variant="default">
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {avatarFile ? 'Change Avatar' : 'Upload Avatar'}
              <input
                type="file"
                accept={acceptedExtensions.join(',')}
                onChange={handleFileInput}
                hidden
              />
            </label>
          </Button>

          {/* Remove Button - Only show if avatar exists */}
          {avatarFile && (
            <Button
              onClick={handleRemoveAvatar}
              variant="outline"
              disabled={uploading}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        {/* Upload Instructions */}
        {!avatarFile && !uploading && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Drag & drop an image or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP, GIF • Max 2MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}