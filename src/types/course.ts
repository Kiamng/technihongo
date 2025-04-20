import { Creator } from "./creator";
import { DifficultyLevel } from "./difficulty-level";
import { Domain } from "./domain";
import { StudyPlan } from "./study-plan";

export type Course = {
  courseId: number;
  title: string;
  description: string;
  creator: Creator;
  domain: Domain;
  difficultyLevel: DifficultyLevel;
  attachmentUrl: string;
  thumbnailUrl: string;
  estimatedDuration: string;
  enrollmentCount: number;
  createdAt: string;
  updateAt: string | null;
  publicStatus: boolean;
  premium: boolean;
};

export type CourseList = {
  content: Course[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type CourseProgress = {
  progressId: number;
  student: number;
  course: Course;
  completionPercentage: number;
  completionStatus: "COMPLETED" | "IN_PROGRESS" | "PAUSED" | "NOT_STARTED";
  currentLesson: {
    lessonId: number;
    studyPlan: StudyPlan;
    lessonOrder: number;
  };
  completedLessons: number;
  totalStudyDate: number;
  completedDate: Date;
  createdAt: Date;
};
