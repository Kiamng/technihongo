import Header from "@/components/core/common/header/home-header";
import { ThemeProvider } from "@/components/core/common/providers/theme-provider";
import Navigation from "@/components/core/common/sidebar/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen">
      <ThemeProvider enableSystem attribute="class" defaultTheme="system">
        <Header />
        <div className="flex flex-row flex-1 overflow-hidden bg-secondary">
          <Navigation />
          <div className="flex-1 overflow-y-auto pl-5 min-h-screen ">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </section>
  );
}
