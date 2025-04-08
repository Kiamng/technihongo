import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_FLASHCARD_SETS: `/student-flashcard-set/all`,
  GET_FLASHCARD_SET_BY_ID: (setId: number) =>
    `/student-flashcard-set/getUserFlashcard/${setId}`,
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
