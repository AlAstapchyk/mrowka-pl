import React from "react";
import { getCompanyMembers } from "@/db/queries/company-members";
import MemberCard from "@/components/Companies/Members/MemberCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = async ({ params }: { params: Promise<{ companyId: string }> }) => {
    const companyId = (await params).companyId;
    const members = await getCompanyMembers(companyId);

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-4">Company Members</h1>

            <div className="space-y-4">
                {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>

            <h2 className="text-2xl font-semibold my-4">
                Add a new member
            </h2>

            <div className="flex gap-4 max-w-md">
                <Input placeholder="Email" type="email" />
                <Button variant={"outline"}>Send Invitation</Button>
            </div>
        </div>
    );
};

export default Page;