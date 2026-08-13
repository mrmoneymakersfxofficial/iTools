import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Compute token once for all auth-protected routes
  const needsAuth = pathname.startsWith("/admin") || pathname.startsWith("/cuenta") || pathname.startsWith("/checkout");
  const token = needsAuth
    ? await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })
    : null;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin role
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect account routes
  if (pathname.startsWith("/cuenta")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect checkout
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect cms routes
  if (pathname.startsWith("/cms") && !pathname.startsWith("/cms/login")) {
    const studioAuth = request.cookies.get("SANITY_STUDIO_AUTH");
    if (!studioAuth?.value) {
      return NextResponse.redirect(new URL("/cms/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cuenta/:path*", "/checkout/:path*", "/cms/:path*"],
};