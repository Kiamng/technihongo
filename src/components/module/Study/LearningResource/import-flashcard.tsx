import React, { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { addFlashcardFromLearningResourece } from "@/app/api/studentflashcardset/stuflashcard.api";
import { isMostlyJapanese } from "@/lib/validation/japanese";
import {
  containsEmoji,
  isVietnameseOrEnglish,
} from "@/lib/validation/viet-eng";

interface QuickAddPopupProps {
  learningResourceId: number;
  token: string;
}
const QuickAddPopup = ({ learningResourceId, token }: QuickAddPopupProps) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFlashcards = async () => {
    setIsLoading(true);
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
    let hasError = false;
    const flashcards = lines.map((line) => {
      const [japaneseDefinition, vietEngTranslation] = line.split("\t");
      const jp = japaneseDefinition?.trim() || "";
      const vi = vietEngTranslation?.trim() || "";

      if (
        !jp ||
        !isMostlyJapanese(jp) ||
        !vi ||
        containsEmoji(vi) ||
        !isVietnameseOrEnglish(vi)
      ) {
        hasError = true;
      }

      return {
        japaneseDefinition: japaneseDefinition?.trim() || "",
        vietEngTranslation: vietEngTranslation?.trim() || "",
        imageUrl: "",
      };
    });

    if (hasError) {
      setIsLoading(false);
      toast.error(
        "Từ vựng phải là tiếng Nhật, định nghĩa phải là tiếng Việt hoặc tiếng Anh. Không được chứa icon hoặc ký tự đặc biệt.",
        { duration: 6000 },
      );

      return;
    }

    try {
      const response = await addFlashcardFromLearningResourece(
        token,
        learningResourceId,
        flashcards,
      );

      if (response.success === true) {
        toast.success("Thêm từ vựng thành công");
        setInputText("");
      } else {
        toast.error("Thêm từ vựng thất bại");
        console.log(response);
      }
    } catch (error) {
      console.error("Error adding flashcards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue =
        inputText.substring(0, start) + "\t" + inputText.substring(end);

      setInputText(newValue);

      setTimeout(() => target.setSelectionRange(start + 1, start + 1), 0);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="rounded-full px-3 bg-primary text-white hover:scale-105 transition-all duration-300 text-sm flex items-center gap-2">
        Thêm từ vựng <Copy />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="flex flex-col space-y-6">
          <textarea
            className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-secondary dark:text-primary"
            disabled={isLoading}
            placeholder={`Từ 1 [TAB] Định nghĩa 1\nTừ 2 [TAB] Định nghĩa 2\n\nVí dụ gõ:\nA [TAB] B [Phím Enter]\nD [TAB] E`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="w-full flex justify-end">
            <Button disabled={isLoading} onClick={handleAddFlashcards}>
              {isLoading ? "Đang thêm..." : "Thêm"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickAddPopup;
