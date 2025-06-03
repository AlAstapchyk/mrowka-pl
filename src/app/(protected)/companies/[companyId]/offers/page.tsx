import NotFound from "@/app/not-found";
import JobOfferItemManagement from "@/components/Jobs/JobOfferItemManagement";
import { Button } from "@/components/ui/button";
import { getCompanyById } from "@/db/queries/companies";
import { getFilteredJobOffers } from "@/db/queries/job-offers";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: Promise<{ companyId: string }> }) => {
    const companyId = (await params).companyId;
    const company = await getCompanyById(companyId);

    if (!company) NotFound();

    const { data: jobOffers, count } = await getFilteredJobOffers({ companyId });

    return (
        <div className="mb-4">
            <div className="flex mb-4">
                <h2 className="text-2xl font-semibold mb-4">Job offers of {company?.name}</h2>
                <Button className="felx ml-auto bg-black text-white hover:bg-gray-800" variant={"default"} asChild>
                    <Link href={`/companies/${company?.id}/offers/new`}>
                        New Job Offer
                    </Link>
                </Button>
            </div>
            <div>
                <p className="mb-4">{company?.name} has <b className="font-serif">{count}</b> job offers</p>
            </div>
            <div className="gap-4 grid">
                {jobOffers.map((jobOffer, idx) => (
                    <div
                        key={idx}
                    >
                        <JobOfferItemManagement jobOffer={jobOffer} />
                    </div>))
                }
            </div>
        </div>
    );
};

export default page;
