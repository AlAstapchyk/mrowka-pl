import { NextRequest, NextResponse } from "next/server";
import {
  getCompanyLogoUrl,
  updateCompanyLogoUrl,
} from "@/db/queries/companies";
import { createClient } from "@/utils/supabase/server";
import { getCompanyMemberRoleByUserIdAndCompanyId } from "@/db/queries/company-members";

export async function GET(
  request: NextRequest,
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

    const logoUrl = await getCompanyLogoUrl(companyId);

    if (!logoUrl) {
      return NextResponse.json(
        { error: "Logo url not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      logoUrl,
    });
  } catch (error) {
    console.error("Error fetching Logo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const body = await request.json();
    const logoUrl = body.logoUrl;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (await params).companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 },
      );
    }

    const memberRole = await getCompanyMemberRoleByUserIdAndCompanyId(
      user.id,
      companyId,
    );
    if (!memberRole) {
      return NextResponse.json(
        { error: "No membership in company" },
        { status: 400 },
      );
    }

    if (logoUrl !== null && typeof logoUrl !== "string") {
      return NextResponse.json(
        { error: "Logo URL must be a string or null" },
        { status: 400 },
      );
    }

    const data = await updateCompanyLogoUrl(companyId, logoUrl);

    if (!data) {
      return NextResponse.json(
        { error: "Company not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating logo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
