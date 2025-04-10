import axiosClient from "@/lib/axiosClient";
import { LearningResourceList } from "@/types/learning-resource";

const ENDPOINT = {
  SAVE_LEARNING_RESOURCE: "/favorite/save?learningResourceId",
  UNSAVE_LEARNING_RESOURCE: "/favorite/remove?learningResourceId",
  CHECK_SAVE_LEARNING_RESOURCE: "/favorite/check?learningResourceId",
  ADD_NOTE: "/resource-progress/note?resourceId",
  GET_FAVORITE_LEARNING_RESOURCE: "/favorite/view",
};

export const saveLearningResource = async (
  learningResourceId: number,
  token: string,
) => {
  const response = await axiosClient.post(
    `${ENDPOINT.SAVE_LEARNING_RESOURCE}=${learningResourceId}`,
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
  learningResourceId: number,
  token: string,
) => {
  const response = await axiosClient.delete(
    `${ENDPOINT.UNSAVE_LEARNING_RESOURCE}=${learningResourceId}`,
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
  learningResourceId: number,
  token: string,
): Promise<boolean> => {
  const response = await axiosClient.get(
    `${ENDPOINT.CHECK_SAVE_LEARNING_RESOURCE}=${learningResourceId}`,
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
}): Promise<LearningResourceList> => {
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
