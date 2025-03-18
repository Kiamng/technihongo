export type FavoriteVideo = {
  id: number;
  title: string;
  stage: string;
  imageUrl: string;
  isMainCourse: boolean;
  status: string;
  duration: string;
};
export const favoriteVideos: FavoriteVideo[] = [
  {
    id: 1,
    title: "N3 TAISAKU",
    stage: "Chặng 2",
    imageUrl: "/taisaku.png",
    isMainCourse: true,
    status: "Đang cập nhật",
    duration: "3 tháng",
  },
  {
    id: 2,
    title: "N3 JUNBI",
    stage: "Chặng 1",
    imageUrl: "/junbi.png",
    isMainCourse: true,
    status: "Đang cập nhật",
    duration: "3 tháng",
  },
  {
    id: 3,
    title: "N2 KAIWA",
    stage: "Chặng 3",
    imageUrl: "/junbi.png",
    isMainCourse: false,
    status: "Đã hoàn thành",
    duration: "2 tháng",
  },
];
