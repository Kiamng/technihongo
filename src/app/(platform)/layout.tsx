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
        <div className="flex flex-row min-h-screen overflow-hidden dark:bg-inherit bg-secondary">
          <Navigation />
          <div className="flex-1 overflow-y-auto p-10 max-h-screen ">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </section>
  );
}
