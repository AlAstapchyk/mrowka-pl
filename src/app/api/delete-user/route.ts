import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteUserAndData } from "@/lib/auth-actions"; // or "@/actions/auth-actions" depending on your structure

export async function DELETE() {
  try {
    const user = await deleteUserAndData();

    const allCookies = (await cookies()).getAll();
    const response = NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );

    for (const cookie of allCookies) {
      response.cookies.set(cookie.name, "", {
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: error.message ?? "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
