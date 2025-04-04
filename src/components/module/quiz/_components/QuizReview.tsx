"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getQuizAttemptReview,
  QuizReviewResponse,
} from "@/app/api/quiz/quiz.api";

interface QuizReviewProps {
  attemptId: number;
  onBackToResults: () => void;
  onBackToList: () => void;
}

export function QuizReview({
  attemptId,
  onBackToResults,
  onBackToList,
}: QuizReviewProps) {
  const { data: session } = useSession();
  const [reviewData, setReviewData] = useState<
    QuizReviewResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!session?.user?.token) {
        setError("Phiên đăng nhập hết hạn!");
        setIsLoading(false);

        return;
      }
      try {
        const response = await getQuizAttemptReview(
          session.user.token,
          attemptId,
        );

        setReviewData(response.data);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message || "Không thể tải dữ liệu xem lại.");
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [attemptId, session?.user?.token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu xem lại...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center text-red-500 mb-4">{error}</div>
        <div className="flex justify-center space-x-4">
          <Button
            className="bg-teal-500 hover:bg-teal-600"
            onClick={onBackToResults}
          >
            Quay lại kết quả
          </Button>
          <Button
            className="bg-gray-500 hover:bg-gray-600"
            onClick={onBackToList}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center text-gray-500 mb-4">
          Không có dữ liệu xem lại.
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            className="bg-teal-500 hover:bg-teal-600"
            onClick={onBackToResults}
          >
            Quay lại kết quả
          </Button>
          <Button
            className="bg-gray-500 hover:bg-gray-600"
            onClick={onBackToList}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {reviewData.quizTitle} - Xem lại
            </h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Thời gian làm bài: {reviewData.timeTaken}
              </p>
              <p className="text-sm text-gray-500">
                Ngày làm: {new Date(reviewData.dateTaken).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Tổng số câu hỏi</p>
              <p className="text-2xl font-bold text-blue-600">
                {reviewData.totalQuestions}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Số câu đúng</p>
              <p className="text-2xl font-bold text-green-600">
                {reviewData.correctAnswers}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm">Số câu sai/không trả lời</p>
              <p className="text-2xl font-bold text-red-600">
                {reviewData.incorrectAnswers + reviewData.unansweredQuestions}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-lg font-semibold">
                Điểm số:{" "}
                <span className="text-blue-600">
                  {reviewData.score.toFixed(2)}
                </span>
              </p>
              <p
                className={`font-medium ${reviewData.isPassed ? "text-green-600" : "text-red-600"}`}
              >
                Kết quả: {reviewData.isPassed ? "Đạt" : "Không đạt"}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                className="hover:scale-105 duration-100"
                onClick={onBackToResults}
              >
                Quay lại kết quả
              </Button>
              <Button
                className="hover:scale-105 duration-100"
                onClick={onBackToList}
              >
                Quay lại danh sách
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Chi tiết câu trả lời
      </h2>

      {reviewData.answers.map((answer, index) => (
        <motion.div
          key={answer.questionId}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={`border-l-4 ${
              answer.isCorrect
                ? "border-l-green-500"
                : answer.selectedOptions.length === 0
                  ? "border-l-gray-400"
                  : "border-l-red-500"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start mb-3">
                <div
                  className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full mr-3 ${
                    answer.isCorrect
                      ? "bg-green-100 text-green-600"
                      : answer.selectedOptions.length === 0
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {answer.isCorrect
                    ? "✓"
                    : answer.selectedOptions.length === 0
                      ? "?"
                      : "✗"}
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Câu {index + 1}: {answer.questionText}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {answer.questionType === "Single_choice"
                      ? "Một đáp án"
                      : "Nhiều đáp án"}
                  </p>
                </div>
              </div>
              {answer.selectedOptions.length > 0 ? (
                <div className="mb-3 pl-11">
                  <p className="text-sm text-gray-600 mb-2">Đáp án đã chọn:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {answer.selectedOptions.map((option) => (
                      <li key={option.optionId} className="text-gray-800">
                        {option.optionText}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mb-3 pl-11">
                  <p className="text-sm italic text-gray-500">
                    Bạn không chọn đáp án nào
                  </p>
                </div>
              )}
              {answer.explanation && (
                <div className="bg-blue-50 p-3 rounded-md mt-2 pl-11">
                  <p className="text-sm font-medium text-blue-700">
                    Giải thích:
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {answer.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
