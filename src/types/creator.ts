import { DifficultyLevel } from "./difficulty-level";

export type Creator = {
  userId: number;
  userName: string;
  email: string;
  dob: Date;
  uid: string;
  createdAt: Date;
  lastLogin: Date;
  profileImg: string;
  student: Student;
  active: boolean;
  verified: boolean;
};

export type Student = {
  studentId: number;
  bio: string;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string;
  difficultyLevel: DifficultyLevel;
  updatedAt: string;
};
