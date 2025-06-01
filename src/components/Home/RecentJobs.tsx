import React from "react";
import JobOfferItem from "../Jobs/JobOfferItem";
import { getFilteredJobOffers } from "@/db/queries/job-offers";

const RecentJobs = async () => {
  const { data: jobOfferItems } = await getFilteredJobOffers({ pageSize: 6, sortDirection: "desc" });

  return (
    <div className="container py-6">
      <h1 className="mb-10 text-3xl font-semibold">Recent job offers</h1>
      <div className="grid grid-cols-3 gap-6">
        {jobOfferItems.map((item: any) => (
          <JobOfferItem key={item.id} jobOffer={item} />
        ))}
      </div>
    </div>
  );
};

export default RecentJobs;
