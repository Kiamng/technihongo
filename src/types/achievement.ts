export type Achievement = {
  achievementId: number;
  code: string | null;
  badgeName: string;
  description: string;
  imageURL: string | null;
  category: string;
  conditionType: string;
  conditionValue: number;
  displayOrder: number | null;
  createdAt?: string | null;
  updatedAt: string | null;
  achievedAt?: string | null;
  active: boolean;
};

export enum ConditionType {
  LESSON_COMPLETED = "LESSON_COMPLETED",
  QUIZ_PASSED = "QUIZ_PASSED",
  DAYS_STREAK = "DAYS_STREAK",
  FLASHCARD_COMPLETED = "FLASHCARD_COMPLETED",
  COURSE_COMPLETE = "COURSE_COMPLETE",
  CHALLENGE_COMPLETED = "CHALLENGE_COMPLETED",
}

// Thêm type cho API response
export interface AchievementResponse {
  success: boolean;
  message: string;
  data: Achievement[];
}
// Type cho thông tin học sinh (nếu cần)
export interface AchievementStudent {
  studentId: number;
  bio: string;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  difficultyLevel: {
    levelId: number;
    tag: string;
    name: string;
    description: string;
    createdAt: string;
  };
  updatedAt: string;
}

// Type cho mỗi mục trong data của API /student/achievement/{studentId}
export interface StudentAchievement {
  studentAchievementId: number;
  student: Student;
  achievement: Achievement;
  achievedAt: string;
}
export interface StudentAchievementResponse {
  success: boolean;
  message: string;
  data: StudentAchievement[] | null;
}
