// src/hooks/useStudyPlans.ts
import { useState, useEffect } from "react";

import { StudyPlan } from "@/types/study-plan";
import { getStudyPlansByCourse } from "@/app/api/StudyPlan/study-plan.api";

export const useStudyPlans = (courseId: number, token: string | undefined) => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyPlans = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const data = await getStudyPlansByCourse({
          token,
          courseId,
        });

        setStudyPlans(data);
      } catch (err) {
        setError("Failed to fetch study plans");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyPlans();
  }, [courseId, token]);

  return { studyPlans, isLoading, error };
};
