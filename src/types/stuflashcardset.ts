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
  isPublic: boolean;
  flashcards: Flashcard[];
}
