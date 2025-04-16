import ThemeToggleButton from "../theme-toggle-button";

import { UserNav } from "./user-nav";

const Header = () => {
  return (
    <div
      className="w-full flex flex-row justify-between items-center px-6 md:px-10 py-4 border-b bg-primary"
      suppressHydrationWarning={true}
    >
      <div className="flex items-center space-x-2 transition-transform hover:scale-105">
        <span className="text-2xl font-bold text-white">TechNihongo</span>
      </div>

      <div className="flex flex-row items-center space-x-4">
        <ThemeToggleButton />
        <div className="h-6 w-[1px] bg-border/40" />
        <UserNav />
      </div>
    </div>
  );
};

export default Header;
