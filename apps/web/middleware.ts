import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedInCookie = request.cookies.get("pm_mock_signed_in");
  const isSignedIn = signedInCookie?.value === "true";

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isSignedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Protect admin dashboard routes (excluding sign-in)
  if (pathname.startsWith("/admin") && !pathname.includes("/admin/sign-in") && !isSignedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
