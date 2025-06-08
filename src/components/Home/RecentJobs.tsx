import React from "react";
import JobOfferItem from "../Jobs/JobOfferItem";
import { getFilteredJobOffers } from "@/db/queries/job-offers";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const RecentJobs = async () => {
  const { data: jobOfferItems } = await getFilteredJobOffers({ pageSize: 6, sortDirection: "desc" });

  return (
    <div className="container py-6">
      <div className="flex justify-between">
        <h1 className="mb-10 text-3xl font-semibold">Recent job offers</h1>
        <Button asChild variant={"outline"} className="bg-white text-black">
          <Link href="/jobs">
            <span>View all Jobs</span>
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {jobOfferItems.map((item: any) => (
          <JobOfferItem key={item.id} jobOffer={item} />
        ))}
      </div>
    </div>
  );
};

export default RecentJobs;
