import { eq } from "drizzle-orm";
import db from "..";
import { users } from "../schema";

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
