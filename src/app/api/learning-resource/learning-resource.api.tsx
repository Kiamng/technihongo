import axiosClient from "@/lib/axiosClient";
import { LessonResourceList } from "@/types/lesson-resource";

const ENDPOINT = {
  SAVE_LEARNING_RESOURCE: "/favorite/save?lessonResourceId",
  UNSAVE_LEARNING_RESOURCE: "/favorite/remove?lessonResourceId",
  CHECK_SAVE_LEARNING_RESOURCE: "/favorite/check?lessonResourceId",
  ADD_NOTE: "/resource-progress/note?resourceId",
  GET_FAVORITE_LEARNING_RESOURCE: "/favorite/view",
};

export const saveLearningResource = async (
  lessonResourceId: number,
  token: string,
) => {
  const response = await axiosClient.post(
    `${ENDPOINT.SAVE_LEARNING_RESOURCE}=${lessonResourceId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const unSaveLearningResource = async (
  lessonResourceId: number,
  token: string,
) => {
  const response = await axiosClient.delete(
    `${ENDPOINT.UNSAVE_LEARNING_RESOURCE}=${lessonResourceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const checkSaveLearningResource = async (
  lessonResourceId: number,
  token: string,
): Promise<boolean> => {
  const response = await axiosClient.get(
    `${ENDPOINT.CHECK_SAVE_LEARNING_RESOURCE}=${lessonResourceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const addNote = async (
  resourceId: number,
  note: string,
  token: string,
) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.ADD_NOTE}=${resourceId}`,
    { note: note },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

export const getFavoriteLearningResource = async ({
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
}): Promise<LessonResourceList> => {
  const params = new URLSearchParams();

  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  const response = await axiosClient.get(
    `${ENDPOINT.GET_FAVORITE_LEARNING_RESOURCE}?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data.data;
};
