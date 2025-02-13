"use client";

import { useState } from "react";

interface FlashcardProps {
  question: string;
  answer: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
      <div
        className={`flashcard ${
          flipped ? "flipped" : ""
        } w-[800px] h-[340px] perspective-[1000px]`}
      >
        {/* Mặt trước của flashcard */}
        <div className="front absolute w-full h-full backface-hidden flex justify-center items-center bg-white rounded-[20px] border-[4px] border-primary  text-xl text-center">
          <p>{question}</p>
        </div>

        {/* Mặt sau của flashcard */}
        <div className="back absolute w-full h-full backface-hidden flex justify-center items-center bg-white rounded-[20px] border-[4px] border-primary transform rotateY-[180deg] text-xl text-center">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
