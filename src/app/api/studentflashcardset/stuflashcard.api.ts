import { z } from "zod";

import axiosClient from "@/lib/axiosClient";
import {
  FlashcardSchema,
  StudentFlashcardSetSchema,
} from "@/schema/Flashcard/flashcard";
import {
  CreateStudentFlashcardSetResponse,
  StudentFlashcardSet,
} from "@/types/student-flashcard-set";

const ENDPOINT = {
  GET_ALL_FLASHCARD_SETS: `/student-flashcard-set/all`,
  GET_FLASHCARD_SET_BY_ID: (setId: number) =>
    `/student-flashcard-set/getUserFlashcard/${setId}`,
  GET_STUDENT_FLASHCARD_SET_BY_ID: "/student-flashcard-set/getUserFlashcard",
  UPDATE_FLASHCARD_ORDER: "/student-flashcard-set/updateOrder",
  DELETE_FLASHCARD: "/flashcard/delete",
  CREATE_FLASHCARDS: "/flashcard",
  UPDATE_FLASHCARD: "/flashcard",
  CREATE_STUDENT_SET: "/student-flashcard-set/create",
  UPDATE_STUDENT_SET: "/student-flashcard-set/update",
  UPDATE_PUBLIC_STATUS: "/student-flashcard-set/updateVisibility",
};

export interface Flashcard {
  flashcardId: number;
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string;
}

export interface FlashcardSet {
  studentId: number;
  studentSetId: number;
  title: string;
  description: string;
  totalViews: number;
  isPublic: boolean;
  flashcards: Flashcard[];
  createdAt: Date;
}

export const getAllFlashcardSets = async (token: string): Promise<any> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_FLASHCARD_SETS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching flashcard sets:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getFlashcardSetById = async (
  setId: number, // Chỉnh lại kiểu dữ liệu
  token: string,
): Promise<FlashcardSet> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_FLASHCARD_SET_BY_ID(setId), // Truyền số vào
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching flashcard set:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getStudentFlashcardSetById = async (
  setId: number,
  token: string,
): Promise<StudentFlashcardSet> => {
  try {
    const response = await axiosClient.get(
      `${ENDPOINT.GET_STUDENT_FLASHCARD_SET_BY_ID}/${setId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching flashcard set:",
      error.response?.data || error.message,
    );
    throw error;
  }
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

export const updateStudentSet = async (
  token: string,
  setId: number,
  values: z.infer<typeof StudentFlashcardSetSchema>,
) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.UPDATE_STUDENT_SET}/${setId}`,
    {
      title: values.title,
      description: values.description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const updateFlashcardSetPublicStatus = async (
  token: string,
  setId: number,
  publicStatus: boolean,
) => {
  const response = await axiosClient.patch(
    `${ENDPOINT.UPDATE_PUBLIC_STATUS}/${setId}?isPublic=${publicStatus}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
