import React from "react";
import JobOfferItem from "./JobOfferItem";
import { getFilteredJobOffers } from "@/db/queries/job-offers";

const JobOffersList = async () => {
  const { data: jobOfferItems } = await getFilteredJobOffers({ pageSize: 6 });

  return (
    <div className="grid grid-cols-3 gap-6">
      {jobOfferItems.map((item: any) => (
        <JobOfferItem key={item.id} jobOffer={item} />
      ))}
    </div>
  );
};

export default JobOffersList;
