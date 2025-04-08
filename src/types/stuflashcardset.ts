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
  totalViews: number;
  createdAt: Date;
  isPublic: boolean;
  flashcards: Flashcard[];
};
