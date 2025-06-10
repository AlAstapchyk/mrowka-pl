"use client";

import React, { useState } from "react";
import { useJobSearch } from "@/hooks/useJobSearch";
import { useJobDataFetch } from "@/hooks/useJobDataFetch";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobSearch = () => {
  const { params, updateParams } = useJobSearch();
  const { totalCount } = useJobDataFetch();

  const [searchQuery, setSearchQuery] = useState(params.query || "");
  const [locationQuery, setLocationQuery] = useState(params.location || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({
      query: searchQuery.trim().replace(/\s+/g, " "),
      location: locationQuery,
      page: 1, // Reset to page 1 when initiating a new search
    });
  };

  const handleSortChange = (value: string) => {
    const sortDirection = value as "asc" | "desc";
    updateParams({ sortDirection });
  };

  const handlePageSizeChange = (value: string) => {
    updateParams({
      pageSize: Number(value),
      page: 1, // Reset to page 1 when changing page size
    });
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
        <div className="border-input bg-background focus-within:ring-ring flex flex-grow items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm focus-within:ring-1">
          <Search className="text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Job title or employer"
            className="w-full bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border-input bg-background focus-within:ring-ring flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm focus-within:ring-1 md:w-1/3">
          <MapPin className="text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Location"
            className="w-full bg-transparent focus:outline-none"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>

        <Button type="submit">Search</Button>
      </form>

      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 font-serif">
          <b>{totalCount}</b> job offers found
        </div>

        <div className="ml-auto flex gap-4 max-sm:flex-col">
          <Select
            value={`${params.pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="sm:w-[150px] w-[128px] cursor-pointer">
              <SelectValue placeholder="Offers on the page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="5">
                5 On page
              </SelectItem>
              <SelectItem className="cursor-pointer" value="10">
                10 On page
              </SelectItem>
              <SelectItem className="cursor-pointer" value="20">
                20 On page
              </SelectItem>
              <SelectItem className="cursor-pointer" value="50">
                50 On page
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${params.sortDirection}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="sm:w-[150px] w-[128px] cursor-pointer">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="desc">
                Newest first
              </SelectItem>
              <SelectItem className="cursor-pointer" value="asc">
                Oldest first
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
