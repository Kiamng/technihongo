import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
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
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|not_found).*)"], // Loại trừ các route không cần middleware xử lý
};
