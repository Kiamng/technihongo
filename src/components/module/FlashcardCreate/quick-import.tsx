import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        const flashcards = lines.map((line) => {
            const [japaneseDefinition, vietEngTranslation] = line.split("\t");

            return {
                japaneseDefinition: japaneseDefinition?.trim() || "",
                vietEngTranslation: vietEngTranslation?.trim() || "",
            };
        });

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
