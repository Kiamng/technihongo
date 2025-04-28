import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      studentId: string;
      userName: string;
      email: string;
      profileImg: string;
      role: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userId: string;
    studentId: string;
    userName: string;
    email: string;
    profileImg: string;
    role: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    studentId: string;
    userName: string;
    email: string;
    profileImg: string;
    role: string;
    token: string;
  }
}
