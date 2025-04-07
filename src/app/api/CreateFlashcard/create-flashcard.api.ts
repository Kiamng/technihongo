import { z } from "zod";

import axiosClient from "@/lib/axiosClient";
import {
  FlashcardSchema,
  StudentFlashcardSetSchema,
} from "@/schema/Flashcard/flashcard";
import { CreateStudentFlashcardSetResponse } from "@/types/student-flashcard-set";

const ENDPOINT = {
  CREATE_STUDENT_SET: "/student-flashcard-set/create",
  DELETE_FLASHCARD: "/flashcard/delete",
  CREATE_FLASHCARDS: "/flashcard",
  UPDATE_FLASHCARD: "/flashcard",
  UPDATE_FLASHCARD_ORDER: "/system-flashcard-set/updateOrder",
};

export const createStudentSet = async (
  token: string,
  values: z.infer<typeof StudentFlashcardSetSchema>,
): Promise<CreateStudentFlashcardSetResponse> => {
  const response = await axiosClient.post(
    ENDPOINT.CREATE_STUDENT_SET,
    {
      title: values.title,
      description: values.description,
      isPublic: values.isPublic,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
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

type FormattedFlashcard = {
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string | null;
};

export const createFlashcards = async (
  token: string,
  setId: number,
  flashcards: FormattedFlashcard[],
) => {
  const response = await axiosClient.post(
    `${ENDPOINT.CREATE_FLASHCARDS}/${setId}/studentCreate`,
    flashcards,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const updateFlashard = async (
  token: string,
  flashcard: z.infer<typeof FlashcardSchema>,
) => {
  const reponse = await axiosClient.patch(
    `${ENDPOINT.UPDATE_FLASHCARD}/${flashcard.flashcardId}/update`,
    {
      japaneseDefinition: flashcard.japaneseDefinition,
      vietEngTranslation: flashcard.vietEngTranslation,
      imageUrl: flashcard.imageUrl,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return reponse.data;
};

export const updateFlashardOrder = async (
  token: string,
  setId: number,
  newOrder: number[],
) => {
  const reponse = await axiosClient.patch(
    `${ENDPOINT.UPDATE_FLASHCARD_ORDER}/${setId}`,
    {
      newFlashcardOrder: newOrder,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return reponse.data;
};
