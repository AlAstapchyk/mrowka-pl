import JobOfferItem from "@/components/Jobs/JobOfferItem";
import { getFilteredJobOffers } from "@/db/queries/job-offers";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Applied Jobs | Mrowka.pl",
};

const page = async () => {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) throw new Error("User is not authenticated");

  const { data: appliedJobs, count } = await getFilteredJobOffers({
    userId: user?.id,
    isApplied: true,
  });

  return (
    <div className="container my-4 flex flex-col">
      <h1 className="mb-4 text-3xl font-semibold">Applied jobs</h1>
      <p className="mb-8 text-xl">
        You have <b className="font-serif">{count}</b> applied offers:
      </p>
      <div className="grid grid-cols-2 gap-4">
        {appliedJobs.map((job, i) => (
          <JobOfferItem jobOffer={job} key={i} />
        ))}
      </div>
    </div>
  );
};

export default page;
