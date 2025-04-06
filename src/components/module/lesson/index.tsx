// src/hooks/useLessons.ts
import { useState, useEffect } from "react";

import { getLessonsByStudyPlan } from "@/app/api/lesson/lesson.api";
import { LessonList } from "@/types/lesson";

interface UseLessonsParams {
  pageNo?: number;
  pageSize?: number;
}

export const useLessons = (
  studyPlanId: number,
  token: string | undefined,
  { pageNo = 0, pageSize = 3 }: UseLessonsParams = {},
) => {
  const [lessons, setLessons] = useState<LessonList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!studyPlanId || !token) return;

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
