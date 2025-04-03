import React from "react";
import JobOffersList from "../JobOffersList";

const OffersOfTheDay = () => {
  return (
    <div className="container py-6">
      <h1 className="mb-10 text-3xl font-semibold">Offers of the day</h1>
      <JobOffersList />
    </div>
  );
};

export default OffersOfTheDay;
