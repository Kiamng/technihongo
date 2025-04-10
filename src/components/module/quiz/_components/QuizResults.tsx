"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { QuizCard } from "./QuizCard";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getQuizAttemptReview,
  getTopRecentQuizAttempts,
  QuizReviewResponse,
  TopRecentQuizAttemptsResponse,
} from "@/app/api/quiz/quiz.api";
import { QuizQuestion } from "@/types/quiz";

interface QuizResultsProps {
  attemptId: number;
  quizId: number;
  questions: QuizQuestion[];
  onRetake: () => void;
  hanldeCompleteLessonResource: (
    type: string,
    lessonReourceId: number,
    entityId: number,
  ) => Promise<void>;
  lessonResourceId: number;
}

export function QuizResults({
  attemptId,
  quizId,
  questions,
  onRetake,
  hanldeCompleteLessonResource,
  lessonResourceId,
}: QuizResultsProps) {
  const { data: session } = useSession();
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentAttempts, setRecentAttempts] = useState<
    TopRecentQuizAttemptsResponse["data"]
  >([]);
  const [reviewData, setReviewData] = useState<
    QuizReviewResponse["data"] | null
  >(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<{
    score: number;
    total: number;
    isPassed: boolean;
    correctAnswers: number;
    incorrectAnswers: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.token) {
        setErrorMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        toast("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
          className: "bg-red-500 text-white",
        });
        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      try {
        const attemptsResponse = await getTopRecentQuizAttempts(
          session.user.token,
          quizId,
        );

        setRecentAttempts(attemptsResponse.data);

        const reviewResponse = await getQuizAttemptReview(
          session.user.token,
          attemptId,
        );

        setReviewData(reviewResponse.data);

        const current = attemptsResponse.data.find(
          (a) => a.attemptId === attemptId,
        );

        if (current && reviewResponse.data) {
          setCurrentAttempt({
            score: reviewResponse.data.score,
            total: reviewResponse.data.totalQuestions,
            isPassed: reviewResponse.data.isPassed,
            correctAnswers: reviewResponse.data.correctAnswers,
            incorrectAnswers: reviewResponse.data.incorrectAnswers,
          });
          if (reviewResponse.data.isPassed) {
            hanldeCompleteLessonResource("Quiz", lessonResourceId, quizId);
          }
          setShowConfetti(reviewResponse.data.isPassed);
        } else {
          setErrorMessage("Không tìm thấy dữ liệu cho lần thử này.");
        }
      } catch (error: any) {
        setErrorMessage(error.message || "Lỗi khi tải dữ liệu kết quả.");
        toast(error.message || "Lỗi khi tải dữ liệu kết quả.", {
          className: "bg-red-500 text-white",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.token, attemptId, quizId]);

  useEffect(() => {
    // Initialize refs array
    questionRefs.current = questionRefs.current.slice(
      0,
      questions?.length || 0,
    );
  }, [questions]);

  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index);
    // Add a small delay to ensure the DOM is updated
    setTimeout(() => {
      questionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percentage = currentAttempt
    ? (currentAttempt.correctAnswers / currentAttempt.total) * 100
    : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 bg-gray-100"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <Confetti
          colors={["#10B981", "#3B82F6", "#F59E0B", "#EF4444"]}
          gravity={0.2}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          width={window.innerWidth}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <Card className="w-full shadow-lg mb-6">
          <CardHeader className="text-2xl font-bold text-center">
            Kết quả bài kiểm tra
          </CardHeader>
          <CardContent>
            {currentAttempt && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        fill="none"
                        r={radius}
                        stroke="#E5E7EB"
                        strokeWidth="10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        fill="none"
                        r={radius}
                        stroke={currentAttempt.isPassed ? "#10B981" : "#EF4444"}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        strokeWidth="10"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-gray-800">
                        {currentAttempt.correctAnswers}/{currentAttempt.total}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={onRetake}>Làm lại</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl">
                    Tổng số câu hỏi:{" "}
                    <span className="font-semibold">
                      {currentAttempt.total}
                    </span>
                  </p>
                  <p className="text-xl">
                    Số câu đúng:{" "}
                    <span className="font-semibold">
                      {currentAttempt.correctAnswers}
                    </span>
                  </p>
                  <p className="text-xl">
                    Điểm:{" "}
                    <span className="font-semibold">
                      {currentAttempt.score.toFixed(2)}
                    </span>
                  </p>
                  <p
                    className={`text-xl font-semibold ${currentAttempt.isPassed
                        ? "text-green-500"
                        : "text-red-500"
                      }`}
                  >
                    Trạng thái: {currentAttempt.isPassed ? "Đạt" : "Không đạt"}
                  </p>
                  <p className="text-gray-600">
                    {currentAttempt.isPassed
                      ? "Chúc mừng! Bạn đã làm bài rất tốt."
                      : "Rất tiếc! Hãy thử lại nhé!"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {reviewData && questions && (
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                Chi tiết câu trả lời
              </h2>
              <div className="grid grid-cols-10 gap-2 mb-6 sticky top-0 bg-white p-2 z-10">
                {reviewData.answers.map((answer, index) => (
                  <Button
                    key={answer.questionId}
                    className={`w-10 h-10 flex items-center justify-center ${answer.isCorrect
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : answer.selectedOptions.length === 0
                          ? "bg-gray-500 text-white hover:bg-gray-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <div className="space-y-6">
                {reviewData.answers.map((answer, index) => {
                  const question = questions.find(
                    (q) => q.id === answer.questionId,
                  );

                  return (
                    <div
                      key={answer.questionId}
                      ref={(el) => {
                        questionRefs.current[index] = el;
                      }}
                      className={`p-4 rounded-lg ${selectedQuestionIndex === index
                          ? "ring-2 ring-[#56D071]"
                          : ""
                        }`}
                    >
                      <QuizCard
                        answers={{}}
                        index={index}
                        isListMode={false}
                        isReviewMode={true}
                        question={
                          question || {
                            id: answer.questionId,
                            type:
                              answer.questionType === "Single_choice"
                                ? "single"
                                : "multiple",
                            question: answer.questionText,
                            options:
                              questions
                                .find((q) => q.id === answer.questionId)
                                ?.options.map((opt) => ({
                                  id: opt.id,
                                  text: opt.text,
                                })) || [],
                            correctAnswer:
                              questions.find((q) => q.id === answer.questionId)
                                ?.correctAnswer || [],
                          }
                        }
                        reviewData={{
                          isCorrect: answer.isCorrect,
                          selectedOptions: answer.selectedOptions,
                          correctOptions: [],
                        }}
                        onAnswerChange={() => { }}
                        onNext={() => { }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
