import "./globals.css";
import { Nunito } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/components/core/common/providers/react-query-provider";
import { AuthProvider } from "@/components/core/common/providers/auth-provider";
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
      <body className={nunito.className}>
        <AuthProvider>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
