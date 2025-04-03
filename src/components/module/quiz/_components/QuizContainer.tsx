// "use client";

// import { useState, useRef, useMemo, useCallback } from "react";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";

// import { QuizCard } from "./QuizCard";
// import { Sidebar } from "./Sidebar";
// import { QuizResults } from "./QuizResults";

// import { Toaster } from "@/components/ui/sonner";
// import {
//   QuizData,
//   Answers,
//   StartAttemptResponse,
//   convertApiQuestionToQuizQuestion,
//   QuizQuestion,
// } from "@/types/quiz";
// import {
//   startQuizAttempt,
//   getQuizQuestions,
//   submitQuizAttempt,
// } from "@/app/api/quiz/quiz.api";
// import { Button } from "@/components/ui/button";

// interface QuizContainerProps {
//   quizData: QuizData;
//   onBackToList: () => void;
// }

// export function QuizContainer({ quizData, onBackToList }: QuizContainerProps) {
//   const { data: session } = useSession();
//   const [selectedAnswers, setSelectedAnswers] = useState<Answers>({});
//   const [answers, setAnswers] = useState<Answers>({});
//   const [isQuizStarted, setIsQuizStarted] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [viewMode, setViewMode] = useState<"single" | "list">("single");
//   const [attemptData, setAttemptData] = useState<
//     StartAttemptResponse["data"] | null
//   >(null);
//   const [questions, setQuestions] = useState<QuizQuestion[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [reviewAttemptId, setReviewAttemptId] = useState<number | null>(null);

//   const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

//   const fetchQuizQuestions = async ([token, quizId]: [string, number]) => {
//     try {
//       setIsLoading(true);
//       const response = await getQuizQuestions(token, quizId);
//       const formattedQuestions = response.data.map((apiQuestion) =>
//         convertApiQuestionToQuizQuestion(apiQuestion),
//       );

//       setQuestions(formattedQuestions);
//       setIsLoading(false);
//     } catch (error: any) {
//       toast(error.message || "Lỗi khi tải câu hỏi quiz!", {
//         className: "bg-red-500 text-white",
//       });
//       setIsLoading(false);
//     }
//   };

//   const handleStartQuiz = async () => {
//     if (!session?.user?.token) {
//       toast("Vui lòng đăng nhập để bắt đầu quiz!", {
//         className: "bg-red-500 text-white",
//       });

//       return;
//     }
//     try {
//       setIsLoading(true);
//       const response = await startQuizAttempt(
//         session.user.token,
//         quizData.quizId,
//       );

//       setAttemptData(response.data);
//       await fetchQuizQuestions([session.user.token, quizData.quizId]);
//       setIsQuizStarted(true);
//       setIsLoading(false);
//     } catch (error: any) {
//       setIsLoading(false);
//       toast(error.message || "Không thể bắt đầu quiz!", {
//         className: "bg-red-500 text-white",
//       });
//     }
//   };

//   const handleAnswerChange = useCallback(
//     (questionId: number, optionId: number, isMultiple: boolean) => {
//       setSelectedAnswers((prevAnswers) => {
//         if (isMultiple) {
//           const currentAnswers = (prevAnswers[questionId] as number[]) || [];
//           const newAnswers = currentAnswers.includes(optionId)
//             ? currentAnswers.filter((id) => id !== optionId)
//             : [...currentAnswers, optionId];

//           if (newAnswers.length === 0) {
//             const { [questionId]: _, ...rest } = prevAnswers;

//             return rest;
//           }

//           return {
//             ...prevAnswers,
//             [questionId]: newAnswers,
//           };
//         } else {
//           return { ...prevAnswers, [questionId]: optionId };
//         }
//       });
//     },
//     [],
//   );

//   const nextQuestion = useCallback(() => {
//     if (questions.length === 0) return;
//     setCurrentQuestionIndex((prevIndex) =>
//       prevIndex < questions.length - 1 ? prevIndex + 1 : 0,
//     );
//   }, [questions.length]);

