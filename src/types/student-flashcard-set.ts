import { Flashcard } from "./flashcard";

export type StudentFlashcardSet = {
  studentId: number;
  studentSetId: number;
  title: string;
  description: string;
  isPublic: boolean;
  flashcards: Flashcard[];
};

export type CreateStudentFlashcardSetResponse = {
  success: boolean;
  message: string;
  data: StudentFlashcardSet;
};
