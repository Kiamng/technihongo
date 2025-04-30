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
import { UsertoStudent } from "@/types/profile";

const ENDPOINT = {
  GET_ALL_FLASHCARD_SETS: `/student-flashcard-set/all`,
  GET_FLASHCARD_SET_BY_ID: (setId: number) =>
    `/student-flashcard-set/getAllFlashcardOfSet/${setId}`,
  GET_FLASHCARD_SETS_BY_STUDENT_ID: (studentId: number) =>
    `/student-flashcard-set/getStudentFlashcardSet/${studentId}`,
  GET_STUDENT_FLASHCARD_SET_BY_ID:
    "/student-flashcard-set/getAllFlashcardOfSet",
  UPDATE_FLASHCARD_ORDER: "/student-flashcard-set/updateOrder",
  DELETE_FLASHCARD: "/flashcard/delete",
  CREATE_FLASHCARDS: "/flashcard",
  UPDATE_FLASHCARD: "/flashcard",
  CREATE_STUDENT_SET: "/student-flashcard-set/create",
  UPDATE_STUDENT_SET: "/student-flashcard-set/update",
  UPDATE_PUBLIC_STATUS: "/student-flashcard-set/updateVisibility",
  GET_USER_FROM_STUDENT: (studentId: number) =>
    `/user/getUserByStudentId/${studentId}`,
  ADD_FLASHCARD_FROM_LEARNING_RESOURCE: "/student-flashcard-set/from-resource",
  CLONE_FLASHCARD_SET: (setId: number) =>
    `/student-flashcard-set/clone/${setId}`,
  DELETE_STUDENT_SET: "/student-flashcard-set/delete",
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
  userName: string;
  profileImg: string;
  title: string;
  description: string;
  totalViews: number;
  isPublic: boolean;
  isViolated: boolean;
  flashcards: Flashcard[];
  createdAt: Date;
}
export const cloneFlashcardSet = async (
  setId: number,
  token: string,
): Promise<FlashcardSet> => {
  if (!setId) throw new Error("Invalid setId");
  if (!token) throw new Error("Invalid token");

  try {
    const response = await axiosClient.post(
      ENDPOINT.CLONE_FLASHCARD_SET(setId),
      {}, // body rỗng nếu không cần gửi gì
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Giả sử BE trả về response.data.data chứa dữ liệu FlashcardSet
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    console.error("Error cloning flashcard set:", errorMessage);
    throw new Error(errorMessage);
  }
};
export const getFlashcardSetsByStudentId = async (
  studentId: number,
  token: string,
): Promise<FlashcardSet[]> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_FLASHCARD_SETS_BY_STUDENT_ID(studentId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching flashcard sets by studentId:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserByStudentId = async (
  token: string,
  studentId: number,
): Promise<UsertoStudent> => {
  if (!studentId) throw new Error("Invalid studentId");
  if (!token) throw new Error("Invalid token");

  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_USER_FROM_STUDENT(studentId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Nếu BE trả về response như: { success, message, data }
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi gọi API getUserByStudentId:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

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

interface ImportFlashcard {
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string;
}

export const addFlashcardFromLearningResourece = async (
  token: string,
  resourceId: number,
  flashcards: ImportFlashcard[],
) => {
  const response = await axiosClient.post(
    ENDPOINT.ADD_FLASHCARD_FROM_LEARNING_RESOURCE,
    {
      resourceId: resourceId,
      description: "",
      isPublic: false,
      flashcards: flashcards,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deleteStudentSet = async (token: string, setId: number) => {
  const response = await axiosClient.delete(
    `${ENDPOINT.DELETE_STUDENT_SET}/${setId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
