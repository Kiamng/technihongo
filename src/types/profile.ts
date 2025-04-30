export interface UserProfile {
  userId: number;
  userName: string;
  studentId: number;
  email: string;
  dob: string | null;
  profileImg: string | null;
  bio: string;
  occupation:
    | "STUDENT"
    | "EMPLOYED"
    | "UNEMPLOYED"
    | "FREELANCER"
    | "OTHER"
    | null;
  reminderEnabled: boolean;
  reminderTime: string | null; // kiểu "HH:mm:ss"
  dailyGoal: number;
  difficultyLevel: "N5" | "N4" | "N3" | "N2" | "N1" | null;
}

export type UsertoStudent = {
  userId: number;
  userName: string;
  email: string;
  profileImg: string;
};
