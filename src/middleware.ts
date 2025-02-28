import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Các trang public mà không cần đăng nhập (sign-in, login, v.v.)
const publicRoutes = ["/sign-in", "/login", "/"];

// Các trang yêu cầu đăng nhập (home, dashboard, profile, v.v.)
const authRoutes = ["/home", "/flashcard", "/course"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Kiểm tra token trên console (optional)
  console.log("Path:", pathname, "Token:", token);

  // Nếu user đã đăng nhập và cố gắng truy cập các trang public -> Chuyển hướng về /home
  if (token && publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Nếu user chưa đăng nhập và cố gắng truy cập các trang yêu cầu auth -> Chuyển hướng về /login
  if (!token && authRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Cho phép request tiếp tục nếu không vi phạm điều kiện trên
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
