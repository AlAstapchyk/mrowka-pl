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
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (!user || user.length === 0) {
      console.error(`User with id ${id} not found.`);
      return null;
    }

    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
}

export async function getUserRoleById(id: string) {
  try {
    const result = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!result || result.length === 0) {
      console.log(`User with id ${id} not found.`);
      return null;
    }

    return result[0].role;
  } catch (error) {
    console.error(
      "Error fetching user role:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("Error fetching user role");
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

export async function getUserAvatarUrl(userId: string) {
  try {
    const [{ avatarUrl }] = await db
      .select({ avatarUrl: users.avatarUrl })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return avatarUrl;
  } catch (error: any) {
    console.error("Error fetching user avatar url:", error);
    throw new Error("Error fetching user avatar url");
  }
}

export async function updateUserAvatarUrl(userId: string, avatarUrl: string) {
  try {
    const [data] = await db
      .update(users)
      .set({ avatarUrl: avatarUrl })
      .where(eq(users.id, userId))
      .returning({ id: users.id, avatarUrl: users.avatarUrl });

    return data.avatarUrl;
  } catch (error: any) {
    console.error("Error fetching user avatar url:", error);
    throw new Error("Error fetching user avatar url");
  }
}
