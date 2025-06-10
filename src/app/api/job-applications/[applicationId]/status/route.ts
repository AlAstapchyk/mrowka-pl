import { changeApplicationStatus } from "@/db/queries/job-applications";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: validate company membership

    const applicationId = (await params)?.applicationId;

    if (!applicationId)
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 },
      );

    const body = await request.json();

    const application = await changeApplicationStatus(
      applicationId,
      body.status,
    );

    if (!application)
      return NextResponse.json(
        { error: "Job Application not found" },
        { status: 404 },
      );

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Error updating aplicant's status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
