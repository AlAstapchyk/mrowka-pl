import { NextRequest, NextResponse } from "next/server";
import { JobLevel, EmploymentType, WorkingMode } from "@/db/schema";
import { JobSearchParams } from "@/types";
import {
  createJobOfferByCompanyId,
  getFilteredJobOffers,
} from "@/db/queries/job-offers";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Extract search parameters
    const query = url.searchParams.get("query") || undefined;
    const location = url.searchParams.get("location") || undefined;
    const jobLevel = (url.searchParams.getAll("jobLevel") as JobLevel[]) || [];
    const minSalary = url.searchParams.has("minSalary")
      ? Number(url.searchParams.get("minSalary"))
      : undefined;
    const workingMode =
      (url.searchParams.getAll("workingMode") as WorkingMode[]) || [];
    const employmentType =
      (url.searchParams.getAll("employmentType") as EmploymentType[]) || [];

    // Pagination params
    const page = url.searchParams.has("page")
      ? Number(url.searchParams.get("page"))
      : 1;
    const pageSize = url.searchParams.has("pageSize")
      ? Number(url.searchParams.get("pageSize"))
      : 10;
    const sortDirection =
      url.searchParams.get("sortDirection") === "asc" ? "asc" : "desc";

    // Prepare search params
    const searchParams: JobSearchParams = {
      query,
      location,
      jobLevel,
      minSalary,
      workingMode,
      employmentType,
      page,
      pageSize,
      sortDirection: sortDirection as "asc" | "desc",
    };

    const { data, count } = await getFilteredJobOffers(searchParams);

    return NextResponse.json({
      jobs: data,
      totalCount: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error("Error fetching job offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch job offers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: validate company membership

    const body = await request.json();

    const jobOffer = await createJobOfferByCompanyId(body);

    return NextResponse.json(jobOffer, { status: 201 });
  } catch (error) {
    console.error("Error creating job offer:", error);
    return NextResponse.json(
      { error: "Failed to create job offer" },
      { status: 500 },
    );
  }
}
