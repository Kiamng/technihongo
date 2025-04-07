// src/types/study-plan.ts
import { Course } from "./course";

export type StudyPlan = {
  studyPlanId: number;
  course: Course;
  title: string;
  description: string;
  hoursPerDay: number;
  active: boolean;
  createdAt: string;
  default: boolean;
};
