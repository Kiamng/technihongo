import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/sign-in", "/login", "/"];
const authRoutes = ["/home"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const hasCookie = req.headers
    .get("cookie")
    ?.includes("next-auth.session-token");

  console.log("Path:", pathname, "Token:", token, "Has Cookie:", hasCookie);

  if (!token && hasCookie) {
    return NextResponse.redirect(new URL(req.url, req.url));
  }

  if (!token && authRoutes.some((path) => pathname.startsWith(path))) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (token && publicRoutes.some((path) => pathname.startsWith(path))) {
    if (pathname !== "/home") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/login", "/home"],
};
