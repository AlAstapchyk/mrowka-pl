import {
  addSavedJobOffer,
  getSavedJobByJobId,
  removeSavedJobOffer,
} from "@/db/queries/saved-jobs";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const jobId = (await params).jobId;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await addSavedJobOffer(user.id, jobId);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const jobId = (await params).jobId;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await removeSavedJobOffer(user.id, jobId);
  return NextResponse.json({ success: true });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const jobId = (await params).jobId;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedJob = await getSavedJobByJobId(user.id, jobId);
  const isSaved = !!savedJob;

  return NextResponse.json({ isSaved, savedJob });
}
