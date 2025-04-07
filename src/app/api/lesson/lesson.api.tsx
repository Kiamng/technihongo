// src/app/api/lesson/lesson.api.ts
import axiosClient from "@/lib/axiosClient";
import { LessonList } from "@/types/lesson";

interface EnrollResponse {
  success: boolean;
  message: string;
  data: any | null;
}

const ENDPOINT = {
  GET_BY_STUDY_PLAN: "/lesson/study-plan/paginated",
  ENROLL_COURSE: "/course-progress/enroll",
  CHECK_ENROLL: "/course-progress/check-enroll", // Thêm endpoint mới
};

// Hàm kiểm tra trạng thái đăng ký
export const checkEnrollStatus = async (
  courseId: number,
  token: string,
): Promise<EnrollResponse> => {
  const response = await axiosClient.get(
    `${ENDPOINT.CHECK_ENROLL}?courseId=${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as EnrollResponse;
};

// Các hàm hiện có giữ nguyên
export const getLessonsByStudyPlan = async ({
  token,
  studyPlanId,
  pageNo = 0,
  pageSize = 3,
  sortBy = "lessonId",
  sortDir = "asc",
  keyword = "",
}: {
  token: string;
  studyPlanId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string;
}): Promise<LessonList> => {
  const params = new URLSearchParams();

  params.append("pageNo", pageNo.toString());
  params.append("pageSize", pageSize.toString());
  params.append("sortBy", sortBy);
  params.append("sortDir", sortDir);
  if (keyword) params.append("keyword", keyword);

  const response = await axiosClient.get(
    `${ENDPOINT.GET_BY_STUDY_PLAN}/${studyPlanId}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data as LessonList;
};

export const enrollCourse = async (
  courseId: number,
  token: string,
): Promise<EnrollResponse> => {
  const response = await axiosClient.post(
    `${ENDPOINT.ENROLL_COURSE}?courseId=${courseId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as EnrollResponse;
};
