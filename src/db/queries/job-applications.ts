import { and, asc, gte, lte, desc, eq, ilike, or } from "drizzle-orm";
import db from "..";
import {
  ApplicationStatus,
  jobApplications,
  jobOffers,
  JobSeekerProfile,
  jobSeekerProfiles,
  users,
} from "../schema";

export async function hasUserApplied(userId: string, jobId: string) {
  try {
    const application = await db.query.jobApplications.findFirst({
      where: (applications) =>
        eq(applications.userId, userId) && eq(applications.jobId, jobId),
    });

    return !!application;
  } catch (error) {
    console.error("Database error: Failed to check application status:", error);
    throw new Error("Failed to check application status");
  }
}

interface JobApplicationData {
  jobId: string;
  userId: string;
  coverLetter: string;
}
export async function applyForJob(data: JobApplicationData) {
  try {
    const alreadyApplied = await hasUserApplied(data.userId, data.jobId);

    if (alreadyApplied) {
      throw new Error("You have already applied for this job");
    }

    const result = await db
      .insert(jobApplications)
      .values({
        jobId: data.jobId,
        userId: data.userId,
        coverLetter: data.coverLetter,
        status: "pending",
        appliedAt: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database error: Failed to create job application:", error);
    throw error;
  }
}

export interface FilteredJobApplication {
  id: string;
  jobId: string;
  userId: string;
  email: string | null;
  fullName: string | null;
  status: ApplicationStatus;
  appliedAt: Date;
  coverLetter: string;
}

export interface PaginatedApplications {
  data: FilteredJobApplication[];
  count: number;
}

export interface ApplicationSearchParams {
  userId?: string;
  status?: Array<ApplicationStatus>;
  query?: string;
  dateFrom?: Date;
  dateTo?: Date;

  page?: number;
  pageSize?: number;
  sortDirection?: "asc" | "desc";
}

export async function getFilteredJobApplications(
  offerId: string,
  params: ApplicationSearchParams = {},
): Promise<PaginatedApplications> {
  const {
    userId,
    status = [],
    query = "",
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
    sortDirection = "desc",
  } = params;

  const offset = (page - 1) * pageSize;

  const filters: any[] = [];

  if (offerId) {
    filters.push(eq(jobApplications.jobId, offerId));
  }

  if (userId) {
    filters.push(eq(jobApplications.userId, userId));
  }

  if (status.length > 0) {
    filters.push(or(...status.map((s) => eq(jobApplications.status, s))));
  }

  if (query) {
    filters.push(ilike(users.fullName, `%${query}%`));
  }

  if (dateFrom) {
    filters.push(gte(jobApplications.appliedAt, dateFrom));
  }
  if (dateTo) {
    filters.push(lte(jobApplications.appliedAt, dateTo));
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  try {
    const countRow = await db
      .select({ count: jobApplications.id })
      .from(jobApplications)
      .leftJoin(users, eq(users.id, jobApplications.userId))
      .where(whereClause);

    const count = countRow.length;

    const rows = await db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        userId: jobApplications.userId,
        email: users.email,
        fullName: users.fullName,
        status: jobApplications.status,
        appliedAt: jobApplications.appliedAt,
        coverLetter: jobApplications.coverLetter,
      })
      .from(jobApplications)
      .leftJoin(users, eq(users.id, jobApplications.userId))
      .leftJoin(jobOffers, eq(jobOffers.id, jobApplications.jobId))
      .where(whereClause)
      .orderBy(
        sortDirection === "asc"
          ? asc(jobApplications.appliedAt)
          : desc(jobApplications.appliedAt),
      )
      .limit(pageSize)
      .offset(offset);

    const data: FilteredJobApplication[] = rows.map((row) => ({
      id: row.id,
      jobId: row.jobId,
      userId: row.userId,
      email: row.email,
      fullName: row.fullName ?? null,
      status: row.status,
      appliedAt: row.appliedAt,
      coverLetter: row.coverLetter,
    }));

    return {
      data,
      count,
    };
  } catch (error) {
    console.error(
      "Database error: Failed to fetch filtered job applications:",
      error,
    );
    throw new Error("Failed to fetch job applications");
  }
}

export async function getJobApplicationById(
  appId: string,
): Promise<(FilteredJobApplication & JobSeekerProfile) | null> {
  try {
    const [row] = await db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        jobTitle: jobOffers.title,
        userId: jobApplications.userId,
        status: jobApplications.status,
        appliedAt: jobApplications.appliedAt,
        coverLetter: jobApplications.coverLetter,

        fullName: users.fullName,
        email: users.email,

        createdAt: jobSeekerProfiles.createdAt,
        phoneNumber: jobSeekerProfiles.phoneNumber,
        skills: jobSeekerProfiles.skills,
        education: jobSeekerProfiles.education,
        locationPreference: jobSeekerProfiles.locationPreference,
        linkedInUrl: jobSeekerProfiles.linkedInUrl,
      })
      .from(jobApplications)
      .leftJoin(users, eq(users.id, jobApplications.userId))
      .leftJoin(jobOffers, eq(jobOffers.id, jobApplications.jobId))
      .leftJoin(jobSeekerProfiles, eq(jobSeekerProfiles.userId, users.id))
      .where(eq(jobApplications.id, appId));

    if (!row) return null;

    if (row.status === "pending") {
      await db
        .update(jobApplications)
        .set({ status: "reviewed" })
        .where(eq(jobApplications.id, appId));
    }

    return {
      id: row.id,
      jobId: row.jobId,
      userId: row.userId,
      fullName: row.fullName ?? null,
      email: row.email ?? null,
      status: row.status === "pending" ? "reviewed" : row.status, // reflect new status immediately
      appliedAt: row.appliedAt,
      coverLetter: row.coverLetter,
      createdAt: row.createdAt ?? null,
      phoneNumber: row.phoneNumber ?? null,
      skills: row.skills ?? null,
      education: row.education ?? null,
      locationPreference: row.locationPreference ?? null,
      linkedInUrl: row.linkedInUrl ?? null,
    };
  } catch (error) {
    console.error(
      `Database error: Failed to fetch job application by ID (${appId}):`,
      error,
    );
    throw new Error("Failed to fetch job application");
  }
}

export async function getApplicantFullNameByApplicationId(
  applicationId: string,
): Promise<string | null> {
  try {
    const [row] = await db
      .select({ fullName: users.fullName })
      .from(jobApplications)
      .leftJoin(users, eq(users.id, jobApplications.userId))
      .where(eq(jobApplications.id, applicationId));

    return row?.fullName ?? null;
  } catch (error) {
    console.error(
      `Database error: Failed to fetch fullName for application ID ${applicationId}:`,
      error,
    );
    throw new Error("Failed to fetch applicant full name");
  }
}

export async function changeApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
) {
  try {
    const [application] = await db
      .update(jobApplications)
      .set({ status })
      .where(eq(jobApplications.id, applicationId))
      .returning();

    return application;
  } catch (error) {
    console.error(
      `Database error: Failed to update status of application ID ${applicationId}:`,
      error,
    );
    throw new Error("Failed to update applicant status");
  }
}
