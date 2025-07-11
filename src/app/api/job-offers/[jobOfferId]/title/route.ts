import { getJobOfferTitleById } from "@/db/queries/job-offers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobOfferId: string }> },
) {
  try {
    const { jobOfferId } = await params;

    if (!jobOfferId)
      return NextResponse.json(
        { error: "Offer ID is required" },
        { status: 400 },
      );

    const title = await getJobOfferTitleById(jobOfferId);

    if (!title)
      return NextResponse.json(
        { error: "Job offer not found" },
        { status: 404 },
      );

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Error fetching job offer title:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
