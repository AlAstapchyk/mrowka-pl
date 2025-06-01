import { getCompanyById } from "@/db/queries/companies";
import React from "react";

const page = async ({ params }: { params: Promise<{ companyId: string }> }) => {
    const companyId = (await params).companyId;
    const company = await getCompanyById(companyId);

    return <div className="flex flex-col container my-4">{company?.name}</div>;
};

export default page;
