import React from "react";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const JobOfferCardHeader = ({
  jobOffer,
  alreadyApplied,
  role
}: {
  jobOffer: any;
  alreadyApplied: boolean;
  role?: string;
}) => {
  return (
    <div className="border-b border-black pb-6 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {jobOffer.logoUrl && (
            <Link href={`/companies/view/${jobOffer.companyId}`} className="flex h-16 w-16 items-center justify-center cursor-pointer">
              <img
                src={jobOffer.logoUrl ?? "Company's logo"}
                alt={`${jobOffer.companyName} logo`}
                className="max-h-full max-w-full"
              />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{jobOffer.title}</h1>
            <Link href={`/companies/view/${jobOffer.companyId}`} className="font-medium text-gray-700 ">{jobOffer.companyName}</Link>
          </div>
        </div>

        <Button
          asChild
          variant="default"
          className="ml-auto bg-black text-white hover:bg-gray-800 max-sm:hidden"
          disabled={role === "recruiter"}
        >
          {alreadyApplied ? (
            <div
              className="pointer-events-none flex cursor-not-allowed items-center gap-2 opacity-50"
              aria-disabled="true"
            >
              Already applied
            </div>
          ) : (
            <Link
              href={`/jobs/apply/${jobOffer.id}`}
              className="flex items-center gap-2"
            >
              <span>Apply</span>
              <ArrowRight />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
};

export default JobOfferCardHeader;
