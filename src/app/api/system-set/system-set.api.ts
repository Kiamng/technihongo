import axiosClient from "@/lib/axiosClient";
import { SystemFlashcardSet } from "@/types/system-flashcard-set";

const ENDPOINT = {
  GET_BY_ID: "/system-flashcard-set/getSysFlashcardSet",
};

export const getSysFlashcardSetById = async (
  token: string,
  setId: number,
): Promise<SystemFlashcardSet> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_BY_ID}/${setId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};
