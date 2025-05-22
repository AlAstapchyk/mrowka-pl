"use client";

import { useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { JobSearchParams } from "@/types";
import { EmploymentType, JobLevel, WorkingMode } from "@/db/schema";

export function useJobSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Parse current search params from URL
  const currentParams: JobSearchParams = {
    query: searchParams.get("query") || "",
    location: searchParams.get("location") || "",
    jobLevel: searchParams.getAll("jobLevel") as JobLevel[],
    minSalary: searchParams.has("minSalary")
      ? Number(searchParams.get("minSalary"))
      : undefined,
    workingMode: searchParams.getAll("workingMode") as WorkingMode[],
    employmentType: searchParams.getAll("employmentType") as EmploymentType[],
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.has("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 10,
    sortDirection:
      (searchParams.get("sortDirection") as "asc" | "desc") || "desc",
  };

  const updateSearchParams = useCallback(
    (newParams: Partial<JobSearchParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Handle regular string/number parameters
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else if (!Array.isArray(value)) {
          params.set(key, String(value));
        }
      });

      // Handle array parameters
      if (newParams.jobLevel) {
        params.delete("jobLevel");
        newParams.jobLevel.forEach((level: string) =>
          params.append("jobLevel", level),
        );
      }

      if (newParams.workingMode) {
        params.delete("workingMode");
        newParams.workingMode.forEach((mode: string) =>
          params.append("workingMode", mode),
        );
      }

      if (newParams.employmentType) {
        params.delete("employmentType");
        newParams.employmentType.forEach((type: string) =>
          params.append("employmentType", type),
        );
      }

      // Reset to page 1 if any param (except `page`) is changed
      const isChangingAnythingButPage = Object.keys(newParams).some(
        (key) => key !== "page",
      );

      if (isChangingAnythingButPage) {
        params.set("page", "1");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, router, pathname],
  );

  return {
    params: currentParams,
    updateParams: updateSearchParams,
    isPending,
  };
}
