import { getFilteredJobApplications } from "@/db/queries/job-applications";
import { getJobOfferTitleById } from "@/db/queries/job-offers";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: Promise<{ companyId: string, offerId: string }> }) => {
    const resolvedParams = await params;
    const companyId = resolvedParams.companyId;
    const offerId = resolvedParams.offerId;
    const offerTitle = await getJobOfferTitleById(offerId);

    const { data: applications, count } = await getFilteredJobApplications(offerId);

    return (
        <div className="mb-4">
            <div className="flex mb-4">
                <h2 className="text-2xl font-semibold mb-4 mr-4">Job Applications for {offerTitle} position</h2>
            </div>

            <div>
                <p className="mb-4"><b className="font-serif">{count}</b> applicants for {offerTitle} position</p>
            </div>

            <div className="gap-4 grid">
                {applications.map((application, idx) => (
                    <div key={idx}>
                        <Link className="hover:underline" href={`${process.env.NEXT_PUBLIC_SITE_URL}/companies/${companyId}/offers/${offerId}/applications/${application.id}`}>
                            {JSON.stringify(application)}
                        </Link>
                    </div>))
                }
            </div>
        </div>
    );
};

export default page;
