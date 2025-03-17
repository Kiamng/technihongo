export const fetchCourseDetail = async (courseId: string) => {
  // Mock data - bạn sẽ thay thế bằng API thực tế
  return {
    courseId: Number(courseId),
    title: "Sơ cấp N5 - N4 Mới",
    description: "Khóa học tiếng Nhật toàn diện",
    instructors: ["Thầy Dũng Mori", "Cô Phương Thanh"],
    price: 1290000,
    duration: "8 tháng",
    goals: [
      "Nắm chắc kiến thức tiếng Nhật",
      "Phát âm chuẩn",
      "Chuẩn bị thi N5",
    ],
    chapters: [
      {
        name: "Nhập môn",
        videos: 42,
        exercises: 35,

        tests: 0,
        sections: [
          {
            name: "Bắt đầu học",
            lessons: [
              {
                title: "Giới thiệu khóa học",
                duration: "10 phút",
                isLocked: false,
              },
            ],
          },
        ],
      },
    ],
  };
};
