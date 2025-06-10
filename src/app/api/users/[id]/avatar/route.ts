import { NextRequest, NextResponse } from "next/server";
import { getUserAvatarUrl, updateUserAvatarUrl } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = (await params).id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const avatarUrl = await getUserAvatarUrl(userId);

    if (!avatarUrl) {
      return NextResponse.json(
        { error: "Avatar url not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      avatarUrl: avatarUrl,
    });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = (await params).id;
    const body = await request.json();
    const avatarUrl = body.avatarUrl;

    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user || userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (avatarUrl !== null && typeof avatarUrl !== "string") {
      return NextResponse.json(
        { error: "Avatar URL must be a string or null" },
        { status: 400 },
      );
    }

    const updatedAvatarUrl = await updateUserAvatarUrl(userId, avatarUrl);

    if (!updatedAvatarUrl) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { avatarUrl: updatedAvatarUrl },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
