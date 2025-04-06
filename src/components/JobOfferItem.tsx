import React from "react";

// Define the types for the props that will be passed to the component
interface JobOfferItemProps {
  title: string; // Job title (e.g., "C# Senior Developer")
  salary: string; // Salary (e.g., "12000 zl / month")
  companyName: string; // Company name (e.g., "Microsoft Inc.")
  location: string; // Location (e.g., "Warsaw, Wola")
  logoUrl: string; // URL for the company logo (e.g., "url_to_logo_image")
}

const JobOfferItem: React.FC<JobOfferItemProps> = ({
  title,
  salary,
  companyName,
  location,
  logoUrl,
}) => {
  return (
    <div className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4">
      {/* Job Title */}
      <span className="font-semibold">{title}</span>

      {/* Salary */}
      <span className="text-sm">{salary}</span>

      <div className="flex gap-2 pt-2">
        {/* Company Logo */}
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="h-12 w-12 rounded-full"
        />

        <div className="flex flex-col">
          {/* Company Name */}
          <span className="text-sm font-semibold">{companyName}</span>

          {/* Job Location */}
          <span className="text-sm">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default JobOfferItem;
