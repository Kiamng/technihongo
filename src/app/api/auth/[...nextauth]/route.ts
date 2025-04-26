// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

// import { googleLogin, login } from "@/app/api/auth/auth.api";

// const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const user = await login(credentials?.email!, credentials?.password!);

//           if (user && user.role === "Student") {
//             return user;
//           }

//           return null;
//         } catch (error) {
//           console.error("Login failed", error);

//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (account && account.provider === "google") {
//         try {
//           const response = await googleLogin(account.access_token as string);

//           if (response) {
//             token.userId = response.userId;
//             token.studentId = response.studentId;
//             token.userName = response.userName;
//             token.email = response.email;
//             token.role = response.role;
//             token.token = response.token;
//           }
//         } catch (error) {
//           console.error("Google Login failed", error);
//         }
//       } else if (user) {
//         token.userId = user.userId;
//         token.studentId = user.studentId;
//         token.userName = user.userName;
//         token.email = user.email;
//         token.profileImg = user.profileImg;
//         token.role = user.role;
//         token.token = user.token;
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.userId,
//         studentId: token.studentId,
//         userName: token.userName,
//         email: token.email,
//         profileImg: token.profileImg,
//         role: token.role,
//         token: token.token,
//       };

//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "jwt" },
// };
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";

import { authOptions } from "@/lib/authOption";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
