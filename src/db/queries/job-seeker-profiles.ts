import { eq } from "drizzle-orm";
import db from "..";
import { JobSeekerProfile, jobSeekerProfiles } from "../schema";

export async function upsertJobSeekerProfile(profileData: JobSeekerProfile) {
  try {
    const upsertedProfile = await db
      .insert(jobSeekerProfiles)
      .values([
        {
          userId: profileData.userId,
          phoneNumber: profileData?.phoneNumber,
          skills: profileData?.skills,
          education: profileData?.education,
          locationPreference: profileData?.locationPreference,
          linkedInUrl: profileData?.linkedInUrl,
        },
      ])
      .onConflictDoUpdate({
        target: jobSeekerProfiles.userId,
        set: {
          phoneNumber: profileData?.phoneNumber,
          skills: profileData?.skills,
          education: profileData?.education,
          locationPreference: profileData?.locationPreference,
          linkedInUrl: profileData?.linkedInUrl,
        },
      })
      .returning();

    return upsertedProfile[0];
  } catch (error: any) {
    console.error("Error upserting job seeker profile:", error.message);
    throw new Error("Error upserting job seeker profile");
  }
}

export async function getJobSeekerProfileByUserId(userId: string) {
  try {
    const profile = await db
      .select()
      .from(jobSeekerProfiles)
      .where(eq(jobSeekerProfiles.userId, userId))
      .limit(1)
      .execute();

    if (!profile || profile.length === 0) {
      console.log(`Job seeker profile for user ${userId} not found.`);
      return null;
    }

    return profile[0];
  } catch (error) {
    console.error(
      "Error fetching job seeker profile:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("Error fetching job seeker profile");
  }
}
