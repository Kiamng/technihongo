// types.ts
export type ActivityType = "lesson" | "system" | "login";

export interface DayProgress {
  day: string;
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  time?: string;
  timeAgo: string;
  icon:
    | "lesson"
    | "comment"
    | "streak"
    | "coin"
    | "reminder"
    | "daily"
    | "login";
}

export interface ActivityGroup {
  date: string;
  formattedDate: string;
  items: ActivityItem[];
}

export const weekProgress: DayProgress[] = [
  { day: "T3", completed: false },
  { day: "T4", completed: false },
  { day: "T5", completed: false },
  { day: "T6", completed: true },
  { day: "T7", completed: true },
  { day: "CN", completed: false },
  { day: "T2", completed: true },
];

export const activityGroups: ActivityGroup[] = [
  {
    date: "2025-03-14",
    formattedDate: "Ngày 14 tháng 03 năm 2025",
    items: [
      {
        id: "1",
        type: "lesson",
        title:
          'Đã hoàn thành bài học tập bài kiểm tra "N3.16. MINITEST 1: KJ - TV - NP"',
        timeAgo: "2 ngày trước",
        icon: "lesson",
      },
      {
        id: "2",
        type: "lesson",
        title: 'Đã hoàn thành bài học tập bài kiểm tra "N3.16. MINITEST 1"',
        timeAgo: "2 ngày trước",
        icon: "lesson",
      },
    ],
  },
  {
    date: "2025-03-06",
    formattedDate: "Ngày 06 tháng 03 năm 2025",
    items: [
      {
        id: "3",
        type: "system",
        title: "Thống kê bình luận",
        time: "03:45 PM",
        timeAgo: "",
        icon: "comment",
      },
      {
        id: "4",
        type: "system",
        title: "Thống kê nhắc nhở số streak",
        time: "03:45 PM",
        timeAgo: "",
        icon: "streak",
      },
      {
        id: "5",
        type: "system",
        title: "Thống kê coin",
        time: "03:45 PM",
        timeAgo: "",
        icon: "coin",
      },
      {
        id: "6",
        type: "system",
        title: "Thống kê nhận vụ đặt",
        time: "03:45 PM",
        timeAgo: "",
        icon: "reminder",
      },
      {
        id: "7",
        type: "system",
        title: "Thống kê nhắc nhở hàng ngày",
        time: "03:45 PM",
        timeAgo: "",
        icon: "daily",
      },
    ],
  },
  {
    date: "2025-02-12",
    formattedDate: "Ngày 12 tháng 02 năm 2025",
    items: [
      {
        id: "8",
        type: "login",
        title: "Bạn đã đăng nhập vào thiết bị này đồng Google thành công!",
        timeAgo: "33 ngày trước",
        icon: "login",
      },
    ],
  },
];
