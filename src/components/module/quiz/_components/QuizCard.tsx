// "use client";

// import { Button } from "@/components/ui/button";
// import { Answers, QuizQuestion } from "@/types/quiz";

// interface QuizCardProps {
//   question: QuizQuestion;
//   answers: Answers;
//   index: number;
//   isListMode: boolean;
//   onAnswerChange: (
//     questionId: number,
//     optionId: number,
//     isMultiple: boolean,
//   ) => void;
//   onNext: () => void;
//   isReviewMode?: boolean;
//   reviewData?: {
//     isCorrect: boolean;
//     selectedOptions: { optionId: number; optionText: string }[];
//     correctOptions: { optionId: number; optionText: string }[];
//   };
// }

// export function QuizCard({
//   question,
//   answers,
//   index,
//   isListMode,
//   onAnswerChange,
//   onNext,
//   isReviewMode = false,
//   reviewData,
// }: QuizCardProps) {
//   const isMultiple = question.type === "multiple";

//   if (isReviewMode && reviewData) {
//     return (
//       <div className="p-4 border rounded-lg bg-white shadow-md">
//         <h3 className="text-lg font-semibold mb-2">
//           Câu {index + 1}: {question.question}
//         </h3>
//         <div className="mt-2">
//           {question.options.map((option) => {
//             const isSelected = reviewData.selectedOptions.some(
//               (o) => o.optionId === option.id,
//             );
//             const isCorrect = reviewData.correctOptions.some(
//               (o) => o.optionId === option.id,
//             );
//             const className = isSelected
//               ? isCorrect
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//               : isCorrect
//                 ? "bg-green-50 text-green-600"
//                 : "bg-gray-50 text-gray-800";

//             return (
//               <div key={option.id} className={`p-2 my-1 rounded ${className}`}>
//                 {option.text}
//                 {isSelected && !isCorrect && " (Bạn chọn sai)"}
//                 {isCorrect && " (Đáp án đúng)"}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }

//   const handleChange = (optionId: number) => {
//     onAnswerChange(question.id, optionId, isMultiple);
//   };

//   return (
//     <div className="p-4 border rounded-lg bg-white shadow-md">
//       <h3 className="text-lg font-semibold mb-2">
//         Câu {index + 1}: {question.question}
//       </h3>
//       <div className="space-y-2">
//         {question.options.map((option) => (
//           <label key={option.id} className="flex items-center">
//             <input
//               checked={
//                 isMultiple
//                   ? (answers[question.id] as number[])?.includes(option.id) ||
//                     false
//                   : answers[question.id] === option.id
//               }
//               className="mr-2"
//               name={`question-${question.id}`}
//               type={isMultiple ? "checkbox" : "radio"}
//               onChange={() => handleChange(option.id)}
//             />
//             {option.text}
//           </label>
//         ))}
//       </div>
//       {!isListMode && (
//         <Button className="hover:scale-105 duration-100" onClick={onNext}>
//           Câu tiếp theo
//         </Button>
//       )}
//     </div>
//   );
// }

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
  onClearAnswer?: (questionId: number) => void; // Tùy chọn
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
        <div className="mt-2">
          {question.options.map((option) => {
            const isSelected = reviewData.selectedOptions.some(
              (o) => o.optionId === option.id,
            );
            const isCorrect = reviewData.correctOptions.some(
              (o) => o.optionId === option.id,
            );
            const className = isSelected
              ? isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              : isCorrect
                ? "bg-green-50 text-green-600"
                : "bg-gray-50 text-gray-800";

            return (
              <div key={option.id} className={`p-2 my-1 rounded ${className}`}>
                {option.text}
                {isSelected && !isCorrect && " (Bạn chọn sai)"}
                {isCorrect && " (Đáp án đúng)"}
              </div>
            );
          })}
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
      <h3 className="text-lg font-semibold mb-2">
        Câu {index + 1}: {question.question}
      </h3>
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
        {!isListMode && (
          <Button className="hover:scale-105 duration-100" onClick={onNext}>
            Câu tiếp theo
          </Button>
        )}
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
