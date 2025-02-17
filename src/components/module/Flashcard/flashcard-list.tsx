"use client";

import { useState } from "react";
import Flashcard from "./flashcard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FlashcardList = () => {
  const flashcards = [
    { question: "会見", answer: "かいけん: hội họp" },
    { question: "国会", answer: "こっかい: quốc hội" },
    {
      question: "会社",
      answer: "かいしゃ: công ty",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const previousCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flashcard-app flex flex-col space-y-6 bg-secondary p-10 w-fit rounded-2xl border-[1px] bg-white dark:bg-secondary">
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
            {flashcards.map((card, index) => (
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
                <Flashcard question={card.question} answer={card.answer} />
              </div>
            ))}
          </div>
        </div>
        <Progress value={currentIndex} className="w-full" />
        <div className="flex space-x-4 items-center justify-center">
          <button
            onClick={previousCard}
            className="rounded-full p-3 bg-primary hover:scale-105 transition duration-200"
          >
            <ChevronLeft size={36} strokeWidth={2.5} className="text-white " />
          </button>
          <div className="text-xl">
            {currentIndex + 1} / {flashcards.length}
          </div>
          <button
            onClick={nextCard}
            className="rounded-full p-3 bg-primary hover:scale-105 transition duration-200"
          >
            <ChevronRight size={36} strokeWidth={2.5} className="text-white " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;
