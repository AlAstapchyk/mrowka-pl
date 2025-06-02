import { eq } from "drizzle-orm";
import db from "..";
import { companies, CompanyMemberRole, companyMembers, users } from "../schema";

export interface CompanyMemberData {
  id: string;
  userId: string | null;
  companyId: string | null;
  role: "admin" | "recruiter";
  joinedAt: Date | null;
  fullName: string;
  email: string;
  createdBy: string | null;
}
export async function getCompanyMembers(
  companyId: string,
): Promise<CompanyMemberData[]> {
  try {
    const members = await db
      .select({
        id: companyMembers.id,
        userId: companyMembers.userId,
        companyId: companyMembers.companyId,
        role: companyMembers.role,
        joinedAt: companyMembers.joinedAt,
        fullName: users.fullName,
        email: users.email,
        createdBy: companies.createdBy,
      })
      .from(companyMembers)
      .innerJoin(users, eq(companyMembers.userId, users.id))
      .leftJoin(companies, eq(companyMembers.companyId, companies.id))
      .where(eq(companyMembers.companyId, companyId));

    return members;
  } catch (error) {
    console.error("Error fetching company members by ID:", error);
    throw new Error("Error fetching company members by ID");
  }
}

export async function updateMemberRole(
  memberId: string,
  newRole: CompanyMemberRole,
) {
  try {
    const [member] = await db
      .update(companyMembers)
      .set({ role: newRole })
      .where(eq(companyMembers.id, memberId))
      .returning();

    return member;
  } catch (error) {
    console.error("Error updating member role:", error);
    throw new Error("Failed to update member role");
  }
}

export async function deleteMember(memberId: string) {
  try {
    const [member] = await db
      .delete(companyMembers)
      .where(eq(companyMembers.id, memberId))
      .returning();
    return member;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw new Error("Failed to delete member");
  }
}
