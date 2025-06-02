import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserRoleById } from "@/db/queries/users";
import {
  checkCompanyNameExists,
  CompanyData,
  registerCompany,
} from "@/db/queries/companies";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = await getUserRoleById(user.id);
    if (!userRole)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (userRole !== "recruiter") {
      return NextResponse.json(
        { error: "Only recruiters can register companies" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      industry,
      website,
      companySize,
      companyDescription,
    } = body;

    const trimedName = name.trim();

    if (
      !trimedName ||
      typeof trimedName !== "string" ||
      trimedName.length === 0
    )
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 },
      );

    if (website && website.trim() !== "") {
      try {
        new URL(website);
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL" },
          { status: 400 },
        );
      }
    }

    const nameExists = await checkCompanyNameExists(trimedName);
    if (nameExists) {
      return NextResponse.json(
        { error: "Company with this name already exists" },
        { status: 409 },
      );
    }

    const companyData: CompanyData = {
      name: trimedName,
      description: description?.trim() || undefined,
      industry: industry?.trim() || undefined,
      website: website?.trim() || undefined,
      companySize,
      companyDescription: companyDescription?.trim() || undefined,
    };

    const result = await registerCompany(user.id, companyData);

    return NextResponse.json(
      {
        message: "Company registered successfully",
        companyId: result.company.id,
        company: result.company,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
