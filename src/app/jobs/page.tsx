import JobOffersPagination from "@/components/Jobs/JobOffersPagination";
import JobSearch from "@/components/Jobs/JobSearch";
import SearchFilter from "@/components/Jobs/SearchFilter";
import React, { Suspense } from "react";

const page = async () => {
  return (
    <div className="container mt-4 flex">
      <Suspense fallback={<></>} >
        <div className="options">
          <SearchFilter />
        </div>


        <main className="mt-4 ml-4 flex flex-grow flex-col gap-4">
          <div>
            <h1 className="mb-4 text-2xl font-bold text-center">Searching</h1>

            <div className="flex border border-black p-4 rounded-xl">
              <JobSearch />
            </div>
          </div>

          <JobOffersPagination />
        </main>
      </Suspense>
    </div>
  );
};

export default page;
