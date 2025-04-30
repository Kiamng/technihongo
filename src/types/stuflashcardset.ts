export type Flashcard = {
  flashcardId: number;
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string | null;
};
export type FlashcardSet = {
  studentId: number;
  studentSetId: number;
  userName: string;
  profileImg: string;
  title: string;
  description: string;
  totalViews: number;
  createdAt: Date;
  isPublic: boolean;
  isViolated: boolean;
  flashcards: Flashcard[];
};
