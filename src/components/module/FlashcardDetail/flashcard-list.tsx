"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Flashcard from "./flashcard";

import { Progress } from "@/components/ui/progress";

interface FlashcardListProps {
  FlashcardList: {
    japaneseDefinition: string;
    vietEngTranslation: string;
    imageUrl: string;
  }[];
}

const FlashcardList = ({ FlashcardList }: FlashcardListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const progressValue = ((currentIndex + 1) / FlashcardList.length) * 100;

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FlashcardList.length);
  };

  const previousCard = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + FlashcardList.length) % FlashcardList.length,
    );
  };

  // Lắng nghe sự kiện bàn phím để điều hướng flashcard
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        nextCard();
      } else if (event.key === "ArrowLeft") {
        previousCard();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]); // Thêm `currentIndex` để cập nhật state khi di chuyển

  return (
    <>
      <div className="w-[800px] h-[350px] overflow-hidden">
        <div
          className="flashcards-container"
          style={{
            display: "flex",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentIndex * 100}%)`,
            width: "100%",
            height: "100%",
          }}
        >
          {FlashcardList.map((card, index) => (
            <div
              key={index}
              className="flashcard-item"
              style={{
                minWidth: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Flashcard
                imageUrl={card.imageUrl}
                japaneseDefinition={card.japaneseDefinition}
                vietEngTranslation={card.vietEngTranslation}
              />
            </div>
          ))}
        </div>
      </div>
      <Progress className="w-full mx-auto h-1" value={progressValue} />
      <div className="flex space-x-4 items-center justify-center">
        <button
          className="rounded-full p-3 bg-primary hover:scale-105 transition duration-200"
          onClick={previousCard}
        >
          <ChevronLeft className="text-white" size={36} strokeWidth={2.5} />
        </button>
        <div className="text-xl">
          {currentIndex + 1} / {FlashcardList.length}
        </div>
        <button
          className="rounded-full p-3 bg-primary hover:scale-105 transition duration-200"
          onClick={nextCard}
        >
          <ChevronRight className="text-white" size={36} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
};

export default FlashcardList;
