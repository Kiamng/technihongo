export interface UserProfile {
  userId: number;
  userName: string;
  email: string;
  dob: string | null;
  profileImg: string | null;
  bio: string;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
}
