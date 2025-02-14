"use client";

import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useState } from "react";

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

  return (
    <div className="flashcard-container">
      <div
        className={`flashcard ${
          flipped ? "flipped" : ""
        } w-[800px] h-[340px] perspective-[1000px]`}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Mặt trước của flashcard */}
        <div className="front bg-white dark:bg-secondary absolute w-full h-full backface-hidden flex justify-center items-center  rounded-[20px] border-[4px] border-primary   text-center">
          <div className="flashcard-content-font ">{question}</div>
          <Button
            size={"icon"}
            className="rounded-full absolute bottom-4 right-4"
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
