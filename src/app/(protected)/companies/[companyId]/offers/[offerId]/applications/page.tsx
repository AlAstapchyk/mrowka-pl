import StatusBadge from "@/components/Companies/Applications/StatusBadge";
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
                {applications.map((application) => (
                    <div
                        key={application.id}
                        className="flex rounded-xl border border-black py-4 px-4 hover:bg-gray-200 transition-colors"
                    >
                        <Link
                            className="w-full"
                            href={`${process.env.NEXT_PUBLIC_SITE_URL}/companies/${companyId}/offers/${offerId}/applications/${application.id}`}
                        >
                            <div className="space-y-1 flex">
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">
                                        {application.fullName ?? "Unnamed applicant"}
                                    </span>
                                    {application.email && (
                                        <p className="text-sm text-gray-600">{application.email}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                        {application.coverLetter}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center ml-auto">
                                    <StatusBadge status={application.status} />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default page;
