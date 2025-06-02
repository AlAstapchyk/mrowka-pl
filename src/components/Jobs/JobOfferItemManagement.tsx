import { FilteredJobOffer } from "@/db/queries/job-offers";
import {
  EMPLOYMENT_TYPES,
  getLabelById,
  JOB_LEVELS,
  WORKING_MODES,
} from "@/mapping";
import { Briefcase, Clock, DollarSign, Layers, Map } from "lucide-react";
import Link from "next/link";
import React from "react";

const JobOfferItemManagement = ({ jobOffer }: { jobOffer: FilteredJobOffer }) => {
  let formattedSalary;

  if (jobOffer.minSalary && jobOffer.maxSalary)
    formattedSalary = `${jobOffer.minSalary.toLocaleString("pl-PL")} - ${jobOffer.maxSalary.toLocaleString("pl-PL")} ${jobOffer.currency}`;

  return (
    <Link
      href={`/companies/${jobOffer.companyId}/offers/${jobOffer.id}`}

      className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4 transition-colors hover:bg-gray-100"
    >
      <span className="text-lg font-semibold">{jobOffer.title}</span>

      <div className="mt-2 flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <span className="text-sm font-medium text-green-500">
          {formattedSalary}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Map className="h-4 w-4" />
        <span className="text-sm text-gray-700">{jobOffer.location}</span>
      </div>



      <div className="mt-2 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-200">
          <Briefcase className="h-3 w-3" />
          <span>{getLabelById(EMPLOYMENT_TYPES, jobOffer.employmentType)}</span>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-200">
          <Layers className="h-3 w-3" />
          <span>{getLabelById(JOB_LEVELS, jobOffer.jobLevel)}</span>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-200">
          <Clock className="h-3 w-3" />
          <span>{getLabelById(WORKING_MODES, jobOffer.workingMode)}</span>
        </div>
      </div>


    </Link>
  );
};

export default JobOfferItemManagement;
