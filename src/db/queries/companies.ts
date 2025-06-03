import { eq } from "drizzle-orm";
import db from "..";
import {
  companies,
  Company,
  companyMembers,
  CompanyProfile,
  companyProfiles,
} from "../schema";

export interface CompanyData {
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  companySize?: "micro" | "small" | "medium" | "large" | "enterprise";
  companyDescription?: string;
}

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

export async function getUserCompanies(userId: string) {
  try {
    const userCompanies = await db
      .select({
        company: {
          id: companies.id,
          name: companies.name,
          description: companies.description,
          logoUrl: companies.logoUrl,
          createdBy: companies.createdBy,
          createdAt: companies.createdAt,
        },
        companyProfile: {
          companyId: companyProfiles.companyId,
          industry: companyProfiles.industry,
          website: companyProfiles.website,
          companySize: companyProfiles.companySize,
          companyDescription: companyProfiles.companyDescription,
          updatedAt: companyProfiles.updatedAt,
        },
        memberRole: companyMembers.role,
      })
      .from(companyMembers)
      .innerJoin(companies, eq(companyMembers.companyId, companies.id))
      .leftJoin(companyProfiles, eq(companyProfiles.companyId, companies.id))
      .where(eq(companyMembers.userId, userId));

    return userCompanies;
  } catch (error) {
    console.error("Error fetching user companies:", error);
    throw new Error("Failed to fetch user companies");
  }
}

export async function checkCompanyNameExists(name: string) {
  try {
    const existingCompany = await db.query.companies.findFirst({
      where: eq(companies.name, name),
    });
    return !!existingCompany;
  } catch (error) {
    console.error("Error checking company name:", error);
    throw new Error("Failed to check company name");
  }
}

export async function registerCompany(userId: string, data: CompanyData) {
  try {
    // Start transaction
    return await db.transaction(async (tx) => {
      // 1. Create company
      const [newCompany] = await tx
        .insert(companies)
        .values({
          name: data.name,
          description: data.description || null,
          createdBy: userId,
        })
        .returning();

      // 2. Add user as admin member
      const [companyMember] = await tx
        .insert(companyMembers)
        .values({
          userId,
          companyId: newCompany.id,
          role: "admin",
        })
        .returning();

      return {
        company: newCompany,
        member: companyMember,
      };
    });
  } catch (error) {
    console.error("Error registering company:", error);
    throw new Error("Failed to register company");
  }
}

export async function updateCompanyById(
  companyId: string,
  data: CompanyData,
): Promise<{
  company: Company;
  companyProfile: CompanyProfile | null;
}> {
  return await db.transaction(async (tx) => {
    const [updatedCompany] = await tx
      .update(companies)
      .set({
        name: data.name,
        description: data.description ?? null,
      })
      .where(eq(companies.id, companyId))
      .returning();

    if (!updatedCompany) {
      throw new Error("Company not found or update failed");
    }

    const [existingProfile] = await tx
      .select()
      .from(companyProfiles)
      .where(eq(companyProfiles.companyId, companyId))
      .limit(1);

    let profileResult: CompanyProfile | null = null;

    const hasAnyProfileData =
      data.industry != null ||
      data.website != null ||
      data.companySize != null ||
      data.companyDescription != null;

    if (hasAnyProfileData) {
      if (existingProfile) {
        const [updatedProfile] = await tx
          .update(companyProfiles)
          .set({
            industry: data.industry ?? null,
            website: data.website ?? null,
            companySize: data.companySize ?? null,
            companyDescription: data.companyDescription ?? null,
          })
          .where(eq(companyProfiles.companyId, companyId))
          .returning();

        profileResult = updatedProfile;
      } else {
        const [insertedProfile] = await tx
          .insert(companyProfiles)
          .values({
            companyId,
            industry: data.industry ?? null,
            website: data.website ?? null,
            companySize: data.companySize ?? null,
            companyDescription: data.companyDescription ?? null,
          })
          .returning();

        profileResult = insertedProfile;
      }
    } else {
      if (existingProfile) {
        await tx
          .delete(companyProfiles)
          .where(eq(companyProfiles.companyId, companyId));
        profileResult = null;
      }
    }

    return {
      company: updatedCompany,
      companyProfile: profileResult,
    };
  });
}

// export async function addCompanyMember(
//   companyId: string,
//   userId: string,
//   role: "admin" | "recruiter",
//   requestingUserId: string
// ) {
//   try {
//     return await db.transaction(async (tx) => {
//       // Check if requesting user is admin of the company
//       const requestingMember = await tx.query.companyMembers.findFirst({
//         where: and(
//           eq(companyMembers.companyId, companyId),
//           eq(companyMembers.userId, requestingUserId)
//         ),
//       });

//       if (!requestingMember || requestingMember.role !== "admin") {
//         throw new Error("Only company admins can add members");
//       }

//       // Check if user is already a member
//       const existingMember = await tx.query.companyMembers.findFirst({
//         where: and(
//           eq(companyMembers.companyId, companyId),
//           eq(companyMembers.userId, userId)
//         ),
//       });

//       if (existingMember) {
//         throw new Error("User is already a member of this company");
//       }

//       // Add new member
//       const [newMember] = await tx
//         .insert(companyMembers)
//         .values({
//           userId,
//           companyId,
//           role,
//         })
//         .returning();

//       return newMember;
//     });
//   } catch (error) {
//     console.error("Error adding company member:", error);
//     throw error;
//   }
// }
