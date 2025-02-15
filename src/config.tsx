import {
  BadgeJapaneseYen,
  ChartNoAxesColumn,
  Copy,
  FileChartPie,
  GraduationCap,
  Heart,
  Home,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const pathname = usePathname();
  const iconSize: number = 24;
  const iconStroke: number = 1.5;
  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      sectionName: "Học tập",
      sectionList: [
        {
          name: "Home",
          href: "/home",
          icon: <Home strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/home"),
        },
        {
          name: "Thống kê",
          href: "/learning-statistic",
          icon: <ChartNoAxesColumn strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/learning-statistic"),
        },
        {
          name: "Khóa học",
          href: "/course",
          icon: <GraduationCap strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/course"),
        },
        {
          name: "Nội dung yêu thích",
          href: "/saved-content",
          icon: <Heart strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/saved-content"),
        },
        {
          name: "Flashcard",
          href: "/flashcard",
          icon: <Copy strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/flashcard"),
        },
      ],
    },
    {
      sectionName: "Nâng cấp",
      sectionList: [
        {
          name: "Các gói",
          href: "/subscription/plan",
          icon: <BadgeJapaneseYen strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/subscription/plan"),
        },
        {
          name: "Lịch sử",
          href: "/abc",
          icon: <FileChartPie strokeWidth={iconStroke} size={iconSize} />,
          active: isNavItemActive(pathname, "/abc"),
        },
      ],
    },
  ];
};
