import { z } from "zod";

import { isMostlyJapanese } from "@/lib/validation/japanese";
import {
  containsEmoji,
  isVietnameseOrEnglish,
} from "@/lib/validation/viet-eng";

export const FlashcardSchema = z.object({
  flashcardId: z.number().nullable(),
  japaneseDefinition: z
    .string()
    .min(1, "Từ vựng không được để trống")
    .refine((val) => isMostlyJapanese(val), {
      message:
        "Từ vựng phải là tiếng Nhật, không được chứa icon hoặc ký tự đặc biệt",
    }),
  vietEngTranslation: z
    .string()
    .min(1, "Định nghĩa không được để trống")
    .refine((val) => !containsEmoji(val), {
      message: "Định nghĩa không được chứa icon",
    })
    .refine((val) => isVietnameseOrEnglish(val), {
      message:
        "Định nghĩa phải là tiếng Việt hoặc tiếng Anh, không được chứa ký tự đặc biệ",
    }),
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
