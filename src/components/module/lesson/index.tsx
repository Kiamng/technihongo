import { useState, useEffect } from "react";

import { getLessonsByStudyPlan } from "@/app/api/lesson/lesson.api";
import { LessonList } from "@/types/lesson";

interface UseLessonsParams {
  pageNo?: number;
  pageSize?: number;
}

export const useLessons = (
  studyPlanId: number | undefined, // Thêm undefined vào kiểu của studyPlanId
  token: string | undefined,
  { pageNo = 0, pageSize = 3 }: UseLessonsParams = {},
) => {
  const [lessons, setLessons] = useState<LessonList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLessons(null); // Làm mới lessons
    setError(null); // Reset lỗi
  }, [studyPlanId]);

  useEffect(() => {
    const fetchLessons = async () => {
      // Chỉ gọi API nếu studyPlanId và token đều có giá trị
      if (!studyPlanId || !token) {
        setLessons(null); // Reset lessons nếu không có studyPlanId
        setIsLoading(false);
        setError(null);

        return;
      }

      setIsLoading(true);
      try {
        const data = await getLessonsByStudyPlan({
          token,
          studyPlanId,
          pageNo,
          pageSize,
          sortBy: "lessonId",
          sortDir: "asc",
        });

        setLessons(data);
      } catch (err) {
        setError("Không thể tải danh sách bài học");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [studyPlanId, token, pageNo, pageSize]);

  return { lessons, isLoading, error };
};
