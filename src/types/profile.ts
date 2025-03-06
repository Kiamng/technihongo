export interface UserProfile {
  userId: number;
  userName: string;
  email: string;
  dob: string;
  profileImg: string | null;
  bio: string;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
}
