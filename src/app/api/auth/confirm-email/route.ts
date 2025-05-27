import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { upsertUser } from "@/db/queries/users";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/";
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  const response = new NextResponse(null, {
    status: 302,
    headers: {
      Location: redirectTo.toString(),
    },
  });

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.log("OTP verification error:", error.message);
      response.headers.set("Location", "/error");
      return response;
    }

    const codeVerifierCookie = request.cookies
      .getAll()
      .find((cookie) => cookie.name.endsWith("-auth-token-code-verifier"));

    if (codeVerifierCookie) response.cookies.delete(codeVerifierCookie.name);

    const user = data?.user;

    if (user && user.email) {
      try {
        await upsertUser(
          user.id,
          user.email,
          user.user_metadata.full_name ?? "",
          user.user_metadata.role ?? "job_seeker",
        );
      } catch (error) {
        response.headers.set("Location", "/error");
        return response;
      }

      return response;
    }
  }

  response.headers.set("Location", "/error");
  return response;
}
