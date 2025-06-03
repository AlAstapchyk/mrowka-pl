import { and, asc, desc, eq, gte, ilike, or } from "drizzle-orm";
import {
  companies,
  jobApplications,
  JobOffer,
  jobOffers,
  savedJobs,
} from "../schema";
import { JobSearchParams } from "@/types";
import db from "..";

export interface FilteredJobOffer {
  id: string;
  title: string;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  location: string;
  employmentType: string;
  jobLevel: string;
  workingMode: string;
  companyId: string | null;
  companyName: string | null;
  logoUrl: string | null;
}
// offers without description
export async function getFilteredJobOffers(
  params: JobSearchParams & {
    userId?: string;
    isSaved?: boolean;
    isApplied?: boolean;
    companyId?: string;
  } = {},
) {
  const {
    query = "",
    location = "",
    jobLevel = [],
    workingMode = [],
    employmentType = [],
    minSalary = 0,
    page = 1,
    pageSize = 999_999,
    sortDirection = "desc",
    userId,
    isSaved = false,
    isApplied = false,
    companyId,
  } = params;

  const offset = (page - 1) * pageSize;
  const filters = [];

  if (query) {
    filters.push(
      or(
        ilike(jobOffers.title, `%${query}%`),
        ilike(companies.name, `%${query}%`),
      ),
    );
  }

  if (location) {
    filters.push(ilike(jobOffers.location, `%${location}%`));
  }

  if (jobLevel.length > 0) {
    filters.push(or(...jobLevel.map((level) => eq(jobOffers.jobLevel, level))));
  }

  if (workingMode.length > 0) {
    filters.push(
      or(...workingMode.map((mode) => eq(jobOffers.workingMode, mode))),
    );
  }

  if (employmentType.length > 0) {
    filters.push(
      or(...employmentType.map((type) => eq(jobOffers.employmentType, type))),
    );
  }

  if (minSalary > 0) {
    filters.push(gte(jobOffers.maxSalary, minSalary));
  }

  if (isSaved && userId) {
    filters.push(eq(savedJobs.userId, userId));
  }

  if (isApplied && userId) {
    filters.push(eq(jobApplications.userId, userId));
  }

  if (companyId) {
    filters.push(eq(jobOffers.companyId, companyId));
  }

  const whereClause = filters.length ? and(...filters) : undefined;
  const sortColumn = jobOffers.createdAt;

  // Build COUNT query
  const countQuery = db
    .select({ count: jobOffers.id })
    .from(jobOffers)
    .leftJoin(companies, eq(companies.id, jobOffers.companyId));

  if (isSaved) {
    countQuery.leftJoin(savedJobs, eq(savedJobs.jobId, jobOffers.id));
  }

  if (isApplied) {
    countQuery.leftJoin(
      jobApplications,
      eq(jobApplications.jobId, jobOffers.id),
    );
  }

  const countResult = await countQuery.where(whereClause);
  const totalCount = countResult.length;

  // Build DATA query
  const dataQuery = db
    .select({
      id: jobOffers.id,
      title: jobOffers.title,
      minSalary: jobOffers.minSalary,
      maxSalary: jobOffers.maxSalary,
      currency: jobOffers.currency,
      location: jobOffers.location,
      employmentType: jobOffers.employmentType,
      jobLevel: jobOffers.jobLevel,
      workingMode: jobOffers.workingMode,
      companyId: companies.id,
      companyName: companies.name,
      logoUrl: companies.logoUrl,
    })
    .from(jobOffers)
    .leftJoin(companies, eq(companies.id, jobOffers.companyId));

  if (isSaved) {
    dataQuery.leftJoin(savedJobs, eq(savedJobs.jobId, jobOffers.id));
  }

  if (isApplied) {
    dataQuery.leftJoin(
      jobApplications,
      eq(jobApplications.jobId, jobOffers.id),
    );
  }

  const data: FilteredJobOffer[] = await dataQuery
    .where(whereClause)
    .orderBy(sortDirection === "asc" ? asc(sortColumn) : desc(sortColumn))
    .limit(pageSize)
    .offset(offset);

  return {
    data,
    count: totalCount,
  };
}

export async function getJobOfferTitleById(offerId: string) {
  try {
    const jobOffer = await db
      .select({
        title: jobOffers.title,
      })
      .from(jobOffers)
      .where(eq(jobOffers.id, offerId))
      .limit(1);

    return jobOffer?.[0]?.title ?? null;
  } catch (error) {
    console.error("Error fetching job offer by ID:", error);
    throw new Error("Error fetching job offer");
  }
}

export async function getJobOfferById(offerId: string) {
  try {
    const jobOffer = await db
      .select({
        id: jobOffers.id,
        title: jobOffers.title,
        minSalary: jobOffers.minSalary,
        maxSalary: jobOffers.maxSalary,
        currency: jobOffers.currency,
        location: jobOffers.location,
        employmentType: jobOffers.employmentType,
        jobLevel: jobOffers.jobLevel,
        workingMode: jobOffers.workingMode,
        description: jobOffers.description,
        companyId: companies.id,
        companyName: companies.name,
        logoUrl: companies.logoUrl,
      })
      .from(jobOffers)
      .leftJoin(companies, eq(companies.id, jobOffers.companyId))
      .where(eq(jobOffers.id, offerId))
      .limit(1);

    return jobOffer[0] ?? null;
  } catch (error) {
    console.error("Error fetching job offer by ID:", error);
    throw new Error("Error fetching job offer");
  }
}

export async function createJobOfferByCompanyId(
  data: JobOffer & { companyId: string; postedBy: string },
) {
  try {
    const [existingTitle] = await db
      .select({ title: jobOffers.title })
      .from(jobOffers)
      .where(
        and(
          eq(jobOffers.companyId, data.companyId),
          eq(jobOffers.title, data.title.trim()),
        ),
      )
      .catch();

    if (existingTitle) {
      throw new Error(
        "A job offer with this title already exists for the company.",
      );
    }

    const inserted = await db
      .insert(jobOffers)
      .values({
        title: data.title.trim(),
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        currency: data.currency,
        location: data.location,
        employmentType: data.employmentType,
        jobLevel: data.jobLevel,
        workingMode: data.workingMode,
        description: data.description,
        companyId: data.companyId,
        postedBy: data.postedBy,
      })
      .returning();

    return inserted[0] ?? null;
  } catch (error: any) {
    console.error("Error creating job offer:", error);
    throw new Error(error.message || "Error creating job offer");
  }
}