//   const handleSubmit = async () => {
//     if (!session?.user?.token || !attemptData) {
//       toast("Phiên đăng nhập hết hạn!", { className: "bg-red-500 text-white" });

//       return;
//     }
//     const completedQuestions = Object.keys(selectedAnswers).length;

//     if (completedQuestions !== questions.length) {
//       toast("Hoàn thành tất cả câu hỏi trước khi nộp!", {
//         className: "bg-red-500 text-white",
//       });

//       return;
//     }
//     try {
//       setIsSubmitting(true);
//       setSubmitError(null);

//       setAnswers(selectedAnswers);
//       const formattedAnswers = Object.entries(selectedAnswers).map(
//         ([questionId, selectedOption]) => ({
//           questionId: parseInt(questionId),
//           selectedOptionIds: Array.isArray(selectedOption)
//             ? selectedOption
//             : [selectedOption],
//         }),
//       );

//       await submitQuizAttempt(
//         session.user.token,
//         quizData.quizId,
//         attemptData.attemptId,
//         formattedAnswers,
//       );

//       setReviewAttemptId(attemptData.attemptId);
//       setIsSubmitted(true);
//       setIsSubmitting(false);

//       toast("Nộp bài thành công!", { className: "bg-green-500 text-white" });
//     } catch (error: any) {
//       setSubmitError(error.message || "Lỗi khi nộp bài!");
//       setIsSubmitting(false);
//       toast(error.message || "Lỗi khi nộp bài!", {
//         className: "bg-red-500 text-white",
//       });
//     }
//   };

//   const handleRetrySubmit = () => {
//     setSubmitError(null);
//     handleSubmit();
//   };

//   const scrollToQuestion = useCallback(
//     (index: number) => {
//       if (viewMode === "single") {
//         setCurrentQuestionIndex(index);
//       } else {
//         questionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
//       }
//     },
//     [viewMode],
//   );

//   const handleRetake = () => {
//     setSelectedAnswers({});
//     setAnswers({});
//     setIsSubmitted(false);
//     setCurrentQuestionIndex(0);
//     setViewMode("single");
//     setSubmitError(null);
//     setReviewAttemptId(null);
//     handleStartQuiz();
//   };

//   const completedQuestions = Object.entries(selectedAnswers).reduce(
//     (count, [_, value]) => {
//       return count + (Array.isArray(value) && value.length === 0 ? 0 : 1);
//     },
//     0,
//   );
//   const remainingQuestions = questions.length - completedQuestions;
//   const hasQuestions = questions.length > 0;

//   const questionList = useMemo(
//     () =>
//       hasQuestions ? (
//         questions.map((question, index) => (
//           <div
//             key={question.id}
//             ref={(el: HTMLDivElement | null) => {
//               questionRefs.current[index] = el;
//             }}
//             className="mb-8 pb-6 border-b border-gray-200"
//           >
//             <QuizCard
//               answers={selectedAnswers}
//               index={index}
//               isListMode={true}
//               question={question}
//               onAnswerChange={handleAnswerChange}
//               onNext={() => {}}
//             />
//           </div>
//         ))
//       ) : (
//         <div className="text-center p-4">Không có câu hỏi</div>
//       ),
//     [questions, selectedAnswers, handleAnswerChange],
//   );

//   const currentQuestion = useMemo(
//     () =>
//       hasQuestions ? (
//         <div
//           ref={(el: HTMLDivElement | null) => {
//             questionRefs.current[currentQuestionIndex] = el;
//           }}
//           className="min-h-screen"
//         >
//           <QuizCard
//             answers={selectedAnswers}
//             index={currentQuestionIndex}
//             isListMode={false}
//             question={questions[currentQuestionIndex]}
//             onAnswerChange={handleAnswerChange}
//             onNext={nextQuestion}
//           />
//         </div>
//       ) : (
//         <div className="text-center p-4">Không có câu hỏi</div>
//       ),
//     [
//       currentQuestionIndex,
//       selectedAnswers,
//       questions,
//       handleAnswerChange,
//       nextQuestion,
//     ],
//   );

