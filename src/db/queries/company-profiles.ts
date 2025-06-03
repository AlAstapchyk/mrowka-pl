import { eq } from "drizzle-orm";
import db from "..";
import { CompanyProfile, companyProfiles } from "../schema";

export async function getCompanyProfileById(companyId: string) {
  try {
    const [companyProfile] = await db
      .select()
      .from(companyProfiles)
      .where(eq(companyProfiles.companyId, companyId))
      .limit(1);

    return companyProfile;
  } catch (error) {
    console.error("Error fetching company profile by ID:", error);
    throw new Error("Error fetching company profile by ID");
  }
}

export async function updateCompanyProfile(
  companyId: string,
  data: Partial<CompanyProfile>,
): Promise<CompanyProfile | null> {
  const [updated] = await db
    .update(companyProfiles)
    .set({
      industry: data.industry ?? null,
      website: data.website ?? null,
      companySize: data.companySize ?? null,
      companyDescription: data.companyDescription ?? null,
    })
    .where(eq(companyProfiles.companyId, companyId))
    .returning();

  return updated || null;
}

export async function createCompanyProfile(
  data: CompanyProfile,
): Promise<CompanyProfile> {
  const [inserted] = await db
    .insert(companyProfiles)
    .values({
      companyId: data.companyId,
      industry: data.industry ?? null,
      website: data.website ?? null,
      companySize: data.companySize ?? null,
      companyDescription: data.companyDescription ?? null,
    })
    .returning();

  return inserted;
}

export async function deleteCompanyProfile(companyId: string): Promise<void> {
  await db
    .delete(companyProfiles)
    .where(eq(companyProfiles.companyId, companyId));
}
