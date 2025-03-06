import axiosClient from "@/lib/axiosClient";
import { CourseList } from "@/types/course";

const ENDPOINT = {
  ALL: "/course/all/paginated",
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
