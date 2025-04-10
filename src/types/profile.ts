export interface UserProfile {
  userId: number;
  userName: string;
  studentId: number;
  email: string;
  dob: string | null;
  profileImg: string | null;
  bio: string;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
}
export type UsertoStudent = {
  userId: number;
  userName: string;
  email: string;
};
