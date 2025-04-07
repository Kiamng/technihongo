import axiosClient from "@/lib/axiosClient";
import { PathCourse, PathCourseListResponse } from "@/types/pathcourse";

const ENDPOINT = {
  GET_PATH_COURSES_BY_LEARNING_PATH_ID: "path-course/learning-path/{pathId}",
};

export const getPathCourseListByLearningPathId = async ({
  pathId,
  token,
  pageNo = 0,
  pageSize = 100,
  sortBy = "courseOrder",
  sortDir = "asc",
}: {
  pathId: number;
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<PathCourse[]> => {
  if (!pathId) {
    console.error("Lỗi: pathId không hợp lệ!", pathId);

    return [];
  }

  if (!token) {
    console.error("Lỗi: Token không hợp lệ!", token);

    return [];
  }

  const params = new URLSearchParams();

  params.append("pageNo", pageNo.toString());
  params.append("pageSize", pageSize.toString());
  params.append("sortBy", sortBy);
  params.append("sortDir", sortDir);

  const url = `${ENDPOINT.GET_PATH_COURSES_BY_LEARNING_PATH_ID.replace("{pathId}", String(pathId))}?${params.toString()}`;

  console.log(" Đang gọi API:", url);
  console.log("Token sử dụng:", token);

  try {
    const response = await axiosClient.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("API Response:", response.data);

    if (response.data.success) {
      const data: PathCourseListResponse = response.data.data;

      return data.content || [];
    } else {
      console.error("API trả về lỗi:", response.data);

      return [];
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);

    return [];
  }
};
