import { eq } from "drizzle-orm";
import db from ".";
import { companies, jobOffers, jobSeekerProfiles, users } from "./schema";

// #region Users

export async function getUsers() {
  try {
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .execute();

    if (!user || user.length === 0) {
      console.log(`User with id ${id} not found.`);
      return null;
    }

    return user[0];
  } catch (error) {
    console.error(
      "Error fetching user:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("Error fetching user");
  }
}

export async function updateUser(id: string, userData: any) {
  try {
    const updatedUser = await db
      .update(users)
      .set({
        fullName: userData.fullName,
      })
      .where(eq(users.id, id))
      .returning();

    return updatedUser[0]; // Return the updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
}

// When user confirms email and creates new profile
// Function to check if a user exists and insert/update
export async function upsertUser(
  id: string,
  email: string,
  fullName: string,
  role: string,
) {
  try {
    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1); // Limit to one result

    if (existingUser.length === 0) {
      // If user doesn't exist, insert a new user
      await db.insert(users).values({
        id,
        email,
        fullName,
        role,
      });
      console.log("New user inserted into the database.");
    } else {
      // If user exists, update their data (if necessary)
      await db
        .update(users)
        .set({ fullName, role, id })
        .where(eq(users.email, email));
      console.log("Existing user data updated.");
    }
  } catch (error) {
    console.error("Error inserting/updating user:", error);
    throw new Error("Error inserting/updating user");
  }
}

export async function upsertJobSeekerProfile(userId: string, profileData: any) {
  try {
    const upsertedProfile = await db
      .insert(jobSeekerProfiles)
      .values([
        {
          userId,
          phoneNumber: profileData?.phoneNumber,
          resumeLink: profileData?.resumeLink,
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
          resumeLink: profileData?.resumeLink,
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

//#endregion

// #region Job Offers

export async function getJobOffers() {
  try {
    const allJobOffers = await db.select().from(jobOffers);
    return allJobOffers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

export async function getJobOfferItems() {
  try {
    const allJobOffers = await db
      .select({
        id: jobOffers.id,
        title: jobOffers.title,
        salaryRange: jobOffers.salaryRange,
        location: jobOffers.location,
        companyName: companies.name, // Join the companies table and get the company name
        logoUrl: companies.logo_url,
      })
      .from(jobOffers)
      .leftJoin(companies, eq(companies.id, jobOffers.companyId));

    return allJobOffers;
  } catch (error) {
    console.error("Error fetching job offers:", error);
    throw new Error("Error fetching job offers");
  }
}

//#endregion

export async function getCompanies() {
  try {
    const allUsers = await db.select().from(companies);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}
