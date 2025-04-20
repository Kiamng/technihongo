import axiosClient from "@/lib/axiosClient";
import {
  QuizAttemptStatusResponse,
  QuizData,
  QuizQuestionsResponse,
  StartAttemptResponse,
} from "@/types/quiz";

// Định nghĩa interface cho response của API TopRecentQuizAttempts
export interface TopRecentQuizAttemptsResponse {
  success: boolean;
  message: string;
  data: {
    attemptId: number;
    quiz: QuizData;
    student: {
      studentId: number;
      bio: string | null;
      dailyGoal: number;
      occupation: string;
      reminderEnabled: boolean;
      reminderTime: string | null;
      difficultyLevel: string | null;
      updatedAt: string;
    };
    score: number;
    isPassed: boolean;
    timeTaken: string;
    isCompleted: boolean;
    attemptNumber: number;
    dateTaken: string;
  }[];
}

export interface QuizAttemptResponse {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  isPassed: boolean;
  timeTaken: string;
  isCompleted: boolean;
  attemptNumber: number;
  dateTaken: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  answers: {
    questionId: number;
    questionType: "Single_choice" | "Multiple_choice";
    questionText: string;
    selectedOptions: {
      optionId: number;
      optionText: string;
    }[];
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: QuizData[];
}

export interface SubmitQuizResponse {
  success: boolean;
  message: string;
  data: {
    attemptId: number;
    attemptNumber: number;
    completed: boolean;
    dateTaken: string;
    passed: boolean;
    quizId: number;
    remainingAttempts: number;
    remainingWaitTime: number;
    score: number;
    timeTaken: string;
  };
}

export interface QuizReviewResponse {
  success: boolean;
  message: string;
  data: QuizAttemptResponse;
}

const ENDPOINT = {
  ALL_QUIZZES: "/quiz/all",
  START_ATTEMPT: "/student-quiz-attempt/startAttempt",
  QUIZ_QUESTIONS: "/quiz-question/questions-options",
  SUBMIT_ATTEMPT: "/student-quiz-attempt/attempt",
  REVIEW_ATTEMPT: "/student-quiz-attempt/review",
  TOP_RECENT_ATTEMPTS: "/student-quiz-attempt/top-recent",
  GET_QUIZ_ATTEMPT_STATUS: "/student-quiz-attempt/attemptStatus",
};

export const getAllQuizzes = async (token: string): Promise<QuizData[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.ALL_QUIZZES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: ApiResponse = response.data;

    console.log("API response data:", data);
    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

export const startQuizAttempt = async (
  token: string,
  quizId: number,
): Promise<StartAttemptResponse> => {
  const response = await axiosClient.post(
    `${ENDPOINT.START_ATTEMPT}/${quizId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

export const getQuizQuestions = async (
  token: string,
  quizId: number,
): Promise<QuizQuestionsResponse> => {
  try {
    const response = await axiosClient.get(
      `${ENDPOINT.QUIZ_QUESTIONS}/${quizId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data: QuizQuestionsResponse = response.data;

    console.log("Quiz questions response:", data);
    if (!data.success) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};

export const submitQuizAttempt = async (
  token: string,
  quizId: number,
  attemptId: number,
  answers: { questionId: number; selectedOptionIds: number[] }[],
): Promise<SubmitQuizResponse> => {
  try {
    const payload = {
      quizId,
      attemptId,
      answers,
    };

    console.log("Submitting quiz attempt with payload:", payload);
    const response = await axiosClient.post(ENDPOINT.SUBMIT_ATTEMPT, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data: SubmitQuizResponse = response.data;

    console.log("Submit quiz response:", data);
    if (
      !data.success &&
      data.message !== "This quiz attempt has already been completed."
    ) {
      throw new Error(data.message);
    }

    return data;
  } catch (error: any) {
    console.error("Error submitting quiz attempt:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Lỗi khi nộp bài làm");
    }
    throw error;
  }
};

export const getQuizAttemptReview = async (
  token: string,
  attemptId: number,
): Promise<QuizReviewResponse> => {
  try {
    const response = await axiosClient.get(
      `${ENDPOINT.REVIEW_ATTEMPT}/${attemptId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data: QuizReviewResponse = response.data;

    console.log("Quiz review response:", data);
    if (!data.success) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error("Error fetching quiz review:", error);
    throw error;
  }
};

export const getTopRecentQuizAttempts = async (
  token: string,
  quizId: number,
): Promise<TopRecentQuizAttemptsResponse> => {
  try {
    const response = await axiosClient.get(
      `${ENDPOINT.TOP_RECENT_ATTEMPTS}/${quizId}`, // Sử dụng endpoint đúng
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data: TopRecentQuizAttemptsResponse = response.data;

    console.log("Top recent quiz attempts response:", data);
    if (!data.success) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error("Error fetching top recent quiz attempts:", error);
    throw error;
  }
};

export const getQuizAttemptStatus = async (
  token: string,
  quizId: number,
): Promise<QuizAttemptStatusResponse> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_QUIZ_ATTEMPT_STATUS}/${quizId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data.data;
};
