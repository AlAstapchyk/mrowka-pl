import { companyMembers, jobApplications, jobOffers } from "@/db/schema";
import { createClient } from "./server";
import db from "@/db";
import { and, eq } from "drizzle-orm";

type ResumeFile = {
  signedUrl: string;
  size: number;
  uploadedAt: string;
  fileName: string;
};

export async function getSignedResumeUrl(applicationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [application] = await db
    .select({
      userId: jobApplications.userId,
      jobOfferId: jobApplications.jobId,
    })
    .from(jobApplications)
    .where(eq(jobApplications.id, applicationId))
    .limit(1);

  if (!application) return null;

  if (user.id === application.userId) return sign(application.userId);

  const [{ companyId }] = await db
    .select({ companyId: jobOffers.companyId })
    .from(jobOffers)
    .where(eq(jobOffers.id, application.jobOfferId))
    .limit(1);

  const [recruiter] = await db
    .select({ id: companyMembers.id })
    .from(companyMembers)
    .where(
      and(
        eq(companyMembers.userId, user.id),
        eq(companyMembers.companyId, companyId),
      ),
    )
    .limit(1);

  if (recruiter) return sign(user.id);

  return null;

  async function sign(userId: string): Promise<ResumeFile | null> {
    try {
      const { data: files, error } = await supabase.storage
        .from("resumes")
        .list(`${userId}/`);

      if (error || !files || files.length === 0) {
        return null;
      }

      const resumeFile = files[0];
      const fullPath = `${userId}/${resumeFile.name}`;

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("resumes")
          .createSignedUrl(fullPath, 60 * 5);

      if (signedUrlError || !signedUrlData?.signedUrl) {
        return null;
      }

      return {
        signedUrl: signedUrlData.signedUrl,
        size: resumeFile.metadata?.size || 0,
        uploadedAt: resumeFile.created_at || new Date().toISOString(),
        fileName: resumeFile.name,
      };
    } catch (error) {
      console.error("Error fetching resume:", error);
      return null;
    }
  }
}

export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("avatars")
      .list(`${userId}/`);

    if (error) {
      console.error("Error listing resume files:", error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    const file = data[0];

    const { data: publicUrlData } = await supabase.storage
      .from("avatars")
      .getPublicUrl(`${userId}/${file.name}`);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error("Error fetching resume URL:", err);
    return null;
  }
};
