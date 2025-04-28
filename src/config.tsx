// src/config.tsx
"use client";

import {
  BadgeJapaneseYen,
  ChartNoAxesColumn,
  Copy,
  FileChartPie,
  GraduationCap,
  Heart,
  LandPlot,
  Languages,
  Mic,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const pathname = usePathname() ?? "";
  const iconSize: number = 24;
  const iconStroke: number = 1.5;

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      sectionName: "Học tập",
      sectionList: [
        // {
        //   name: "Home",
        //   href: "/home",
        //   icon: <Home size={iconSize} strokeWidth={iconStroke} />,
        //   active: isNavItemActive(pathname, "/home"),
        // },
        {
          name: "Thống kê",
          href: "/learning-statistic",
          icon: <ChartNoAxesColumn size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/learning-statistic"),
        },
        {
          name: "Lộ trình học tập",
          href: "/learning-path",
          icon: <LandPlot size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/learning-path"),
        },
        {
          name: "Khóa học",
          href: "/course",
          icon: <GraduationCap size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/course"),
        },
        {
          name: "Nội dung yêu thích",
          href: "/saved-content",
          icon: <Heart size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/saved-content"),
        },
        {
          name: "Flashcard",
          href: "/flashcard",
          icon: <Copy size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/flashcard"),
        },
        // {
        //   name: "Quiz",
        //   href: "/quiz",
        //   icon: <Copy size={iconSize} strokeWidth={iconStroke} />,
        //   active: isNavItemActive(pathname, "/quiz"),
        // },
        {
          name: "Dịch tài liệu IT tiếng nhật",
          href: "/translate",
          icon: <Languages size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/translate"),
        },
        // {
        //   name: "Achievement",
        //   href: "/achievement",
        //   icon: <Badge size={iconSize} strokeWidth={iconStroke} />,
        //   active: isNavItemActive(pathname, "/achievement"),
        // },
        {
          name: "Luyện tập hội thoại",
          href: "/meeting",
          icon: <Mic size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/meeting"),
        },
      ],
    },
    {
      sectionName: "Nâng cấp",
      sectionList: [
        {
          name: "Các gói",
          href: "/subscription-plan",
          icon: <BadgeJapaneseYen size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/subscription-plan"),
        },
        // {
        //   name: "Lịch sử",
        //   href: "/abc",
        //   icon: <FileChartPie size={iconSize} strokeWidth={iconStroke} />,
        //   active: isNavItemActive(pathname, "/abc"),
        // },
        {
          name: "Giao dịch và gói hoạt động",
          href: "/transactions",
          icon: <FileChartPie size={iconSize} strokeWidth={iconStroke} />,
          active: isNavItemActive(pathname, "/transactions"),
        },
        // {
        //   name: "Các gói đang hoạt động",
        //   href: "/subscription-history",
        //   icon: <FileChartPie size={iconSize} strokeWidth={iconStroke} />,
        //   active: isNavItemActive(pathname, "/subscription-history"),
        // },
      ],
    },
  ];
};
