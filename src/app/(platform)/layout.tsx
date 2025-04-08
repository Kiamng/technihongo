import Header from "@/components/core/common/header/home-header";
import { ThemeProvider } from "@/components/core/common/providers/theme-provider";
import Navigation from "@/components/core/common/sidebar/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen flex flex-col">
      <ThemeProvider enableSystem attribute="class" defaultTheme="system">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white">
          <Header />
        </div>

        <div className="flex flex-row flex-1 overflow-hidden">
          <Navigation />

          {/* Phần children sẽ cuộn */}
          <div
            className="flex-1 overflow-y-auto pl-6 bg-secondary max-h-screen"
            style={{ maxHeight: "calc(100vh - 73px)" }}
          >
            {children}
          </div>
        </div>
      </ThemeProvider>
    </section>
  );
}
