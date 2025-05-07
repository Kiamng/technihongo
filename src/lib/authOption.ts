// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { googleLogin, login } from "@/app/api/auth/auth.api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await login(credentials?.email!, credentials?.password!);

          if (user && user.role === "Student") {
            return user;
          }

          return null;
        } catch (error) {
          console.error("Login failed", error);

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === "google") {
        try {
          const response = await googleLogin(account.access_token as string);

          if (response) {
            token.userId = response.userId;
            token.studentId = response.studentId;
            token.userName = response.userName;
            token.email = response.email;
            token.role = response.role;
            token.token = response.token;
          }
        } catch (error) {
          console.error("Google Login failed", error);
        }
      } else if (user) {
        token.userId = user.userId;
        token.studentId = user.studentId;
        token.userName = user.userName;
        token.email = user.email;
        token.profileImg = user.profileImg;
        token.role = user.role;
        token.token = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.userId,
        studentId: token.studentId,
        userName: token.userName,
        email: token.email,
        profileImg: token.profileImg,
        role: token.role,
        token: token.token,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token", // Đảm bảo cookie có tên mạnh mẽ
      options: {
        httpOnly: true, // Chỉ server có thể truy cập cookie
        secure: process.env.NODE_ENV === "production", // Cookie chỉ được gửi qua HTTPS trong production
        sameSite: "Lax", // SameSite giúp bảo vệ chống CSRF
        path: "/", // Cookie có thể được truy cập trên toàn bộ website
        maxAge: 60 * 60 * 24 * 7, // Thời gian sống của cookie (ví dụ: 1 tuần)
      },
    },
    csrfToken: {
      name: "__Secure-next-auth.csrf-token", // Tên cookie CSRF token
      options: {
        httpOnly: true, // Chỉ có thể truy cập từ server
        secure: process.env.NODE_ENV === "production", // Cookie chỉ gửi qua HTTPS trong production
        sameSite: "Lax", // SameSite giúp bảo vệ chống CSRF
        path: "/",
      },
    },
  },
};
