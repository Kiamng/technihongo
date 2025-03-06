import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/sign-in", "/login", "/"];
const authRoutes = ["/home", "/flashcard", "/course"];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log("Path:", pathname, "Token:", token);

  // Nếu user đã đăng nhập và đang cố vào trang public -> chuyển hướng về /home
  if (token && publicRoutes.includes(pathname) && pathname !== "/home") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Nếu user chưa đăng nhập và cố vào trang yêu cầu auth -> chuyển hướng về /login
  if (!token && authRoutes.includes(pathname) && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"], // Loại trừ các route không cần middleware xử lý
};
