"use client"

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CompanyMemberRole } from "@/db/schema";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CompanyMemberData } from "@/db/queries/company-members";

export default function MemberCard({ member }: { member: CompanyMemberData }) {
    const [role, setRole] = useState(member.role);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRoleChange = async (newRole: CompanyMemberRole) => {
        if (newRole === role) return;

        setIsUpdating(true);
        try {
            await axios.put(`/api/company-members/${member.id}`, { role: newRole })
            setRole(newRole);
        } catch (error) {
            toast.error("Failed to update role");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm(`Are you sure you want to remove ${member.fullName}?`);
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await axios.delete(`/api/members/${member.id}`);
            window.location.reload();
        } catch (error) {
            toast.error("Failed to delete member");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex rounded-xl border border-black py-4 px-4 space-y-2">
            <div className="pr-4">
                <div className="text-lg font-medium">{member.fullName}</div>
                <div className="text-sm text-gray-600">
                    Joined At:{" "}
                    {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : "Not specified"}
                </div>
            </div>

            <div className="flex ml-auto my-auto gap-2">
                <Select value={role} onValueChange={handleRoleChange} disabled={isUpdating || !!member.createdBy}>
                    <SelectTrigger className="w-32 cursor-pointer">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem className="cursor-pointer" value="admin">Admin</SelectItem>
                        <SelectItem className="cursor-pointer" value="recruiter">Recruiter</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant={"destructive"}
                >
                    {isDeleting ? "Removing..." : "X"}
                </Button>
            </div>
        </div>
    );
}