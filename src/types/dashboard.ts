interface WeeklyStat {
  date: string;
  studyTime: number;
  completedLessons: number;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
  dailyGoalAchieved: boolean;
}

interface MonthlyStat {
  week: string;
  studyTime: number;
  completedLessons: number;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
}

interface YearlyStat {
  month: string;
  studyTime: number;
  completedLessons: number;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
}

interface LearningStats {
  weeklyStats: WeeklyStat[];
  monthlyStats: MonthlyStat[];
  yearlyStats: YearlyStat[];
}

interface LearningStatsResponse {
  success: boolean;
  message: string;
  data: LearningStats;
}
