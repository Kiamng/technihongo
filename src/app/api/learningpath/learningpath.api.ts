import axiosClient from "@/lib/axiosClient";
import { LearningPath } from "@/types/learningpath";

const ENDPOINT = {
  ALL: "/learning-path/all",
};

export const getAllLearningPaths = async (
  token: string,
): Promise<LearningPath[]> => {
  const response = await axiosClient.get(ENDPOINT.ALL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data as LearningPath[];
};
