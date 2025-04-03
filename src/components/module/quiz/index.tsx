"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { QuizContainer } from "./_components/QuizContainer";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizData } from "@/types/quiz";
import { getAllQuizzes } from "@/app/api/quiz/quiz.api";

export function QuizList() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<QuizData[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await getAllQuizzes(session?.user.token as string);

      setQuizzes(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.token) {
      setError("Please log in to view quizzes");

      return;
    }
    fetchQuizzes();
  }, [session?.user?.token]);

  const handleStartQuiz = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
    fetchQuizzes();
  };

  if (selectedQuiz) {
    return (
      <QuizContainer quizData={selectedQuiz} onBackToList={handleBackToList} />
    );
  }

  if (isLoading) {
    return <div>Đang tải quizzes...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error.includes("log in") ? (
          <p>
            {error}.{" "}
            <a className="text-teal-500 hover:underline" href="/login">
              Go to Login
            </a>
          </p>
        ) : (
          `Error: ${error}`
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Public Quizzes</h1>
      {quizzes && quizzes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.quizId}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold text-teal-600">
                  {quiz.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {quiz.difficultyLevel.name} ({quiz.difficultyLevel.tag})
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{quiz.description}</p>
                <p className="text-sm text-gray-600">
                  Creator: {quiz.creator.userName}
                </p>
                <p className="text-sm text-gray-600">
                  Total Questions: {quiz.totalQuestions}
                </p>
                <p className="text-sm text-gray-600">
                  Passing Score: {(quiz.passingScore * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">
                  Created: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Button onClick={() => handleStartQuiz(quiz)}>
                    Start Quiz
                  </Button>
                  {quiz.premium && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      Premium
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No quizzes available.</p>
      )}
    </div>
  );
}
