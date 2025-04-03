import JobOfferItem from "@/components/JobOfferItem";
import SearchFilter from "@/components/Search/SearchFilter";
import React from "react";

const page = () => {
  return (
    <div className="container mt-4 flex">
      <div className="options">
        <SearchFilter />
      </div>

      <main className="mt-4 ml-4 flex flex-grow flex-col">
        <h1 className="mb-2 text-2xl font-bold">Seaching</h1>

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

        <hr></hr>
        <div className="my-4 grid gap-4">
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
          <JobOfferItem />
        </div>

        <span>Pagination . . .</span>
      </main>
    </div>
  );
};

export default page;
