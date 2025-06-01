import { getUserRoleById } from "@/db/queries/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (typeof id !== "string")
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  try {
    const role = await getUserRoleById(id);

    if (!role)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ role: role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}
