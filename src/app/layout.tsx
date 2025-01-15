import { ThemeProvider } from "@/components/core/common/providers/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Nunito } from "next/font/google";

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
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
