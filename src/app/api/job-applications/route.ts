import { applyForJob } from "@/db/queries/job-applications";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { jobId, userId, coverLetter } = await req.json();

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
