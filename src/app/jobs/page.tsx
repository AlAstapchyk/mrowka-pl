import JobOfferItem from "@/components/Jobs/JobOfferItem";
import SearchFilter from "@/components/Jobs/SearchFilter";
import { getJobOfferItems } from "@/db/queries";
import React from "react";

const page = async () => {
  const JobOfferItems = await getJobOfferItems(); // Fetch the job offers

  return (
    <div className="container mt-4 flex">
      <div className="options">
        <SearchFilter />
      </div>

      <main className="mt-4 ml-4 flex flex-grow flex-col">
        <h1 className="mb-2 text-2xl font-bold">Searching</h1>

        <div className="flex">
          <div className="mx-auto flex h-10 max-w-[640px] grow items-center rounded-full bg-white">
            <svg className="zoom ml-2 h-6 w-6 bg-black align-middle"></svg>
            <input
              className="ml-2 flex-1"
              type="text"
              placeholder="Job title or employer"
            />
            <div className="flex justify-end">
              <div className="h-6 w-[2px] rounded-full bg-gray-700"></div>
              <input
                className="pl-2 placeholder-black"
                placeholder="Lublin"
              ></input>
              <svg className="zoom mr-2 h-6 w-6 bg-black align-middle"></svg>
            </div>
          </div>

          <button className="flex h-0 min-h-8 rounded-xl bg-red-700/25 px-2 py-1 text-sm font-semibold text-black">
            Sort by: accuracy
            <svg className="zoom ml-2 h-6 w-6 bg-black align-middle"></svg>
          </button>
        </div>

        <hr />

        {/* Job offers list */}
        <div className="my-4 grid gap-4">
          {JobOfferItems.map((item: any) => (
            <JobOfferItem
              key={item.id} // Add a unique key for each item
              title={item.title}
              salary={item.salaryRange}
              companyName={item.companyName}
              location={item.location}
              logoUrl={item.logoUrl} // Assuming 'logoUrl' is part of offer
            />
          ))}
        </div>

        <span>Pagination . . .</span>
      </main>
    </div>
  );
};

export default page;
