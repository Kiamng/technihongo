"use client";

import { useState } from "react";

import { Flashcard } from "@/app/api/studentflashcardset/stuflashcard.api";
import { LessonResource } from "@/types/lesson-resource";

interface ReviewGameProps {
  flashcards: Flashcard[];
  onExit: () => void;
  isSystem?: boolean;
  lessonResource?: LessonResource;
  hanldeCompleteLessonResource?: (
    type: string,
    lessonReourceId: number,
    resourceId: number,
  ) => Promise<void>;
}

export default function ReviewGame({
  flashcards,
  onExit,
  isSystem,
  lessonResource,
  hanldeCompleteLessonResource,
}: ReviewGameProps) {
  const [isStudying, setIsStudying] = useState<Flashcard[]>([]);
  const [isLearned, setIsLearned] = useState<Flashcard[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [socau, setSocau] = useState<number>(Math.min(10, flashcards.length));
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSetup, setIsSetup] = useState<boolean>(true);
  const [isFalse, setIsFalse] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<Flashcard[]>([]); // State mới để lưu options

  const shuffleFlashcards = (flashcards: Flashcard[]): Flashcard[] => {
    const shuffled = [...flashcards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  const generateOptions = (currentQuestion: Flashcard) => {
    let incorrectAnswers = flashcards
      .filter(
        (q) =>
          q.flashcardId !== currentQuestion.flashcardId &&
          q.vietEngTranslation !== currentQuestion.vietEngTranslation,
      )
      .sort(() => Math.random() - 0.5);

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

    setCurrentOptions(options); // Lưu options vào state
  };

  const handleStartLearning = () => {
    if (flashcards?.length) {
      const shuffledFlashcards = shuffleFlashcards(flashcards);
      const selectedFlashcards = shuffledFlashcards.slice(0, socau);

      setIsStudying(selectedFlashcards);
      setIsSetup(false);
      generateOptions(selectedFlashcards[0]); // Sinh options cho câu đầu tiên
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

    if (isCorrect) {
      setIsLearned((prev) => [...prev, currentQuestion]);
      const newStudying = isStudying.filter(
        (q) => q.flashcardId !== currentQuestion.flashcardId,
      );

      setIsStudying(newStudying);
      if (newStudying.length === 0) {
        setShowResults(true);
        if (isSystem && lessonResource && hanldeCompleteLessonResource) {
          hanldeCompleteLessonResource(
            "FlashcardSet",
            lessonResource.lessonResourceId,
            lessonResource.systemFlashCardSet?.systemSetId as number,
          );
        }

        return;
      }
      setCurrentQuestionIndex((prev) => Math.min(prev, newStudying.length - 1));
      generateOptions(
        newStudying[Math.min(currentQuestionIndex, newStudying.length - 1)],
      );
    } else {
      setCurrentQuestionIndex((prev) => (prev + 1) % isStudying.length);
      generateOptions(
        isStudying[(currentQuestionIndex + 1) % isStudying.length],
      );
    }

    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleContinue = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
    generateOptions(isStudying[0]); // Sinh options khi tiếp tục
  };

  const currentQuestion = isStudying[currentQuestionIndex];

  if (!currentQuestion && !isSetup && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A2A44] to-[#0f1a2e] text-white p-6 flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto animate-spin" />
          </div>
          <p className="text-xl font-medium">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (isSetup) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {isSystem ? "Chế độ học flashcard" : "Chọn số câu để học"}
          </h1>

          {!isSystem ? (
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center mb-4 w-full">
                <input
                  className="p-3 bg-gray-50 text-gray-800 rounded-lg w-full mr-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#56D071] focus:border-transparent transition-all duration-300"
                  disabled={isSystem}
                  max={flashcards.length}
                  min="1"
                  type="number"
                  value={socau}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);

                    if (
                      !isNaN(value) &&
                      value > 0 &&
                      value <= flashcards.length
                    ) {
                      setSocau(value);
                    }
                  }}
                />
                <span className="text-lg font-medium text-gray-700">
                  / {flashcards.length} câu
                </span>
              </div>

              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mb-4 hover:bg-gray-200 transition-all duration-300 w-full"
                onClick={() => setSocau(flashcards.length)}
              >
                Chọn tất cả
              </button>
            </div>
          ) : (
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
              Số thẻ trong bài: {flashcards.length}
            </h1>
          )}

          <div className="flex flex-col gap-3">
            <button
              className="px-6 py-3 bg-[#56D071] text-white font-bold rounded-lg hover:bg-[#56D071]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={handleStartLearning}
            >
              Bắt đầu học
            </button>

            <button
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={onExit}
            >
              Thoát
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Kết quả
          </h1>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-gray-700">Số câu đã học:</span>
              <span className="text-2xl font-bold text-gray-800">
                {isLearned.length}/{socau}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-700">Số lần sai:</span>
              <span className="text-2xl font-bold text-red-500">
                {isFalse.length}
              </span>
            </div>
          </div>

          {isStudying.length > 0 ? (
            <div className="flex flex-col gap-3">
              <button
                className="px-6 py-3 bg-[#56D071] text-white font-bold rounded-lg hover:bg-[#56D071]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={handleContinue}
              >
                Tiếp tục
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={onExit}
              >
                Thoát ôn tập
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-xl font-medium mb-6 text-gray-800">
                Bạn đã hoàn thành ôn tập!
              </p>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={onExit}
              >
                Thoát ôn tập
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isStudying.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A2A44] to-[#0f1a2e] text-white p-6 flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-xl font-medium mb-6">Bạn đã hoàn thành ôn tập!</p>
          <button
            className="px-6 py-3 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={onExit}
          >
            Thoát ôn tập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#56D071] text-white rounded-full flex items-center justify-center mr-3 font-bold shadow-md">
              {isLearned.length + 1}
            </div>
            <span className="text-lg font-medium text-gray-700">Tiến độ</span>
          </div>
          <div className="w-10 h-10 bg-[#56D071] text-white rounded-full flex items-center justify-center font-bold shadow-md">
            {socau}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-[#56D071] h-3 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <button
          className="absolute top-4 right-4 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 transform hover:scale-110 shadow-md"
          onClick={onExit}
        >
          ✕
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Định nghĩa</h2>
        </div>
        <p className="text-xl mb-8 bg-gray-50 p-4 rounded-xl text-gray-800 shadow-inner">
          {currentQuestion.japaneseDefinition}
        </p>

        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Chọn thuật ngữ ứng dụng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentOptions.map((option, index) => (
            <button
              key={option.flashcardId}
              className={`p-4 bg-gray-50 border-2 rounded-xl text-left transition-all duration-300 flex items-center justify-between shadow-sm ${showAnswer &&
                  option.vietEngTranslation === currentQuestion.vietEngTranslation
                  ? "border-[#56D071] bg-[#56D071]/10"
                  : selectedAnswer === option.vietEngTranslation
                    ? "border-red-400 bg-red-50"
                    : "border-transparent hover:border-gray-300 hover:bg-gray-100"
                }`}
              disabled={showAnswer}
              onClick={() => handleAnswerSelect(option.vietEngTranslation)}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <span className="text-lg text-gray-800">
                  {option.vietEngTranslation}
                </span>
              </div>
              {showAnswer &&
                (option.vietEngTranslation ===
                  currentQuestion.vietEngTranslation ? (
                  <span className="text-[#56D071] text-2xl font-bold">✔</span>
                ) : selectedAnswer === option.vietEngTranslation ? (
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                ) : null)}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div className="mt-8 text-center">
            {isCorrect ? (
              <div className="text-[#56D071] font-bold text-2xl mb-6 flex items-center justify-center">
                <span className="mr-2">✔</span> Đúng rồi!
              </div>
            ) : (
              <div className="text-red-400 font-bold text-2xl mb-6 flex items-center justify-center">
                <span className="mr-2">✕</span> Sai rồi! Cố gắng hơn nhé!
              </div>
            )}
            <button
              className="px-8 py-3 bg-[#56D071] text-white font-bold rounded-lg hover:bg-[#56D071]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
