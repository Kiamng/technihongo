import axiosClient from "@/lib/axiosClient";
const ENDPOINT = {
  DELETE_FLASHCARD: "/flashcard/delete",
  CREATE_FLASHCARDS: "/flashcard",
};

export const deleteFlashcard = async (token: string, flashcardId: number) => {
  const response = await axiosClient.delete(
    `${ENDPOINT.DELETE_FLASHCARD}/${flashcardId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
