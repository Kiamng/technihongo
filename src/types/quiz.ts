// types/quiz.ts
export interface QuizData {
  quizId: number;
  title: string;
  description: string;
  creator: {
    userId: number;
    userName: string;
    email: string;
    password: string;
    dob: string | null;
    uid: string | null;
    createdAt: string;
    lastLogin: string;
    profileImg: string | null;
    student: any | null;
    active: boolean;
    verified: boolean;
  };
  difficultyLevel: {
    levelId: number;
    tag: string;
    name: string;
    description: string;
    createdAt: string;
  };
  totalQuestions: number;
  passingScore: number;
  timeLimit: number;
  createdAt: string;
  updatedAt: string | null;
  public: boolean;
  premium: boolean;
  deleted: boolean;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  type: "single" | "multiple";
  question: string;
  options: { id: number; text: string }[];
  correctAnswer: number | number[];
}

export interface Answers {
  [questionId: number]: number | number[];
}

export interface StartAttemptResponse {
  success: boolean;
  message: string;
  data: {
    attemptId: number;
    quizId: number;
    title: string;
    totalQuestions: number;
    attemptNumber: number;
    startTime: string;
    resuming: boolean;
    remainingTimeInSeconds: number;
  };
}

export interface QuizQuestionsResponse {
  success: boolean;
  message: string;
  data: ApiQuizQuestion[];
}

export interface ApiQuizQuestion {
  questionId: number;
  questionType: "Single_choice" | "Multiple_choice";
  questionText: string;
  explanation: string | null;
  url: string | null;
  options: ApiQuizOption[];
}

export interface ApiQuizOption {
  optionId: number;
  optionText: string;
  isCorrect: boolean;
}

export const convertApiQuestionToQuizQuestion = (
  apiQuestion: ApiQuizQuestion,
): QuizQuestion => {
  const correctAnswers = apiQuestion.options
    .filter((option) => option.isCorrect)
    .map((option) => option.optionId);

  // Shuffle the options array
  const shuffledOptions = [...apiQuestion.options].sort(
    () => Math.random() - 0.5,
  );

  return {
    id: apiQuestion.questionId,
    type: apiQuestion.questionType === "Single_choice" ? "single" : "multiple",
    question: apiQuestion.questionText,
    options: shuffledOptions.map((option) => ({
      id: option.optionId,
      text: option.optionText,
    })),
    correctAnswer:
      apiQuestion.questionType === "Single_choice" && correctAnswers.length > 0
        ? correctAnswers[0]
        : correctAnswers,
  };
};

export interface QuizAttemptStatusResponse {
  consecutiveAttempts: number;
  remainingWaitTime: number;
  remainingAttempts: number;
}
