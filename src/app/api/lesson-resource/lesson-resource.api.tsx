import axiosClient from "@/lib/axiosClient";
import { LessonResource } from "@/types/lesson-resource";

const ENDPOINT = {
  GET_LESSON_RESOURCE_BY_LESSON_ID: "/lesson-resource/lesson",
  TRACK_LEARNING_RESOURCE: "/resource-progress/track?resourceId",
  COMPLETE_LEARNING_RESOURCE: "/resource-progress/complete?resourceId",
  TRACK_SYSTEM_SET: "/flashcard-set-progress/track",
  COMPLETE_SYSTEM_SET: "/flashcard-set-progress/complete",
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

export const completeLearningResource = async (
  resourceId: number,
  token: string,
) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.COMPLETE_LEARNING_RESOURCE}=${resourceId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const trackSystemSet = async (setId: number, token: string) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.TRACK_SYSTEM_SET}?setId=${setId}&isSystemSet=true`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

export const completeSystemSet = async (setId: number, token: string) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.COMPLETE_SYSTEM_SET}?setId=${setId}&isSystemSet=true`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};
