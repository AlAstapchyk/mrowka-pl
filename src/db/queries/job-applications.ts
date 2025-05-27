import { eq } from "drizzle-orm";
import db from "..";
import { jobApplications } from "../schema";

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