//   if (isLoading) {
//     return <div>Đang tải dữ liệu...</div>;
//   }

//   if (!isQuizStarted) {
//     return (
//       <div className="max-w-2xl mx-auto text-center p-6">
//         <h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
//         <p className="text-gray-600 mb-6">
//           Số câu hỏi: {quizData.totalQuestions} | Thời gian:{" "}
//           {attemptData?.remainingTimeInSeconds
//             ? `${Math.floor(attemptData.remainingTimeInSeconds / 60)} phút`
//             : "Đang tải..."}
//         </p>
//         <div className="flex justify-center gap-4">
//           <Button onClick={handleStartQuiz}>Bắt đầu làm quiz</Button>
//           <Button onClick={onBackToList}>Quay lại danh sách</Button>
//         </div>
//       </div>
//     );
//   }

//   if (isSubmitted && reviewAttemptId) {
//     return (
//       <QuizResults
//         attemptId={reviewAttemptId}
//         questions={questions}
//         quizId={quizData.quizId}
//         onBackToList={onBackToList}
//         onRetake={handleRetake}
//       />
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto min-h-screen p-4">
//         <div className="col-span-12 md:col-span-8">
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex space-x-2">
//               <Button
//                 variant={viewMode === "single" ? "default" : "secondary"}
//                 onClick={() => setViewMode("single")}
//               >
//                 Từng câu
//               </Button>
//               <Button
//                 variant={viewMode === "list" ? "default" : "secondary"}
//                 onClick={() => setViewMode("list")}
//               >
//                 Danh sách
//               </Button>
//             </div>
//             <Button variant="default" onClick={onBackToList}>
//               Quay lại danh sách
//             </Button>
//           </div>
//           {submitError && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
//               <h3>Lỗi khi nộp bài</h3>
//               <p>{submitError}</p>
//               <Button
//                 disabled={isSubmitting}
//                 variant="default"
//                 onClick={handleRetrySubmit}
//               >
//                 {isSubmitting ? "Đang thử lại..." : "Thử lại"}
//               </Button>
//             </div>
//           )}
//           {isSubmitting && <div>Đang nộp bài...</div>}
//           {!hasQuestions ? (
//             <div>Không tìm thấy câu hỏi.</div>
//           ) : (
//             <div className="space-y-4">
//               {viewMode === "single" ? currentQuestion : questionList}
//             </div>
//           )}
//         </div>
//         <div className="col-span-12 md:col-span-4">
//           <Sidebar
//             answers={selectedAnswers}
//             completedQuestions={completedQuestions}
//             isSubmitting={isSubmitting}
//             questions={questions}
//             remainingQuestions={remainingQuestions}
//             totalQuestions={questions.length}
//             onQuestionClick={scrollToQuestion}
//             onSubmit={handleSubmit}
//           />
//         </div>
//       </div>
//       <Toaster />
//     </>
//   );
// }

"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { QuizCard } from "./QuizCard";
import { Sidebar } from "./Sidebar";
import { QuizResults } from "./QuizResults";

import { Toaster } from "@/components/ui/sonner";
import {
  QuizData,
  Answers,
  StartAttemptResponse,
  convertApiQuestionToQuizQuestion,
  QuizQuestion,
} from "@/types/quiz";
import {
  startQuizAttempt,
  getQuizQuestions,
  submitQuizAttempt,
} from "@/app/api/quiz/quiz.api";
import { Button } from "@/components/ui/button";

interface QuizContainerProps {
  quizData: QuizData;
  onBackToList: () => void;
}

