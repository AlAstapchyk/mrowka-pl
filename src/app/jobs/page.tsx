import JobOffersPagination from "@/components/Jobs/JobOffersPagination";
import JobSearch from "@/components/Jobs/JobSearch";
import SearchFilter from "@/components/Jobs/SearchFilter";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Jobs | Mrowka.pl",
};

const page = async () => {
  return (
    <div className="container mt-4 flex">
      <Suspense fallback={<></>}>
        <div className="options">
          <SearchFilter />
        </div>

        <main className="mt-4 ml-4 flex flex-grow flex-col gap-4">
          <div>
            <h1 className="mb-4 text-center text-2xl font-bold">Searching</h1>

            <div className="flex rounded-xl border border-black p-4">
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
