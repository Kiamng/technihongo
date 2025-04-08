"use client";
import { useState, useEffect, Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SideNavItem } from "./navigation-items";

import { NavItems } from "@/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        JSON.stringify(isSidebarExpanded),
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
          "transition-all duration-300 ease-in-out transform hidden sm:flex bg-white dark:bg-black sticky top-0",
        )}
      >
        <aside className="flex flex-col w-full break-words px-5 overflow-x-hidden columns-1 gap-y-5 min-h-screen">
          <div className="relative py-6 flex flex-row items-center justify-between duration-100 border-b-[1px]">
            <div className="font-semibold text-base ">
              {isSidebarExpanded ? "Username " : ""}
            </div>
            <Button
              className="rounded-full"
              size={"icon"}
              onClick={toggleSidebar}
            >
              {isSidebarExpanded ? (
                <ChevronLeft
                  className="stroke-foreground text-white"
                  size={16}
                />
              ) : (
                <ChevronRight
                  className="stroke-foreground text-white"
                  size={16}
                />
              )}
            </Button>
          </div>
          {/* Navigation Links */}
          {navItems.map((section, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col space-y-2">
                <div className="font-semibold text-base duration-100 relative">
                  {isSidebarExpanded ? section.sectionName : ""}
                </div>
                {section.sectionList.map((item, idx) => (
                  <Fragment key={idx}>
                    <div className="space-y-1">
                      <SideNavItem
                        active={item.active}
                        icon={item.icon}
                        isSidebarExpanded={isSidebarExpanded}
                        label={item.name}
                        path={item.href}
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
