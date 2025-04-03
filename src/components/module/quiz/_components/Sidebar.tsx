// "use client";

// import { Answers, QuizQuestion } from "@/types/quiz";
// import { Button } from "@/components/ui/button";

// interface SidebarProps {
//   answers: Answers;
//   completedQuestions: number;
//   remainingQuestions: number;
//   totalQuestions: number;
//   isSubmitting: boolean;
//   questions: QuizQuestion[];
//   onQuestionClick: (index: number) => void;
//   onSubmit: () => void;
// }

// export function Sidebar({
//   answers,
//   completedQuestions,
//   remainingQuestions,
//   totalQuestions,
//   isSubmitting,
//   questions,
//   onQuestionClick,
//   onSubmit,
// }: SidebarProps) {
//   return (
//     <div className="p-4 bg-white border rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Tiến độ</h2>
//       <p className="mb-2">
//         Hoàn thành: {completedQuestions}/{totalQuestions}
//       </p>
//       <p className="mb-4">Còn lại: {remainingQuestions}</p>
//       <div className="grid grid-cols-5 gap-2 mb-4">
//         {questions.map((question, index) => {
//           const questionId = question.id;
//           const isAnswered =
//             answers[questionId] !== undefined &&
//             answers[questionId] !== null &&
//             (Array.isArray(answers[questionId])
//               ? (answers[questionId] as number[]).length > 0
//               : true);

//           return (
//             <Button
//               key={questionId}
//               className={`w-10 h-10 flex items-center justify-center ${
//                 isAnswered
//                   ? "bg-green-500 text-white hover:bg-green-600"
//                   : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//               }`}
//               onClick={() => onQuestionClick(index)}
//             >
//               {index + 1}
//             </Button>
//           );
//         })}
//       </div>
//       <Button
//         className="w-full bg-green-500 text-white hover:bg-green-600"
//         disabled={isSubmitting || completedQuestions !== totalQuestions}
//         onClick={onSubmit}
//       >
//         {isSubmitting ? "Đang nộp..." : "Nộp bài"}
//       </Button>
//     </div>
//   );
// }

"use client";

import { Answers, QuizQuestion } from "@/types/quiz";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  answers: Answers;
  completedQuestions: number;
  remainingQuestions: number;
  totalQuestions: number;
  isSubmitting: boolean;
  questions: QuizQuestion[];
  onQuestionClick: (index: number) => void;
  onSubmit: () => void;
}

export function Sidebar({
  answers,
  completedQuestions,
  remainingQuestions,
  totalQuestions,
  isSubmitting,
  questions,
  onQuestionClick,
  onSubmit,
}: SidebarProps) {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Tiến độ</h2>
      <p className="mb-2">
        Hoàn thành: {completedQuestions}/{totalQuestions}
      </p>
      <p className="mb-4">Còn lại: {remainingQuestions}</p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((question, index) => {
          const questionId = question.id;
          const isAnswered =
            answers[questionId] !== undefined &&
            answers[questionId] !== null &&
            (Array.isArray(answers[questionId])
              ? (answers[questionId] as number[]).length > 0
              : true);

          return (
            <Button
              key={questionId}
              className={`w-10 h-10 flex items-center justify-center ${
                isAnswered
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => onQuestionClick(index)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
      <Button
        className="w-full bg-green-500 text-white hover:bg-green-600"
        disabled={isSubmitting} // Chỉ disable khi đang submit
        onClick={onSubmit}
      >
        {isSubmitting ? "Đang nộp..." : "Nộp bài"}
      </Button>
    </div>
  );
}
