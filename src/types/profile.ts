export interface UserProfile {
  userId: number;
  userName: string;
  email: string;
  dob: Date;
  profileImg: string | null;
  bio: string;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
}
