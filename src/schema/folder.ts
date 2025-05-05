import { z } from "zod";

export const addStuFolderSchema = z.object({
  name: z.string().min(1, "Hãy điền tên thư mục"),
  description: z.string().optional(),
});
