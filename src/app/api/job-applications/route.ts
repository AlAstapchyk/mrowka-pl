import { applyForJob } from "@/db/queries/job-applications";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, coverLetter } = await req.json();
    const userId = user.id;

    if (!jobId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    await applyForJob({ jobId, userId, coverLetter });

    return NextResponse.json(
      { message: "Application submitted successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
