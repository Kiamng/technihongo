import { z } from "zod";

export const FlashcardSchema = z.object({
  flashcardId: z.number().nullable(),
  japaneseDefinition: z.string().min(1, "Từ vựng không thể để trống"),
  vietEngTranslation: z.string().min(1, "Định nghĩa không thể để trống"),
  imageUrl: z.string().nullable(),
  cardOrder: z.number().nullable(),
});

export const StudentFlashcardSetSchema = z.object({
  title: z.string().min(1, "Hãy thêm 1 tiêu đề"),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const FlashcardSetCreateSchema = z.object({
  StudentFlashcardSetSchema,
  flashcards: z.array(FlashcardSchema),
});
