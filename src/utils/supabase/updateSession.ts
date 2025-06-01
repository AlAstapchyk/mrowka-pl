import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the user is trying to access a protected route, but isn't authenticated
  const exactPublicRoutes = new Set([
    "/",
    "/jobs",
    "/register",
    "/login",
    "/auth/reset-password",
    "/auth/update-password",
    "/api/auth/confirm-email",
    "/goodbye",
  ]);

  const publicRoutePrefixes = ["/jobs/view"];

  if (!user && !isPublicRoute(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;

  function isPublicRoute(pathname: string): boolean {
    return (
      exactPublicRoutes.has(pathname) ||
      publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
    );
  }
}
