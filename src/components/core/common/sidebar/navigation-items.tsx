import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SideNavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  path: string;
  active: boolean;
  isSidebarExpanded: boolean;
}> = ({ label, icon, path, active, isSidebarExpanded }) => {
  return (
    <>
      {isSidebarExpanded ? (
        <Link
          className={`h-full relative flex items-center whitespace-nowrap rounded-md  ${
            active
              ? " font-semibold text-base bg-primary text-white"
              : "hover:text-primary "
          }`}
          href={path}
        >
          <div className="relative font-normal text-base py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
            {icon}
            <span>{label}</span>
          </div>
        </Link>
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger>
              <Link
                className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                  active
                    ? " font-semibold text-base bg-primary text-white"
                    : "hover:text-primary "
                }`}
                href={path}
              >
                <div className="relative font-medium text-base p-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                  {icon}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="px-3 py-1.5 text-xs"
              side="left"
              sideOffset={10}
            >
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};
