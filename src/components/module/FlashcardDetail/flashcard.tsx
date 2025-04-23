"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface FlashcardProps {
  japaneseDefinition: string;
  vietEngTranslation: string;
  imageUrl: string;
}

const Flashcard: React.FC<FlashcardProps> = ({
  japaneseDefinition,
  vietEngTranslation,
  imageUrl,
}) => {
  const [flipped, setFlipped] = useState(false);

  // Hàm đọc nội dung mặt trước (tiếng Nhật)
  const SpeechQuestion = () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(japaneseDefinition);

    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  };

  // Hỗ trợ lật thẻ bằng phím Space & Enter, đọc nội dung bằng phím "v"
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // Ngăn cuộn trang khi nhấn Space
      setFlipped(!flipped);
    } else if (e.key.toLowerCase() === "v") {
      SpeechQuestion(); // Đọc nội dung khi nhấn "v"
    }
  };

  return (
    <div className="flashcard-container">
      <div
        className={`flashcard ${flipped ? "flipped" : ""} w-[800px] h-[340px] perspective-[1000px]`}
        role="button"
        tabIndex={0}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={handleKeyDown} // Bắt sự kiện bàn phím
      >
        {/* Mặt trước của flashcard */}
        <div className="front bg-white dark:bg-secondary absolute w-full h-full backface-hidden flex justify-center items-center rounded-[20px] border-[4px] border-primary text-center">
          <div className="flashcard-content-font">{japaneseDefinition}</div>
          <Button
            className="rounded-full absolute bottom-4 right-4"
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn chặn lật thẻ khi bấm nút loa
              SpeechQuestion();
            }}
          >
            <Volume2 />
          </Button>
        </div>

        {/* Mặt sau của flashcard */}
        <div className="back bg-white dark:bg-secondary absolute w-full h-full backface-hidden flex justify-center items-center rounded-[20px] border-[4px] border-primary transform rotateY-[180deg] text-center">
          {imageUrl ? (
            <>
              <div className="flex-1 text-5xl font-bold">
                {vietEngTranslation}
              </div>
              <div className="flex-1 flex justify-center items-center">
                <img
                  alt="flashcard-img"
                  className="max-w-[300px] max-h-[300px] object-cover"
                  src={imageUrl}
                />
              </div>
            </>
          ) : (
            <div className="flashcard-content-font">{vietEngTranslation}</div>
          )}
          <Button
            className="rounded-full absolute bottom-4 right-4"
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();
              SpeechQuestion();
            }}
          >
            <Volume2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
