"use client";

import { Button } from "@/components/ui/button";
import { Answers, QuizQuestion } from "@/types/quiz";

interface QuizCardProps {
  question: QuizQuestion;
  answers: Answers;
  index: number;
  isListMode: boolean;
  onAnswerChange: (
    questionId: number,
    optionId: number,
    isMultiple: boolean,
  ) => void;
  onClearAnswer?: (questionId: number) => void;
  onNext: () => void;
  isReviewMode?: boolean;
  reviewData?: {
    isCorrect: boolean;
    selectedOptions: { optionId: number; optionText: string }[];
    correctOptions: { optionId: number; optionText: string }[];
  };
}

export function QuizCard({
  question,
  answers,
  index,
  isListMode,
  onAnswerChange,
  onClearAnswer,
  onNext,
  isReviewMode = false,
  reviewData,
}: QuizCardProps) {
  const isMultiple = question.type === "multiple";

  if (isReviewMode && reviewData) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <h3 className="text-lg font-semibold mb-2">
          Câu {index + 1}: {question.question}
        </h3>
        {question.url && (
          <div className="flex justify-center my-3">
            <img
              alt={`Question ${index + 1}`}
              className="max-w-[250px] h-auto rounded shadow"
              src={question.url}
            />
          </div>
        )}
        <div className="mt-2">
          {question.options.map((option) => {
            const isSelected = reviewData.selectedOptions.some(
              (o) => o.optionId === option.id,
            );
            // Kiểm tra xem option này có phải là đáp án đúng không
            const isCorrectOption = Array.isArray(question.correctAnswer)
              ? question.correctAnswer.includes(option.id)
              : question.correctAnswer === option.id;

            let className = "bg-gray-50 text-gray-800";
            let feedback = "";

            if (isSelected) {
              if (isCorrectOption) {
                className = "bg-green-100 text-green-800"; // Đáp án đúng được chọn
              } else {
                className = "bg-red-100 text-red-800"; // Đáp án sai được chọn
                feedback = " (Bạn chọn sai)";
              }
            }

            return (
              <div key={option.id} className={`p-2 my-1 rounded ${className}`}>
                {option.text}
                {isSelected && feedback}
              </div>
            );
          })}
          {/* Hiển thị thông báo nếu thiếu đáp án đúng trong trường hợp multiple choice
          {isMultiple && !reviewData.isCorrect && (
            <p className="text-sm text-red-600 mt-2">
              (Bạn chưa chọn đủ hoặc chọn sai đáp án)
            </p>
          )} */}
          {question.explanation && (
            <div className="mt-4 p-3 border-t pt-2 text-lg">
              <strong>Giải thích:</strong> {question.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleChange = (optionId: number) => {
    onAnswerChange(question.id, optionId, isMultiple);
  };

  const handleClear = () => {
    if (onClearAnswer) {
      onClearAnswer(question.id);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold flex-1">
        Câu {index + 1}: {question.question}
      </h3>
      {question.url && (
        <div className="flex justify-center my-3">
          <img
            alt={`Question ${index + 1}`}
            className="max-w-[250px] h-auto rounded shadow"
            src={question.url}
          />
        </div>
      )}
      <div className="space-y-2">
        {question.options.map((option) => (
          <label key={option.id} className="flex items-center">
            <input
              checked={
                isMultiple
                  ? (answers[question.id] as number[])?.includes(option.id) ||
                  false
                  : answers[question.id] === option.id
              }
              className="mr-2"
              name={`question-${question.id}`}
              type={isMultiple ? "checkbox" : "radio"}
              onChange={() => handleChange(option.id)}
            />
            {option.text}
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {onClearAnswer && (
          <Button
            className="border-gray-400 text-gray-700 hover:bg-gray-100"
            variant="outline"
            onClick={handleClear}
          >
            Xóa câu trả lời
          </Button>
        )}
      </div>
    </div>
  );
}
