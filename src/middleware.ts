import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/Login", "/verify"];
const authRoutes = [
  "/home",
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
];

export default async function middleware(req: NextRequest) {
  try {
    console.log("Request Headers:", req.headers);
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const token = req.cookies.get("__Secure-next-auth.session-token");
    const { pathname } = req.nextUrl;

    console.log("Path:", pathname, "Token:", token);

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Nếu user đã đăng nhập và đang cố vào trang public -> chuyển hướng về /home
    if (token && isPublicRoute && pathname !== "/course") {
      return NextResponse.redirect(new URL("/course", req.url));
    }

    // Nếu user chưa đăng nhập và cố vào trang yêu cầu auth -> chuyển hướng về /login
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
  matcher: ["/((?!api|_next|static|favicon.ico|assets|media|not_found).*)"], // Loại trừ các route không cần middleware xử lý
};
