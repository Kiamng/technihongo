"use client";

import { useState } from "react";
import Flashcard from "./flashcard";

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
    <div className="flashcard-app flex flex-col items-center justify-center space-y-4">
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

      <div className="flex space-x-4 mt-4">
        <button
          onClick={previousCard}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Previous
        </button>
        <div className="text-xl">
          {currentIndex + 1} / {flashcards.length}
        </div>
        <button
          onClick={nextCard}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardList;
