import { getCompanyById } from "@/db/queries/companies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const companyId = (await params).companyId;
    const company = await getCompanyById(companyId);

    if (!company) {
      return NextResponse.json(
        { error: "Failed to find company" },
        { status: 404 },
      );
    }

    return NextResponse.json(company);
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 },
    );
  }
}
