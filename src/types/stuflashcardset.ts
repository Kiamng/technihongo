export type Flashcard = {
  flashcardId: number;
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string | null;
};
export type FlashcardSet = {
  studentId?: number;
  studentSetId: number;
  title: string;
  description: string;
  isPublic: boolean;
  flashcards: Flashcard[];
};
