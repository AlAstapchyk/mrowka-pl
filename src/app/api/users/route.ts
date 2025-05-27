import { getUsers } from "@/db/queries/users";
import { NextResponse } from "next/server"; // Importing the Next.js response helper

// The GET handler for this API route
export async function GET() {
  try {
    const usersData = await getUsers();
    return NextResponse.json(usersData); // Returning the users as a JSON response
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
