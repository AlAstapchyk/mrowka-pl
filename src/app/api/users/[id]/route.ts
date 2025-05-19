"use server";
import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/db/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (typeof id !== "string")
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  try {
    const user = await getUserById(id);

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userData = await req.json();

  try {
    const updatedUser = await updateUser(id, userData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User update failed" },
        { status: 400 },
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
