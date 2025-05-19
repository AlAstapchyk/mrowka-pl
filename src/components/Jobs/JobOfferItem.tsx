import Link from "next/link";
import React from "react";

interface JobOfferItemProps {
  id: string;
  title: string;
  salary: string;
  companyName: string;
  location: string;
  logoUrl: string;
}

const JobOfferItem: React.FC<JobOfferItemProps> = ({
  id,
  title,
  salary,
  companyName,
  location,
  logoUrl,
}) => {
  return (
    <Link href={`/jobs/view/${id}`} className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4">
      <span className="font-semibold">{title}</span>

      <span className="text-sm">{salary}</span>

      <div className="flex gap-2 pt-2">
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="h-12 w-12 rounded-full"
        />

        <div className="flex flex-col">
          <span className="text-sm font-semibold">{companyName}</span>

          <span className="text-sm">{location}</span>
        </div>
      </div>
    </Link>
  );
};

export default JobOfferItem;
