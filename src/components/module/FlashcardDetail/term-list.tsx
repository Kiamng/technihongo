"use client";
import { Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TermListProps {
  FlashcardList: { japaneseDefinition: string; vietEngTranslation: string }[];
}

const TermList = ({ FlashcardList }: TermListProps) => {
  const SpeechQuestion = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-[1200px] p-10 mx-auto rounded-2xl bg-white dark:bg-secondary shadow-md dark:shadow-none space-y-10">
      <div className="font-bold text-2xl">Từ vựng trong bài</div>
      <div className="grid grid-cols-2 gap-4">
        {FlashcardList.map((term, index) => (
          <div
            key={index}
            className="min-h-28 rounded-xl border-[1px] flex justify-between items-center p-4 shadow-md dark:shadow-none dark:border-primary"
          >
            <div className="font-bold text-xl">{term.japaneseDefinition}</div>
            <div>{term.vietEngTranslation}</div>
            <Button
              className="rounded-full"
              size={"icon"}
              onClick={() => SpeechQuestion(term.japaneseDefinition)}
            >
              <Volume2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermList;
