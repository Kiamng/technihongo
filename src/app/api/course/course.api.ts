import axiosClient from "@/lib/axiosClient";
import { CourseList, CourseProgress } from "@/types/course";

const ENDPOINT = {
  ALL: "/course/all/paginated",
  GET_ALL_COURSE_PROGRESS_BY_STUDENT_ID: "/course-progress/all",
  GET_A_STUDENT_COURSE_PROGRESS: "/course-progress/view",
  TRACK_STUDENT_COURSE_PROGRESS: "/course-progress/track",
};

export const getAllCourse = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<CourseList> => {
  const params = new URLSearchParams();

  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);

  const response = await axiosClient.get(
    `${ENDPOINT.ALL}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data as CourseList;
};

export const getStudentAllCourseProgress = async (
  studentId: number,
  token: string,
): Promise<CourseProgress[]> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_ALL_COURSE_PROGRESS_BY_STUDENT_ID}/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getAStudentCourseProgress = async (
  studentId: number,
  token: string,
  courseId: number,
): Promise<CourseProgress> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_A_STUDENT_COURSE_PROGRESS}/${studentId}?courseId=${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const trackStudentCourseProgress = async (
  token: string,
  courseId: number,
): Promise<void> => {
  const response = await axiosClient.patch(
    `${ENDPOINT.TRACK_STUDENT_COURSE_PROGRESS}?courseId=${courseId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};
