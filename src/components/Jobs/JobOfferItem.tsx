import { FilteredJobOffer } from "@/db/queries";
import { EMPLOYMENT_TYPES, getLabelById, JOB_LEVELS, WORKING_MODES } from "@/mapping";
import { Briefcase, Clock, DollarSign, Layers } from "lucide-react";
import Link from "next/link";
import React from "react";

const JobOfferItem = ({ jobOffer }: { jobOffer: FilteredJobOffer }) => {
  let formattedSalary;

  if (jobOffer.minSalary && jobOffer.maxSalary)
    formattedSalary = `${jobOffer.minSalary.toLocaleString("pl-PL")} - ${jobOffer.maxSalary.toLocaleString("pl-PL")} ${jobOffer.currency}`;

  return (
    <Link href={`/jobs/view/${jobOffer.id}`} className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4 hover:bg-gray-100 transition-colors">
      <span className="font-semibold text-lg">{jobOffer.title}</span>

      <div className="mt-2 flex gap-2 items-center">
        <DollarSign className="w-4 h-4" />
        <span className="text-sm font-medium text-green-500">{formattedSalary}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <div className="px-2 flex items-center gap-1 py-1 text-xs rounded-full bg-gray-700 text-gray-200">
          <Briefcase className="w-3 h-3" />
          <span>{getLabelById(EMPLOYMENT_TYPES, jobOffer.employmentType)}</span>
        </div>

        <div className="px-2 flex items-center gap-1 py-1 text-xs rounded-full bg-gray-700 text-gray-200">
          <Layers className="w-3 h-3" />
          <span>{getLabelById(JOB_LEVELS, jobOffer.jobLevel)}</span>
        </div>

        <div className="px-2 flex items-center gap-1 py-1 text-xs rounded-full bg-gray-700 text-gray-200">
          <Clock className="w-3 h-3" />
          <span>{getLabelById(WORKING_MODES, jobOffer.workingMode)}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-3 mt-2 border-t border-gray-700">
        <img
          width={48}
          height={48}
          src={jobOffer.logoUrl ?? ""}
          alt={`${jobOffer.companyName} logo`}
          className="h-12 w-12 rounded-full object-cover"
        />

        <div className="flex flex-col justify-center">
          <span className="font-semibold">{jobOffer.companyName}</span>
          <span className="text-sm text-gray-700">{jobOffer.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default JobOfferItem;
