import { updateCompanyById } from "@/db/queries/companies";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const companyId = (await params).companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const updatedCompany = await updateCompanyById(companyId, body);

    if (!updatedCompany) {
      return NextResponse.json(
        { error: "Company not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Company updated successfully",
        company: updatedCompany,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
