
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApplicationStatus } from "@/db/schema";

interface ActionButtonsProps {
    applicationId: string;
    currentStatus: ApplicationStatus;
}

const ActionButtons = ({ applicationId, currentStatus }: ActionButtonsProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: string) => {
        if (newStatus === currentStatus) return;

        setIsUpdating(true);
        try {
            const response = await axios.patch(`/api/job-applications/${applicationId}/status`, {
                status: newStatus
            });

            toast.success(`Application ${newStatus} successfully`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update application status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex gap-4">
            <Button
                variant="outline"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isUpdating || currentStatus === "rejected"}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                {isUpdating && currentStatus !== "rejected" ? "Rejecting..." : "Reject Application"}
            </Button>
            <Button
                onClick={() => handleStatusUpdate("accepted")}
                disabled={isUpdating || currentStatus === "accepted"}
                className="bg-green-600 hover:bg-green-700"
            >
                {isUpdating && currentStatus !== "accepted" ? "Accepting..." : "Accept Application"}
            </Button>
        </div>
    );
};

export default ActionButtons;