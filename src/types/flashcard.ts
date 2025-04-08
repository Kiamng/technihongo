import { JSX } from "react";

export type Flashcard = {
  flashcardId: number;
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string;
  cardOrder: number;
};

export type FlashcardContent = {
  id: string;
  frontHTML: string | JSX.Element;
  backHTML: string | JSX.Element;
};

export enum Status {
  Open = "Open",
  Hidden = "Hidden",
  Closed = "Closed",
}
