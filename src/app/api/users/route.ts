import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "@/db/schema"; // Adjust the path according to your project structure
import { NextResponse } from "next/server"; // Importing the Next.js response helper
import { getUsers } from "@/db/queries";

const connectionString = process.env.DATABASE_URL ?? "";

// Initialize the PostgreSQL client
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

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
