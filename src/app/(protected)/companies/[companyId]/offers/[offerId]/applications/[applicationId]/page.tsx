import { getJobApplicationById } from "@/db/queries/job-applications";
import React from "react";

const page = async ({ params }: { params: Promise<{ companyId: string, offerId: string, applicationId: string }> }) => {
    const resolvedParams = await params;
    const companyId = resolvedParams.companyId;
    const offerId = resolvedParams.offerId;
    const applicationId = resolvedParams.applicationId;
    const application = await getJobApplicationById(applicationId);

    return (
        <div>
            {JSON.stringify(application)}
        </div>
    );
};

export default page;
