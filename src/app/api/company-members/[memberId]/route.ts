import {
  deleteMember,
  getCompanyMemberRoleByUserIdAndCompanyId,
  updateMemberRole,
} from "@/db/queries/company-members";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  try {
    const memberId = (await params).memberId;
    const body = await req.json();

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO:Add member validation

    const updated = await updateMemberRole(memberId, body.role);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update member role" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  try {
    const memberId = (await params).memberId;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO:Add member validation

    const deleted = await deleteMember(memberId);

    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 },
    );
  }
}
