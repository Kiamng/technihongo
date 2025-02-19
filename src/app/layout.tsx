import "./globals.css";
import { Nunito } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  weight: "500",
  subsets: ["vietnamese"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={nunito.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
