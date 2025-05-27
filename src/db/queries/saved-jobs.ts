import { and, eq } from "drizzle-orm";
import db from "..";
import { savedJobs } from "../schema";

export async function getSavedJobByJobId(userId: string, jobId: string) {
  try {
    const saved = await db
      .select({
        savedId: savedJobs.id,
        savedAt: savedJobs.savedAt,
        jobId: savedJobs.jobId,
      })
      .from(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
      .limit(1);

    return saved[0] || null;
  } catch (error) {
    console.error("Error fetching saved job by jobId:", error);
    throw new Error("Failed to fetch saved job");
  }
}

export async function addSavedJobOffer(userId: string, jobId: string) {
  try {
    await db.insert(savedJobs).values({
      userId,
      jobId,
    });
  } catch (error) {
    console.error("Error inserting saved job:", error);
    throw new Error("Error inserting saved job");
  }
}

export async function removeSavedJobOffer(userId: string, jobId: string) {
  try {
    await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
  } catch (error) {
    console.error("Error removing saved job:", error);
    throw new Error("Error removing saved job");
  }
}
