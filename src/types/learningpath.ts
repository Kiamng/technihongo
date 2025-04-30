import { Domain } from "./domain";

export type LearningPath = {
  pathId: number;
  title: string;
  description: string;
  domain: Domain;
  totalCourses: number;
  public: boolean;
  createdAt: string;
};
