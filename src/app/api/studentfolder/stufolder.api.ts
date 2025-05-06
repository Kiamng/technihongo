import { z } from "zod";

import { FlashcardSet } from "../studentflashcardset/stuflashcard.api";

import axiosClient from "@/lib/axiosClient";
import { addStuFolderSchema } from "@/schema/folder";

const ENDPOINT = {
  GET_STUFOLDER_BY_ID: "student-folder/getStudentFolder",
  UPDATE_STUFOLDER: (folderId: number) => `/student-folder/update/${folderId}`,
  ADD_STUFOLDER: `/student-folder/create`,
  DELETE_STUFOLDER: (folderId: number) =>
    `/student-folder/deleteFolder/${folderId}`,
  GET_PUBLIC_FLASHCARD_SETS: "/student-flashcard-set/publicFlashcardSet",
  SEARCH_TITLE_FLASHCARD_SET: `/student-flashcard-set/searchTitle`,
};

interface FolderData {
  name: string;
  description: string;
}
export const getStuFolder = async (token: string, studentId: number) => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_STUFOLDER_BY_ID, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching student folders:", error);
    throw error;
  }
};
export const getPublicFlashcardSets = async (
  token: string,
): Promise<FlashcardSet[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_PUBLIC_FLASHCARD_SETS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching public flashcard sets:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const addStuFolder = async (
  token: string,
  studentId: number,
  values: z.infer<typeof addStuFolderSchema>,
) => {
  try {
    const response = await axiosClient.post(
      ENDPOINT.ADD_STUFOLDER,
      {
        studentId,
        name: values.name,
        description: values.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error adding student folder:", error);
    throw error;
  }
};

export const updateStuFolder = async (
  token: string,
  folderId: number,
  values: FolderData,
) => {
  try {
    const response = await axiosClient.patch(
      ENDPOINT.UPDATE_STUFOLDER(folderId),
      {
        name: values.name,
        description: values.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating student folder:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const deleteStuFolder = async (token: string, folderId: number) => {
  try {
    const response = await axiosClient.delete(
      ENDPOINT.DELETE_STUFOLDER(folderId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting student folder:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const searchFlashcardSets = async (
  token: string,
  keyword: string,
): Promise<FlashcardSet[]> => {
  try {
    const response = await axiosClient.get(
      `${ENDPOINT.SEARCH_TITLE_FLASHCARD_SET}?keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data && response.data.data) {
      return response.data.data; // đảm bảo response có chứa data
    } else {
      throw new Error("No data found");
    }
  } catch (error: any) {
    console.error(
      "Error searching flashcard sets by title:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
