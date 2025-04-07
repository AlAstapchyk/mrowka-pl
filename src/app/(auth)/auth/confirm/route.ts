import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Supabase client
import { upsertUser } from "@/db/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = await createClient();

    // Verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.log("OTP verification error:", error.message);
      redirectTo.pathname = "/error";
      return NextResponse.redirect(redirectTo);
    }

    const user = data?.user;

    if (user && user.email) {
      // Call the upsertUser function to insert or update the user data
      try {
        await upsertUser(
          user.email,
          user.user_metadata.full_name ?? "",
          user.user_metadata.role ?? "job_seeker",
        );
      } catch (error) {
        redirectTo.pathname = "/error";
        return NextResponse.redirect(redirectTo);
      }

      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // If OTP verification fails or there's an error, redirect to the error page
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
