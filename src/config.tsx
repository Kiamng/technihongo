import { Bell, Briefcase, Home, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Home",
      href: "/",
      icon: <Home size={20} />,
      active: isNavItemActive(pathname, "/home"),
      position: "top",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User size={20} />,
      active: isNavItemActive(pathname, "/profile"),
      position: "top",
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell size={20} />,
      active: isNavItemActive(pathname, "/notifications"),
      position: "top",
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, "/projects"),
      position: "top",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, "/settings"),
      position: "bottom",
    },
    // {
    //   sectionName: "Học tập",
    //   sectionList: [
    //     {
    //       name: "Khóa học",
    //       href: "/",
    //       icon: (
    //         <GraduationCap
    //           size={28}
    //           className="stroke-inherit stroke-[0.75] min-w-8 w-8"
    //         />
    //       ),
    //       active: pathname === "/",
    //     },
    //     {
    //       name: "Bài giảng yêu thích",
    //       href: "/",
    //       icon: (
    //         <Heart
    //           size={28}
    //           className="stroke-inherit stroke-[0.75] min-w-8 w-8"
    //         />
    //       ),
    //       active: pathname === "/",
    //     },
    //     {
    //       name: "Flashcard",
    //       href: "/",
    //       icon: (
    //         <Copy
    //           size={28}
    //           className="stroke-inherit stroke-[0.75] min-w-8 w-8"
    //         />
    //       ),
    //       active: pathname === "/",
    //     },
    //   ],
    // },
    // {
    //   sectionName: "Nâng cấp tài khoản",
    //   sectionList: [
    //     {
    //       name: "Các gói",
    //       href: "/",
    //       icon: (
    //         <BadgeJapaneseYen
    //           size={28}
    //           className="stroke-inherit stroke-[0.75] min-w-8 w-8"
    //         />
    //       ),
    //       active: pathname === "/",
    //     },
    //     {
    //       name: "Lịch sử giao dịch",
    //       href: "/",
    //       icon: (
    //         <FileChartPie
    //           size={28}
    //           className="stroke-inherit stroke-[0.75] min-w-8 w-8"
    //         />
    //       ),
    //       active: pathname === "/",
    //     },
    //   ],
    // },
  ];
};
