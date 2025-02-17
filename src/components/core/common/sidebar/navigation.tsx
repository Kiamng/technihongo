"use client";
import { useState, useEffect, Fragment } from "react";
import { NavItems } from "@/config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SideNavItem } from "./navigation-items";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "../theme-toggle-button";

const Navigation = () => {
  const navItems = NavItems();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = window.localStorage.getItem("sidebarExpanded");
    if (saved !== null) {
      setIsSidebarExpanded(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      window.localStorage.setItem(
        "sidebarExpanded",
        JSON.stringify(isSidebarExpanded)
      );
    }
  }, [isSidebarExpanded, isMounted]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  if (!isMounted) return null;

  return (
    <div className="pr-4">
      <div
        className={cn(
          isSidebarExpanded ? "w-[288px]" : "w-[80px]",
          "border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full bg-white dark:bg-black"
        )}
      >
        <aside className="flex h-full flex-col w-full break-words px-5 overflow-x-hidden columns-1 gap-y-5">
          <div className="relative  py-6 flex flex-row items-center justify-between duration-100 border-b-[1px]">
            <ThemeToggleButton />
            <div className="technihongo">
              {isSidebarExpanded ? "Technihongo" : ""}
            </div>
            <Button
              onClick={toggleSidebar}
              size={"icon"}
              className="rounded-full "
            >
              {isSidebarExpanded ? (
                <ChevronLeft
                  size={16}
                  className="stroke-foreground text-white"
                />
              ) : (
                <ChevronRight
                  size={16}
                  className="stroke-foreground text-white"
                />
              )}
            </Button>
          </div>
          <div className="relative  pb-6 flex flex-row items-center justify-between duration-100 border-b-[1px]">
            <div className="font-semibold text-base ">
              {isSidebarExpanded ? "Username " : ""}
            </div>
          </div>
          {/* Navigation Links */}

          {navItems.map((section, index) => (
            <div key={index} className="relative ">
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-base duration-100 relative">
                  {isSidebarExpanded ? section.sectionName : ""}
                </div>
                {section.sectionList.map((item, idx) => (
                  <Fragment key={idx}>
                    <div className="space-y-1">
                      <SideNavItem
                        label={item.name}
                        icon={item.icon}
                        path={item.href}
                        active={item.active}
                        isSidebarExpanded={isSidebarExpanded}
                      />
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Navigation;
