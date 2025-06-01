import { eq } from "drizzle-orm";
import db from "..";
import { companies, Company } from "../schema";

export async function getCompanies() {
  try {
    const allCompanies = await db.select().from(companies);
    return allCompanies as Company[];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

export async function getCompanyById(id: string) {
  try {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id));

    if (result.length === 0) {
      return null;
    }

    return result[0] as Company;
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    throw new Error("Error fetching company by ID");
  }
}
