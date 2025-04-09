import axiosClient from "@/lib/axiosClient";
import { LessonResource } from "@/types/lesson-resource";

const ENDPOINT = {
  GET_LESSON_RESOURCE_BY_LESSON_ID: "/lesson-resource/lesson",
  TRACK_LEARNING_RESOURCE: "/resource-progress/track?resourceId",
  COMPLETE_LESSON_RESOURCE: "/resource-progress/complete?resourceId",
};

export const getLessonResourceByLessonId = async (
  token: string,
  lessonId: number,
): Promise<LessonResource[]> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_LESSON_RESOURCE_BY_LESSON_ID}/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const trackLearningResource = async (
  resourceId: number,
  token: string,
) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.TRACK_LEARNING_RESOURCE}=${resourceId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const completeLessonResource = async (
  resourceId: number,
  token: string,
) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.COMPLETE_LESSON_RESOURCE}=${resourceId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
