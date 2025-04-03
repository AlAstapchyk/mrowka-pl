import React from "react";
import JobOfferItem from "./JobOfferItem";

const JobOffersList = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <JobOfferItem />
      <JobOfferItem />
      <JobOfferItem />
      <JobOfferItem />
      <JobOfferItem />
      <JobOfferItem />
    </div>
  );
};

export default JobOffersList;