export function QuizContainer({ quizData, onBackToList }: QuizContainerProps) {
  const { data: session } = useSession();
  const [selectedAnswers, setSelectedAnswers] = useState<Answers>({});
  const [answers, setAnswers] = useState<Answers>({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "list">("single");
  const [attemptData, setAttemptData] = useState<
    StartAttemptResponse["data"] | null
  >(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<number | null>(null);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fetchQuizQuestions = async ([token, quizId]: [string, number]) => {
    try {
      setIsLoading(true);
      const response = await getQuizQuestions(token, quizId);
      const formattedQuestions = response.data.map((apiQuestion) =>
        convertApiQuestionToQuizQuestion(apiQuestion),
      );

      setQuestions(formattedQuestions);
      setIsLoading(false);
    } catch (error: any) {
      toast(error.message || "Lỗi khi tải câu hỏi quiz!", {
        className: "bg-red-500 text-white",
      });
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!session?.user?.token) {
      toast("Vui lòng đăng nhập để bắt đầu quiz!", {
        className: "bg-red-500 text-white",
      });

      return;
    }
    try {
      setIsLoading(true);
      const response = await startQuizAttempt(
        session.user.token,
        quizData.quizId,
      );

      setAttemptData(response.data);
      await fetchQuizQuestions([session.user.token, quizData.quizId]);
      setIsQuizStarted(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast(error.message || "Không thể bắt đầu quiz!", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleAnswerChange = useCallback(
    (questionId: number, optionId: number, isMultiple: boolean) => {
      setSelectedAnswers((prevAnswers) => {
        if (isMultiple) {
          const currentAnswers = (prevAnswers[questionId] as number[]) || [];
          const newAnswers = currentAnswers.includes(optionId)
            ? currentAnswers.filter((id) => id !== optionId)
            : [...currentAnswers, optionId];

          if (newAnswers.length === 0) {
            const { [questionId]: _, ...rest } = prevAnswers;

            return rest;
          }

          return {
            ...prevAnswers,
            [questionId]: newAnswers,
          };
        } else {
          return { ...prevAnswers, [questionId]: optionId };
        }
      });
    },
    [],
  );

  const handleClearAnswer = useCallback((questionId: number) => {
    setSelectedAnswers((prevAnswers) => {
      const { [questionId]: _, ...rest } = prevAnswers;

      return rest;
    });
  }, []);

  const nextQuestion = useCallback(() => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0,
    );
  }, [questions.length]);

  const handleSubmit = async () => {
    if (!session?.user?.token || !attemptData) {
      toast("Phiên đăng nhập hết hạn!", { className: "bg-red-500 text-white" });

      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      setAnswers(selectedAnswers);
      const formattedAnswers = Object.entries(selectedAnswers)
        .filter(([_, value]) =>
          Array.isArray(value)
            ? value.length > 0
            : value !== undefined && value !== null,
        )
        .map(([questionId, selectedOption]) => ({
          questionId: parseInt(questionId),
          selectedOptionIds: Array.isArray(selectedOption)
            ? selectedOption
            : [selectedOption],
        }));

      await submitQuizAttempt(
        session.user.token,
        quizData.quizId,
        attemptData.attemptId,
        formattedAnswers,
      );

      setReviewAttemptId(attemptData.attemptId);
      setIsSubmitted(true);
      setIsSubmitting(false);

      toast("Nộp bài thành công!", { className: "bg-green-500 text-white" });
    } catch (error: any) {
      setSubmitError(error.message || "Lỗi khi nộp bài!");
      setIsSubmitting(false);
      toast(error.message || "Lỗi khi nộp bài!", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleRetrySubmit = () => {
    setSubmitError(null);
    handleSubmit();
  };

  const scrollToQuestion = useCallback(
    (index: number) => {
      if (viewMode === "single") {
        setCurrentQuestionIndex(index);
      } else {
        questionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [viewMode],
  );

  const handleRetake = () => {
    setSelectedAnswers({});
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setViewMode("single");
    setSubmitError(null);
    setReviewAttemptId(null);
    handleStartQuiz();
  };

  const completedQuestions = Object.entries(selectedAnswers).reduce(
    (count, [_, value]) => {
      return count + (Array.isArray(value) && value.length === 0 ? 0 : 1);
    },
    0,
  );
  const remainingQuestions = questions.length - completedQuestions;
  const hasQuestions = questions.length > 0;

  const questionList = useMemo(
    () =>
      hasQuestions ? (
        questions.map((question, index) => (
          <div
            key={question.id}
            ref={(el: HTMLDivElement | null) => {
              questionRefs.current[index] = el;
            }}
            className="mb-8 pb-6 border-b border-gray-200"
          >
            <QuizCard
              answers={selectedAnswers}
              index={index}
              isListMode={true}
              question={question}
              onAnswerChange={handleAnswerChange}
              onClearAnswer={handleClearAnswer}
              onNext={() => {}}
            />
          </div>
        ))
      ) : (
        <div className="text-center p-4">Không có câu hỏi</div>
      ),
    [questions, selectedAnswers, handleAnswerChange, handleClearAnswer],
  );

  const currentQuestion = useMemo(
    () =>
      hasQuestions ? (
        <div
          ref={(el: HTMLDivElement | null) => {
            questionRefs.current[currentQuestionIndex] = el;
          }}
          className="min-h-screen"
        >
          <QuizCard
            answers={selectedAnswers}
            index={currentQuestionIndex}
            isListMode={false}
            question={questions[currentQuestionIndex]}
            onAnswerChange={handleAnswerChange}
            onClearAnswer={handleClearAnswer}
            onNext={nextQuestion}
          />
        </div>
      ) : (
        <div className="text-center p-4">Không có câu hỏi</div>
      ),
    [
      currentQuestionIndex,
      selectedAnswers,
      questions,
      handleAnswerChange,
      handleClearAnswer,
      nextQuestion,
    ],
  );

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!isQuizStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center p-6">
        <h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
        <p className="text-gray-600 mb-6">
          Số câu hỏi: {quizData.totalQuestions} | Thời gian:{" "}
          {attemptData?.remainingTimeInSeconds
            ? `${Math.floor(attemptData.remainingTimeInSeconds / 60)} phút`
            : "Đang tải..."}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleStartQuiz}>Bắt đầu làm quiz</Button>
          <Button onClick={onBackToList}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  if (isSubmitted && reviewAttemptId) {
    return (
      <QuizResults
        attemptId={reviewAttemptId}
        questions={questions}
        quizId={quizData.quizId}
        onBackToList={onBackToList}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto min-h-screen p-4">
        <div className="col-span-12 md:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "single" ? "default" : "secondary"}
                onClick={() => setViewMode("single")}
              >
                Từng câu
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "secondary"}
                onClick={() => setViewMode("list")}
              >
                Danh sách
              </Button>
            </div>
            <Button variant="default" onClick={onBackToList}>
              Quay lại danh sách
            </Button>
          </div>
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3>Lỗi khi nộp bài</h3>
              <p>{submitError}</p>
              <Button
                disabled={isSubmitting}
                variant="default"
                onClick={handleRetrySubmit}
              >
                {isSubmitting ? "Đang thử lại..." : "Thử lại"}
              </Button>
            </div>
          )}
          {isSubmitting && <div>Đang nộp bài...</div>}
          {!hasQuestions ? (
            <div>Không tìm thấy câu hỏi.</div>
          ) : (
            <div className="space-y-4">
              {viewMode === "single" ? currentQuestion : questionList}
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-4">
          <Sidebar
            answers={selectedAnswers}
            completedQuestions={completedQuestions}
            isSubmitting={isSubmitting}
            questions={questions}
            remainingQuestions={remainingQuestions}
            totalQuestions={questions.length}
            onQuestionClick={scrollToQuestion}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}
