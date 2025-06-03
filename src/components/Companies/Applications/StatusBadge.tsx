import { ApplicationStatus } from "@/db/schema";
import React from "react";

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-900";
            case "accepted":
                return "bg-green-100 text-green-900";
            case "rejected":
                return "bg-red-100 text-red-900";
            default:
                return "bg-blue-100 text-blue-900";
        }
    };

    return (
        <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full font-medium ${getStatusBadgeClass(status)}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </div>
    );
};

export default StatusBadge;
