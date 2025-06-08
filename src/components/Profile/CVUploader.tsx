"use client";

import { Button } from "@/components/ui/button";
import React, { useState, ChangeEvent, useEffect, useCallback, DragEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { FileText, Upload, X, Download } from "lucide-react";

interface CVFile {
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
}

const acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const acceptedExtensions = ['.pdf', '.doc', '.docx'];
const maxFileSize = 2 * 1024 * 1024;

export default function CVUploader({ userId }: { userId: string }) {
    const [uploading, setUploading] = useState(false);
    const [cvFile, setCvFile] = useState<CVFile | null>(null);
    const [cvFetch, setCvFetch] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const validateFile = (file: File): string | null => {
        if (!acceptedTypes.includes(file.type)) {
            return 'Please upload a PDF, DOC, or DOCX file';
        }
        if (file.size > maxFileSize) {
            return 'File size must be less than 2MB';
        }
        return null;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const uploadFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}/resume.${fileExt}`;

        setUploading(true);
        setError(null);

        try {
            // List all existing CV files
            const { data: existingFiles, error: listError } = await supabase.storage
                .from("resumes")
                .list(`${userId}/`);

            if (listError) throw listError;

            // Delete all existing CV files
            if (existingFiles && existingFiles.length > 0) {
                const pathsToDelete = existingFiles.map(
                    (file) => `${userId}/${file.name}`,
                );
                const { error: deleteError } = await supabase.storage
                    .from("resumes")
                    .remove(pathsToDelete);
                if (deleteError) throw deleteError;
            }

            // Upload the new CV
            const { error: uploadError } = await supabase.storage
                .from("resumes")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
            const url = data?.publicUrl;

            if (url) {
                setCvFile({
                    name: file.name,
                    url: url,
                    size: file.size,
                    uploadedAt: new Date().toISOString(),
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

    const handleRemoveCV = async () => {
        if (!cvFile) return;

        try {
            const { data: existingFiles, error: listError } = await supabase.storage
                .from("resumes")
                .list(`${userId}/`);

            if (listError) throw listError;

            if (existingFiles && existingFiles.length > 0) {
                const pathsToDelete = existingFiles.map(
                    (file) => `${userId}/${file.name}`,
                );
                const { error: deleteError } = await supabase.storage
                    .from("resumes")
                    .remove(pathsToDelete);
                if (deleteError) throw deleteError;
            }

            setCvFile(null);
        } catch (err: any) {
            console.error("Delete failed:", err.message || err);
            setError(err.message || "Failed to delete CV. Please try again.");
        }
    };

    const getCvUrl = async (userId: string): Promise<CVFile | null> => {
        try {
            const { data: files, error } = await supabase.storage
                .from("resumes")
                .list(`${userId}/`);

            if (error || !files || files.length === 0) {
                return null;
            }

            const cvFile = files[0];
            const { data } = supabase.storage
                .from("resumes")
                .getPublicUrl(`${userId}/${cvFile.name}`);

            if (data?.publicUrl) {
                return {
                    name: cvFile.name,
                    url: data.publicUrl,
                    size: cvFile.metadata?.size || 0,
                    uploadedAt: cvFile.created_at || new Date().toISOString(),
                };
            }
        } catch (error) {
            console.error("Error fetching CV:", error);
        }
        return null;
    };

    useEffect(() => {
        getCvUrl(userId).then((file) => {
            setCvFile(file);
            setCvFetch(false);
        });
    }, [userId]);

    return (
        <div className="w-full mx-auto">
            <div className="grid sm:grid-cols-2 sm:flex-row gap-4">
                {/* Drag & Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex-1 relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                    ${isDragging ? 'border-gray-500 bg-gray-50 scale-105' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                    ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
                >
                    <input
                        type="file"
                        accept={acceptedExtensions.join(',')}
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />

                    <div className="space-y-3">
                        <div className="flex justify-center">
                            {uploading ? (
                                <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Upload className="w-12 h-12 text-gray-600" />
                            )}
                        </div>

                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                {uploading ? 'Uploading...' : isDragging ? 'Drop your CV here' : 'Drop your CV here or click to browse'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                PDF, DOC, DOCX • Max 2MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Uploaded File or No CV */}
                <div className="flex-1 flex flex-col justify-center">
                    {/* Error Message */}
                    {error && (
                        <div className="w-full p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Current CV Display */}
                    {!cvFetch && cvFile && (
                        <div className="w-full flex flex-col p-4 h-full bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between my-auto">
                                <div className="flex items-start space-x-3 flex-1">
                                    <FileText className="w-8 h-8 text-gray-600 flex-shrink-0 mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {cvFile.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatFileSize(cvFile.size)} • Uploaded {new Date(cvFile.uploadedAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    window.open(cvFile.url, '_blank')
                                                }}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={handleRemoveCV}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No CV State */}
                    {!cvFetch && !cvFile && !uploading && (
                        <div className="w-full text-center py-4">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No CV uploaded yet</p>
                        </div>
                    )}

                    {/* Alternative Upload Button */}
                    {!cvFile && !uploading && (
                        <Button asChild className="w-full mt-4">
                            <label className="cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                Choose CV File
                                <input
                                    type="file"
                                    accept={acceptedExtensions.join(',')}
                                    onChange={handleFileInput}
                                    hidden
                                />
                            </label>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}