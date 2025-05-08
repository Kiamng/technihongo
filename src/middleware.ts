import type { NextRequest } from "next/server";

// import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/Login", "/verify"];
const authRoutes = [
  "/flashcard",
  "/course",
  "/subscription-plan",
  "/learning-path",
  "/learning-statistic",
  "/profile",
  "/saved-content",
  "/transactions",
  // "/subscription-history",
  "/achievement",
  "/meeting",
  "/translate",
  "/payment",
];

export default async function middleware(req: NextRequest) {
  try {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const token = req.cookies.get("__Secure-next-auth.session-token");
    const { pathname } = req.nextUrl;

    console.log("Path:", pathname, "Token:", token);

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (token && isPublicRoute && pathname !== "/course") {
      return NextResponse.redirect(new URL("/course", req.url));
    }

    if (!token && isAuthRoute && pathname !== "/Login") {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.next();
    }

    if (!isPublicRoute && !isAuthRoute) {
      return NextResponse.redirect(new URL("/not_found", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    return NextResponse.redirect(new URL("/not_found", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|assets|media|not_found).*)"],
};
