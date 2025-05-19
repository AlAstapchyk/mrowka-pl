import React from "react";
import JobOfferItem from "./JobOfferItem";
import { getJobOffers } from "@/db/queries";

const JobOffersList = async () => {
  const jobOfferItems = await getJobOffers();
  const limitedItems = jobOfferItems.slice(0, 6); // get first 6 items

  return (
    <div className="grid grid-cols-3 gap-6">
      {limitedItems.map((item: any) => (
        <JobOfferItem
          key={item.id}
          id={item.id}
          title={item.title}
          salary={item.salaryRange}
          companyName={item.companyName}
          location={item.location}
          logoUrl={item.logoUrl}
        />
      ))}
    </div>
  );
};

export default JobOffersList;
