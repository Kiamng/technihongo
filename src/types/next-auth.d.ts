import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userName: string;
      email: string;
      role: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userId: string;
    userName: string;
    email: string;
    role: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    userName: string;
    email: string;
    role: string;
    token: string;
  }
}
