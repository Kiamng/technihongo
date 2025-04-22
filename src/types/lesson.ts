// src/types/lesson.ts
import { StudyPlan } from "./study-plan";

export type Lesson = {
  lessonId: number;
  studyPlan: StudyPlan;
  title: string;
  lessonOrder: number;
  createdAt: string;
  updatedAt: string | null;
  studentProgress: number | null;
};

export type LessonList = {
  content: Lesson[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
