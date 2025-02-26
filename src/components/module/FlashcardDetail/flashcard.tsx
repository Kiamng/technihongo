"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface FlashcardProps {
  question: string;
  answer: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  const SpeechQuestion = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngừng sự kiện click từ Button, không lật flashcard
    const utterance = new SpeechSynthesisUtterance(question);

    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Space") {
      setFlipped(!flipped);
    }
  };

  return (
    <div className="flashcard-container">
      <div
        className={`flashcard ${
          flipped ? "flipped" : ""
        } w-[800px] h-[340px] perspective-[1000px]`}
        role="button"
        tabIndex={0}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={handleKeyDown}
      >
        {/* Mặt trước của flashcard */}
        <div className="front bg-white dark:bg-secondary absolute w-full h-full backface-hidden flex justify-center items-center  rounded-[20px] border-[4px] border-primary   text-center">
          <div className="flashcard-content-font ">{question}</div>
          <Button
            className="rounded-full absolute bottom-4 right-4"
            size={"icon"}
            onClick={SpeechQuestion}
          >
            <Volume2 />
          </Button>
        </div>

        {/* Mặt sau của flashcard */}
        <div className="back bg-white dark:bg-secondary absolute w-full h-full backface-hidden flex justify-center items-center  rounded-[20px] border-[4px] border-primary transform rotateY-[180deg] text-center">
          <div className="flashcard-content-font">{answer}</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
