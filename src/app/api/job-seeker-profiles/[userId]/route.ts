import {
  getJobSeekerProfileByUserId,
  upsertJobSeekerProfile,
} from "@/db/queries/job-seeker-profiles";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }, // params is promise
) {
  const { userId } = await params;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const seeker = await getJobSeekerProfileByUserId(userId);

    if (!seeker) {
      return NextResponse.json(
        { error: "Job seeker profile is not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(seeker);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const jobSeekerProfileData = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Updating job seeker profile for userId:", userId);
  console.log(jobSeekerProfileData);

  try {
    const updatedUser = await upsertJobSeekerProfile({
      userId,
      ...jobSeekerProfileData,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Job seeker profile update failed" },
        { status: 400 },
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
