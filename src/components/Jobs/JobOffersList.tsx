import React from "react";
import JobOfferItem from "./JobOfferItem";
import { getFilteredJobOffers } from "@/db/queries";

const JobOffersList = async () => {
  const { data: jobOfferItems } = await getFilteredJobOffers();
  const limitedItems = jobOfferItems.slice(0, 6); // get first 6 items

  return (
    <div className="grid grid-cols-3 gap-6">
      {limitedItems.map((item: any) => (
        <JobOfferItem
          key={item.id}
          jobOffer={item}
        />
      ))}
    </div>
  );
};

export default JobOffersList;
