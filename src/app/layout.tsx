import "./globals.css";
import { Nunito } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/components/core/common/providers/react-query-provider";
import { AuthProvider } from "@/components/core/common/providers/auth-provider";
import { QuizProvider } from "@/components/core/common/providers/quiz-provider";
import { UserProvider } from "@/components/core/common/providers/user-provider";
const nunito = Nunito({
  weight: "500",
  subsets: ["vietnamese"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={nunito.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ReactQueryProvider>
            <QuizProvider>
              <UserProvider>
                {children}
                <Toaster />
              </UserProvider>
            </QuizProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
