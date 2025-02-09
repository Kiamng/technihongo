"use client";
import { useState, useEffect, Fragment } from "react";
import { NavItems } from "@/config";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SideNavItem } from "./navigation-items";
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
          isSidebarExpanded ? "w-[288px]" : "w-[68px]",
          "border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full"
        )}
      >
        <aside className="flex h-full flex-col w-full break-words px-5 overflow-x-hidden columns-1 gap-y-5">
          <div className="relative  py-6 flex flex-row items-center justify-between duration-100 border-b-[1px]">
            <div className="technihongo">
              {isSidebarExpanded ? "Technihongo" : ""}
            </div>
            <Button onClick={toggleSidebar} size={"sm"} className="">
              {isSidebarExpanded ? (
                <ChevronLeft size={16} className="stroke-foreground" />
              ) : (
                <ChevronRight size={16} className="stroke-foreground" />
              )}
            </Button>
          </div>
          <div className="relative  pb-6 flex flex-row items-center justify-between duration-100 border-b-[1px]">
            <div className="font-semibold text-base">
              {isSidebarExpanded ? "Username " : ""}
            </div>
          </div>
          {/* Navigation Links */}
          <div className="relative ">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                if (item.position === "top") {
                  return (
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
                  );
                }
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Navigation;
