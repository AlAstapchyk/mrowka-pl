import { getApplicantFullNameByApplicationId } from "@/db/queries/job-applications";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    const applicationId = (await params)?.applicationId;

    if (!applicationId)
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 },
      );

    const fullName = await getApplicantFullNameByApplicationId(applicationId);

    if (!fullName)
      return NextResponse.json(
        { error: "Job Application not found" },
        { status: 404 },
      );

    return NextResponse.json({ fullName });
  } catch (error) {
    console.error("Error fetching aplicant's fullname:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
