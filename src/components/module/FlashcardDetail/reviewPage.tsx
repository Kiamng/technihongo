"use client";

import { useState } from "react";

import {
  Flashcard,
  FlashcardSet,
} from "@/app/api/studentflashcardset/stuflashcard.api";

interface ReviewGameProps {
  flashcardSet: FlashcardSet;
  onExit: () => void;
}

export default function ReviewGame({ flashcardSet, onExit }: ReviewGameProps) {
  const [isStudying, setIsStudying] = useState<Flashcard[]>([]);
  const [isLearned, setIsLearned] = useState<Flashcard[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [socau, setSocau] = useState<number>(
    Math.min(10, flashcardSet.flashcards.length),
  );
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSetup, setIsSetup] = useState<boolean>(true);
  const [isFalse, setIsFalse] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const shuffleFlashcards = (flashcards: Flashcard[]): Flashcard[] => {
    const shuffled = [...flashcards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  const handleStartLearning = () => {
    if (flashcardSet?.flashcards?.length) {
      const shuffledFlashcards = shuffleFlashcards(flashcardSet.flashcards);
      const selectedFlashcards = shuffledFlashcards.slice(0, socau);

      setIsStudying(selectedFlashcards);
      setIsSetup(false);
    }
  };

  const progress = (isLearned.length / socau) * 100;

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = isStudying[currentQuestionIndex];

    if (!currentQuestion || selectedAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    if (answer === currentQuestion.vietEngTranslation) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setIsFalse((prev) => [...prev, currentQuestion]);
    }

    setQuestionsAnswered((prev) => prev + 1);
  };

  const handleNextQuestion = () => {
    const currentQuestion = isStudying[currentQuestionIndex];

    if (!currentQuestion) {
      setShowResults(true);
      setQuestionsAnswered(0);

      return;
    }

    // Process the answer result
    if (isCorrect) {
      setIsLearned((prev) => [...prev, currentQuestion]);

      const newStudying = isStudying.filter(
        (q) => q.flashcardId !== currentQuestion.flashcardId,
      );

      setIsStudying(newStudying);

      if (newStudying.length === 0) {
        setShowResults(true);

        return;
      }

      setCurrentQuestionIndex((prev) => Math.min(prev, newStudying.length - 1));
    } else {
      // If wrong, just move to next question but keep this one in the study list
      setCurrentQuestionIndex((prev) => (prev + 1) % isStudying.length);
    }

    // Reset the answer state
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleContinue = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
  };

  const currentQuestion = isStudying[currentQuestionIndex];

  if (!currentQuestion && !isSetup && !showResults) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (isSetup) {
    return (
      <div className="min-h-screen bg-[#56D071] text-white p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Chọn số câu để học</h1>
        <div className="flex items-center mb-4">
          <input
            className="p-2 bg-gray-800 text-white rounded-lg w-32 mr-2"
            max={flashcardSet.flashcards.length}
            min="1"
            type="number"
            value={socau}
            onChange={(e) => {
              const value = parseInt(e.target.value);

              if (
                !isNaN(value) &&
                value > 0 &&
                value <= flashcardSet.flashcards.length
              ) {
                setSocau(value);
              }
            }}
          />
          <span> / {flashcardSet.flashcards.length} câu</span>
        </div>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 hover:bg-gray-600"
          onClick={() => setSocau(flashcardSet.flashcards.length)}
        >
          Chọn tất cả
        </button>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleStartLearning}
        >
          Bắt đầu học
        </button>
        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          onClick={onExit}
        >
          Thoát
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#56D071] text-white p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Kết quả</h1>
        <p>
          Số câu đã học: {isLearned.length}/{socau}
        </p>
        <p>Số lần sai: {isFalse.length}</p>
        {isStudying.length > 0 ? (
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={handleContinue}
          >
            Tiếp tục
          </button>
        ) : (
          <p>Bạn đã hoàn thành ôn tập!</p>
        )}
        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          onClick={onExit}
        >
          Thoát ôn tập
        </button>
      </div>
    );
  }

  if (isStudying.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
        <p>Bạn đã hoàn thành ôn tập!</p>
        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          onClick={onExit}
        >
          Thoát ôn tập
        </button>
      </div>
    );
  }

  // Get incorrect answers from entire flashcardSet
  let incorrectAnswers = flashcardSet.flashcards
    .filter(
      (q) =>
        q.flashcardId !== currentQuestion.flashcardId &&
        q.vietEngTranslation !== currentQuestion.vietEngTranslation,
    )
    .sort(() => Math.random() - 0.5);

  // Get 3 unique incorrect answers
  const uniqueIncorrectAnswers: Flashcard[] = [];
  const usedTranslations = new Set<string>([
    currentQuestion.vietEngTranslation,
  ]);

  for (const flashcard of incorrectAnswers) {
    if (!usedTranslations.has(flashcard.vietEngTranslation)) {
      uniqueIncorrectAnswers.push(flashcard);
      usedTranslations.add(flashcard.vietEngTranslation);
    }
    if (uniqueIncorrectAnswers.length === 3) break;
  }

  // If not enough incorrect answers, add from studying set
  if (uniqueIncorrectAnswers.length < 3) {
    const remainingNeeded = 3 - uniqueIncorrectAnswers.length;
    const additionalIncorrect = isStudying
      .filter(
        (q) =>
          q.flashcardId !== currentQuestion.flashcardId &&
          q.vietEngTranslation !== currentQuestion.vietEngTranslation &&
          !usedTranslations.has(q.vietEngTranslation),
      )
      .slice(0, remainingNeeded);

    uniqueIncorrectAnswers.push(...additionalIncorrect);
  }

  const options = [...uniqueIncorrectAnswers, currentQuestion].sort(
    () => Math.random() - 0.5,
  );

  return (
    <div className="min-h-screen bg-[#1A2A44] text-white p-6 flex flex-col items-center">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
          {isLearned.length + 1}
        </div>
        <div className="w-96 bg-gray-600 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-2">
          {socau}
        </div>
      </div>

      <div className="relative bg-[#2A3F5F] p-6 rounded-lg w-full max-w-2xl">
        <button
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onExit}
        >
          ✕
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Định nghĩa</h2>
        </div>
        <p className="text-xl mb-6">{currentQuestion.japaneseDefinition}</p>

        <h3 className="text-lg font-bold mb-4">Chọn thuật ngữ ứng dụng</h3>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={option.flashcardId}
              className={`p-4 bg-[#4A2C3F] border-2 rounded-lg text-left transition-all duration-300 flex items-center justify-between ${
                showAnswer &&
                option.vietEngTranslation === currentQuestion.vietEngTranslation
                  ? "border-green-500" // Luôn viền xanh cho đáp án đúng
                  : selectedAnswer === option.vietEngTranslation
                    ? "border-red-500" // Viền đỏ nếu chọn sai
                    : "border-transparent hover:border-gray-400" // Chưa chọn
              }`}
              disabled={showAnswer}
              onClick={() => handleAnswerSelect(option.vietEngTranslation)}
            >
              <div>
                <span className="mr-2">{index + 1}</span>
                {option.vietEngTranslation}
              </div>
              {showAnswer &&
                (option.vietEngTranslation ===
                currentQuestion.vietEngTranslation ? (
                  <span className="text-green-500 font-bold">✔</span>
                ) : selectedAnswer === option.vietEngTranslation ? (
                  <span className="text-red-500 font-bold">✕</span>
                ) : null)}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div className="mt-6 text-center">
            {isCorrect ? (
              <div className="text-green-500 font-bold text-xl mb-4">
                Đúng rồi!
              </div>
            ) : (
              <div className="text-red-500 font-bold text-xl mb-4">
                Sai rồi! Cố gắng hơn nhé!
              </div>
            )}
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={handleNextQuestion}
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
