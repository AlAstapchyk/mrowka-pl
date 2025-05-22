"use client";

import { useState, useEffect } from "react";
import { useJobSearch } from "./useJobSearch";
import { JobSearchParams } from "@/types";

// Define the return type for your job data
interface JobData {
  jobOffers: any[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
}

export function useJobDataFetch() {
  const { params, isPending } = useJobSearch();
  const [data, setData] = useState<JobData>({
    jobOffers: [],
    totalCount: 0,
    isLoading: true,
    error: null,
  });

  // Function to fetch job data from your API
  const fetchJobData = async (searchParams: JobSearchParams) => {
    setData((prev) => ({ ...prev, isLoading: true }));

    try {
      const queryParams = new URLSearchParams();

      // Add all params to query string
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else {
            queryParams.set(key, String(value));
          }
        }
      });

      const response = await fetch(`/api/jobs?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Error fetching job data: ${response.statusText}`);
      }

      const result = await response.json();

      setData({
        jobOffers: result.jobs || [],
        totalCount: result.totalCount || 0,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching job data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error : new Error("Unknown error occurred"),
      }));
    }
  };

  // Effect to refetch data when search params change
  useEffect(() => {
    fetchJobData(params);
  }, [
    params.query,
    params.location,
    params.page,
    params.pageSize,
    params.sortDirection,
    params.minSalary,
    // Convert arrays to strings for dependency comparison
    JSON.stringify(params.jobLevel),
    JSON.stringify(params.workingMode),
    JSON.stringify(params.employmentType),
  ]);

  // Manual refetch function
  const refetch = () => fetchJobData(params);

  return {
    ...data,
    isLoading: data.isLoading || isPending,
    refetch,
  };
}
