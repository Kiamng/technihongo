import { Flashcard } from "./flashcard";

export type StudentFlashcardSet = {
  studentId: number;
  studentSetId: number;
  title: string;
  description: string;
  totalViews: number;
  isPublic: boolean;
  flashcards: Flashcard[];
  createdAt: Date;
};
