import { eq } from "drizzle-orm";
import db from ".";
import { companies, jobOffers, users } from "./schema";

export async function getUsers() {
  try {
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

// Function to check if a user exists and insert/update
export async function upsertUser(
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
        email,
        fullName,
        role,
      });
      console.log("New user inserted into the database.");
    } else {
      // If user exists, update their data (if necessary)
      await db
        .update(users)
        .set({ fullName, role })
        .where(eq(users.email, email));
      console.log("Existing user data updated.");
    }
  } catch (error) {
    console.error("Error inserting/updating user:", error);
    throw new Error("Error inserting/updating user");
  }
}

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

export async function getCompanies() {
  try {
    const allUsers = await db.select().from(companies);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}
