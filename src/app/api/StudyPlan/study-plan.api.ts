// src/app/api/study-plan/study-plan.api.ts
import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  GET_BY_COURSE: "/study-plan/course",
};

export const getStudyPlansByCourse = async ({
  token,
  courseId,
}: {
  token: string;
  courseId: number;
}): Promise<any> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_BY_COURSE}/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};
