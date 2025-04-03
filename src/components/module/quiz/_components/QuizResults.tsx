"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { QuizCard } from "./QuizCard";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  onBackToList: () => void;
}

export function QuizResults({
  attemptId,
  quizId,
  questions,
  onRetake,
  onBackToList,
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
    score: number; // Điểm thô từ API (score) theo thang 10
    total: number; // Tổng số câu hỏi
    isPassed: boolean; // Trạng thái đạt/không đạt
    correctAnswers: number; // Số câu đúng
    incorrectAnswers: number; // Số câu sai
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          // Lấy dữ liệu từ reviewResponse.data
          setCurrentAttempt({
            score: reviewResponse.data.score, // Điểm thô theo thang 10
            total: reviewResponse.data.totalQuestions, // Tổng số câu hỏi
            isPassed: reviewResponse.data.isPassed, // Trạng thái
            correctAnswers: reviewResponse.data.correctAnswers, // Số câu đúng
            incorrectAnswers: reviewResponse.data.incorrectAnswers, // Số câu sai
          });
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

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percentage = currentAttempt
    ? (currentAttempt.correctAnswers / currentAttempt.total) * 100 // Dùng correctAnswers cho biểu đồ
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

  if (errorMessage) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{errorMessage}</p>
        <Button onClick={onBackToList}>Quay lại danh sách</Button>
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

      <Card className="w-full max-w-md mx-auto shadow-lg mb-6">
        <CardHeader className="text-2xl font-bold text-center">
          Kết quả bài kiểm tra
        </CardHeader>
        <CardContent className="text-center">
          {currentAttempt && (
            <>
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
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
                    <span className="text-lg font-semibold text-gray-800">
                      {currentAttempt.correctAnswers}/{currentAttempt.total}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg mb-2">
                Tổng số câu hỏi:{" "}
                <span className="font-semibold">{currentAttempt.total}</span>
              </p>
              <p className="text-lg mb-2">
                Số câu đúng:{" "}
                <span className="font-semibold">
                  {currentAttempt.correctAnswers}
                </span>
              </p>
              <p className="text-lg mb-2">
                Điểm:{" "}
                <span className="font-semibold">
                  {currentAttempt.score.toFixed(2)}
                </span>
              </p>
              <p
                className={`text-lg font-semibold mb-4 ${
                  currentAttempt.isPassed ? "text-green-500" : "text-red-500"
                }`}
              >
                Trạng thái: {currentAttempt.isPassed ? "Đạt" : "Không đạt"}
              </p>
              <p className="text-gray-600 mb-6">
                {currentAttempt.isPassed
                  ? "Chúc mừng! Bạn đã làm bài rất tốt."
                  : "Rất tiếc! Hãy thử lại nhé!"}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={onRetake}>Làm lại</Button>
                <Button onClick={onBackToList}>Quay lại danh sách</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Phần review quiz với accordion */}
      {reviewData && questions && (
        <div className="max-w-4xl mx-auto">
          <Accordion collapsible type="single">
            <AccordionItem value="review">
              <AccordionTrigger className="bg-[#56D071] text-white hover:bg-[#4BBF62] rounded-t-md px-4 py-2">
                <h2 className="text-xl font-semibold">Chi tiết câu trả lời</h2>
              </AccordionTrigger>
              <AccordionContent className="bg-white p-4 rounded-b-md">
                {/* Bỏ hiển thị điểm */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {reviewData.answers.map((answer, index) => (
                    <Button
                      key={answer.questionId}
                      className={`w-10 h-10 flex items-center justify-center ${
                        answer.isCorrect
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : answer.selectedOptions.length === 0
                            ? "bg-gray-500 text-white hover:bg-gray-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                      onClick={() => setSelectedQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                {selectedQuestionIndex !== null && (
                  <QuizCard
                    answers={{}}
                    index={selectedQuestionIndex}
                    isListMode={false}
                    isReviewMode={true}
                    question={
                      questions.find(
                        (q) =>
                          q.id ===
                          reviewData.answers[selectedQuestionIndex].questionId,
                      ) || {
                        id: reviewData.answers[selectedQuestionIndex]
                          .questionId,
                        type:
                          reviewData.answers[selectedQuestionIndex]
                            .questionType === "Single_choice"
                            ? "single"
                            : "multiple",
                        question:
                          reviewData.answers[selectedQuestionIndex]
                            .questionText,
                        options: reviewData.answers[
                          selectedQuestionIndex
                        ].selectedOptions.map((opt) => ({
                          id: opt.optionId,
                          text: opt.optionText,
                        })),
                        correctAnswer: [],
                      }
                    }
                    reviewData={{
                      isCorrect:
                        reviewData.answers[selectedQuestionIndex].isCorrect,
                      selectedOptions:
                        reviewData.answers[selectedQuestionIndex]
                          .selectedOptions,
                      correctOptions:
                        questions
                          .find(
                            (q) =>
                              q.id ===
                              reviewData.answers[selectedQuestionIndex]
                                .questionId,
                          )
                          ?.options.filter((opt) =>
                            Array.isArray(
                              questions.find(
                                (q) =>
                                  q.id ===
                                  reviewData.answers[selectedQuestionIndex]
                                    .questionId,
                              )?.correctAnswer,
                            )
                              ? (
                                  questions.find(
                                    (q) =>
                                      q.id ===
                                      reviewData.answers[selectedQuestionIndex]
                                        .questionId,
                                  )?.correctAnswer as number[]
                                ).includes(opt.id)
                              : questions.find(
                                  (q) =>
                                    q.id ===
                                    reviewData.answers[selectedQuestionIndex]
                                      .questionId,
                                )?.correctAnswer === opt.id,
                          )
                          .map((opt) => ({
                            optionId: opt.id,
                            optionText: opt.text,
                          })) || [],
                    }}
                    onAnswerChange={() => {}}
                    onNext={() => {}}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Các lần thử gần đây với accordion */}
      {recentAttempts.length > 0 && (
        <div className="mt-6 max-w-4xl mx-auto">
          <Accordion collapsible type="single">
            <AccordionItem value="recent-attempts">
              <AccordionTrigger className="bg-[#56D071] text-white hover:bg-[#4BBF62] rounded-t-md px-4 py-2">
                <h2 className="text-xl font-semibold">Các lần thử gần đây</h2>
              </AccordionTrigger>
              <AccordionContent className="bg-white p-4 rounded-b-md">
                <div className="space-y-4">
                  {recentAttempts.map((attempt) => (
                    <div
                      key={attempt.attemptId}
                      className="p-4 bg-teal-50 rounded-lg shadow-sm"
                    >
                      <p className="font-medium">
                        {attempt.quiz.title} (Lần {attempt.attemptNumber})
                      </p>
                      <p>
                        Điểm:{" "}
                        <span className="font-semibold">
                          {attempt.score.toFixed(2)}
                        </span>
                      </p>
                      <p>Thời gian: {attempt.timeTaken}</p>
                      <p>
                        Ngày: {new Date(attempt.dateTaken).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </motion.div>
  );
}
