import React, { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isMostlyJapanese } from "@/lib/validation/japanese";
import {
  containsEmoji,
  isVietnameseOrEnglish,
} from "@/lib/validation/viet-eng";

interface Flashcard {
  japaneseDefinition: string;
  vietEngTranslation: string;
}

interface QuickAddPopupProps {
  isOpen: boolean;
  closeModal: () => void;
  onAddFlashcards: (flashcards: Flashcard[]) => void;
}

const QuickAddPopup: React.FC<QuickAddPopupProps> = ({
  isOpen,
  closeModal,
  onAddFlashcards,
}) => {
  const [inputText, setInputText] = useState("");

  const handleAddFlashcards = () => {
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
      };
    });

    if (hasError) {
      toast.error(
        "Từ vựng phải là tiếng Nhật, định nghĩa phải là tiếng Việt hoặc tiếng Anh. Không được chứa icon hoặc ký tự đặc biệt.",
        { duration: 6000 },
      );

      return;
    }

    onAddFlashcards(flashcards);
    closeModal();
    setInputText("");
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
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhanh Flashcards</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <textarea
            className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-secondary dark:text-primary"
            placeholder={`Từ 1 [TAB] Định nghĩa 1\nTừ 2 [TAB] Định nghĩa 2\n\nVí dụ gõ:\nA [TAB] B [Phím Enter]\nD [TAB] E`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Hủy
          </Button>
          <Button onClick={handleAddFlashcards}>Thêm Flashcards</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddPopup;
