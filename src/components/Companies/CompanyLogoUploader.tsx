import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    ChangeEvent,
    DragEvent,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Building2, ImageIcon, Camera } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "../ui/LoadingSpinner";
import { getCompanyLogoUrl } from "@/utils/supabase/storage-client";

interface LogoFile {
    url: string;
    fileName: string;
    size: number;
    uploadedAt: string;
}

interface CompanyLogoUploaderProps {
    companyId: string;
    currentLogoUrl?: string | null;
    onLogoUpdate?: (url: string | null) => void;
    size?: "sm" | "md" | "lg";
}

const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
];

const acceptedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const maxFileSize = 5 * 1024 * 1024;

const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
};

const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
};

export default function CompanyLogoUploader({
    companyId,
    currentLogoUrl = null,
    onLogoUpdate,
    size = "md",
}: CompanyLogoUploaderProps) {
    const [logoFile, setLogoFile] = useState<LogoFile | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const validateFile = (file: File): string | null => {
        if (!acceptedTypes.includes(file.type)) {
            return "Please upload a JPG, PNG, WebP, or GIF image.";
        }
        if (file.size > maxFileSize) {
            return "File size must be less than 5 MB.";
        }
        return null;
    };

    const extractFileNameFromUrl = (url: string): string | null => {
        try {
            const segments = url.split("/");
            const last = segments[segments.length - 1];
            return last.split("?")[0] || null;
        } catch {
            return null;
        }
    };

    const fetchExistingLogo = async () => {
        try {
            const url = await getCompanyLogoUrl(companyId);
            if (url) {
                setLogoFile({
                    url,
                    fileName: extractFileNameFromUrl(url) || "",
                    size: 0,
                    uploadedAt: new Date().toISOString(),
                });
            } else {
                setLogoFile(null);
            }
        } catch (err) {
            console.error("Error fetching logo:", err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchExistingLogo();
    }, [companyId]);

    const uploadFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const ext = file.name.split(".").pop();
            const fileName = `logo.${ext}`;
            const fullPath = `${companyId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("company-logos")
                .upload(fullPath, file, {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: file.type,
                });
            if (uploadError) throw uploadError;

            const newUrl = await getCompanyLogoUrl(companyId);
            if (!newUrl) throw new Error("Failed to get updated logo URL");

            setLogoFile({
                url: newUrl,
                fileName,
                size: file.size,
                uploadedAt: new Date().toISOString(),
            });
            onLogoUpdate?.(newUrl);
            toast.success("Company logo updated successfully!");
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Upload failed. Please try again.");
            toast.error("Failed to upload company logo.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFile(file);
    };

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            await uploadFile(droppedFiles[0]);
        }
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (currentLogoUrl && !logoFile) {
            setLogoFile({
                url: currentLogoUrl,
                fileName: extractFileNameFromUrl(currentLogoUrl) || "",
                size: 0,
                uploadedAt: new Date().toISOString(),
            });
        }
    }, [currentLogoUrl, logoFile]);

    return (
        <div className="flex flex-col items-center space-y-2">
            {error && (
                <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`relative ${sizeClasses[size]} rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center transition-all duration-200 ${isDragging ? "ring-4 ring-gray-200 scale-105" : ""
                    } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <input
                    type="file"
                    accept={acceptedExtensions.join(",")}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />

                {isUploading ? (
                    <LoadingSpinner />
                ) : logoFile ? (
                    <Image
                        src={logoFile.url}
                        alt="Company Logo"
                        fill
                        className="object-cover"
                        sizes={`${sizeClasses[size]}`}
                    />
                ) : (
                    <Building2 className="text-gray-300" size={iconSizes[size]} />
                )}

                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${isHovering || isDragging ? "opacity-100 scale-105" : "opacity-0 scale-95 pointer-events-none"
                        }`}
                >
                    <div className="text-center text-white">
                        {isDragging ? (
                            <>
                                <ImageIcon className="w-8 h-8 mb-1 animate-bounce" />
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
            </div>

            <div className="flex space-x-2">
                <Button onClick={handleUploadClick} disabled={isUploading} variant="default" type="button" size="sm">
                    <Upload className="w-4 h-4 mr-1" />
                    {logoFile ? "Change Logo" : "Upload Logo"}
                </Button>
            </div>
        </div>
    );
}
