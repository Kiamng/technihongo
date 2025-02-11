import { ThemeProvider } from "@/components/core/common/providers/theme-provider";
import Navigation from "@/components/core/common/sidebar/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex flex-row h-screen gap-4">
          <Navigation />
          <div className="flex-1 overflow-x-auto">
            <div className="sm:h-[calc(99vh-60px)] overflow-auto">
              <div className="w-full flex pl-4 overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                <div className="w-full p-5 md:max-w-6xl">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </section>
  );
}
