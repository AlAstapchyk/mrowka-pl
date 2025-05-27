import db from "..";
import { companies } from "../schema";

export async function getCompanies() {
  try {
    const allUsers = await db.select().from(companies);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}
