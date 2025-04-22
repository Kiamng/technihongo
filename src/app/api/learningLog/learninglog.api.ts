// import axiosClient from "@/lib/axiosClient";

// interface Student {
//   studentId: number;
//   bio: string | null;
//   dailyGoal: number;
//   occupation: string;
//   reminderEnabled: boolean;
//   reminderTime: string | null;
//   difficultyLevel: string | null;
//   updatedAt: string;
// }

// interface LearningLog {
//   logId: number;
//   student: Student;
//   logDate: string;
//   studyTime: number;
//   completedLessons: number;
//   completedQuizzes: number;
//   completedResources: number;
//   completedFlashcardSets: number;
//   dailyGoalAchieved: boolean;
//   streak: number;
//   createdAt: string;
// }

// interface LearningStatistics {
//   learningStatId: number;
//   student: Student;
//   totalStudyTime: number;
//   totalCompletedCourses: number;
//   totalCompletedLessons: number;
//   totalCompletedQuizzes: number;
//   activeDaysCount: number;
//   maxDaysStreak: number;
//   totalAchievementsUnlocked: number;
//   lastStudyDate: string;
//   updatedAt: string;
// }

// interface LearningLogResponse {
//   success: boolean;
//   message: string;
//   data: LearningLog;
// }

// interface LearningStatisticsResponse {
//   success: boolean;
//   message: string;
//   data: LearningStatistics;
// }

// const ENDPOINT = {
//   VIEW_LOG: "/learning-log/view",
//   VIEW_STATISTICS: "/statistics/view",
//   VIEW_ACTIVITY_LOG: "/activity-log/student",
//   TRACK_LOG: "/learning-log/track",
// };

// export const getLearningLog = async ({
//   token,
//   date,
// }: {
//   token: string;
//   date?: string;
// }): Promise<LearningLog> => {
//   try {
//     const params = new URLSearchParams();

//     if (date) params.append("date", date);

//     const response = await axiosClient.get(
//       `${ENDPOINT.VIEW_LOG}${params.toString() ? `?${params.toString()}` : ""}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     const responseData = response.data as LearningLogResponse;

//     if (responseData.data) return responseData.data;
//     throw new Error(responseData.message || "No learning log data returned");
//   } catch (error: any) {
//     console.error("Error fetching learning log:", error);
//     throw error;
//   }
// };

// export const getLearningStatistics = async ({
//   token,
//   studentId,
// }: {
//   token: string;
//   studentId: number;
// }): Promise<LearningStatistics> => {
//   try {
//     const params = new URLSearchParams();

//     params.append("studentId", studentId.toString());

//     const response = await axiosClient.get(
//       `${ENDPOINT.VIEW_STATISTICS}?${params.toString()}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     const responseData = response.data as LearningStatisticsResponse;

//     if (responseData.data) return responseData.data;
//     throw new Error(
//       responseData.message || "No learning statistics data returned",
//     );
//   } catch (error: any) {
//     console.error("Error fetching learning statistics:", error);
//     throw error;
//   }
// };

// export const getActivityLog = async ({
//   token,
//   page = 0,
//   size = 20,
// }: {
//   token: string;
//   page?: number;
//   size?: number;
// }): Promise<ActivityLog[]> => {
//   try {
//     const params = new URLSearchParams();

//     params.append("page", page.toString());
//     params.append("size", size.toString());

//     const response = await axiosClient.get(
//       `${ENDPOINT.VIEW_ACTIVITY_LOG}?${params.toString()}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     const responseData = response.data as ActivityLogResponse;

//     if (responseData.data) return responseData.data;
//     throw new Error(responseData.message || "No activity log data returned");
//   } catch (error: any) {
//     console.error("Error fetching activity log:", error);
//     throw error;
//   }
// };

// export const trackLearningLog = async ({
//   token,
//   studyTime,
// }: {
//   token: string;
//   studyTime: number;
// }): Promise<void> => {
//   try {
//     const response = await axiosClient.post(
//       `${ENDPOINT.TRACK_LOG}?studyTime=${studyTime}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     const responseData = response.data as {
//       success: boolean;
//       message: string;
//       data: null;
//     };

//     if (!responseData.success) {
//       throw new Error(responseData.message || "Failed to track learning log");
//     }
//   } catch (error: any) {
//     console.error("Error tracking learning log:", error);
//     throw error;
//   }
// };

import axiosClient from "@/lib/axiosClient";

interface Student {
  studentId: number;
  bio: string | null;
  dailyGoal: number;
  occupation: string;
  reminderEnabled: boolean;
  reminderTime: string | null;
  difficultyLevel: string | null;
  updatedAt: string;
}

interface LearningLog {
  logId: number;
  student: Student;
  logDate: string;
  studyTime: number;
  completedLessons: number;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
  dailyGoalAchieved: boolean;
  streak: number;
  createdAt: string;
}

interface LearningStatistics {
  learningStatId: number;
  student: Student;
  totalStudyTime: number;
  totalCompletedCourses: number;
  totalCompletedLessons: number;
  totalCompletedQuizzes: number;
  activeDaysCount: number;
  maxDaysStreak: number;
  totalAchievementsUnlocked: number;
  lastStudyDate: string;
  updatedAt: string;
}

interface LearningLogResponse {
  success: boolean;
  message: string;
  data: LearningLog;
}

interface LearningStatisticsResponse {
  success: boolean;
  message: string;
  data: LearningStatistics;
}

interface ActivityLog {
  logId: number;
  description: string;
  activityType: string;
  createdAt: string;
}

interface ActivityLogResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
}

const ENDPOINT = {
  VIEW_LOG: "/learning-log/view",
  VIEW_STATISTICS: "/statistics/view",
  VIEW_ACTIVITY_LOG: "/activity-log/student",
  TRACK_LOG: "/learning-log/track",
};

export const getLearningLog = async ({
  token,
  date,
}: {
  token: string;
  date?: string;
}): Promise<LearningLog> => {
  try {
    const params = new URLSearchParams();

    if (date) params.append("date", date);

    const response = await axiosClient.get(
      `${ENDPOINT.VIEW_LOG}${params.toString() ? `?${params.toString()}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseData = response.data as LearningLogResponse;

    if (responseData.data) return responseData.data;
    throw new Error(responseData.message || "No learning log data returned");
  } catch (error: any) {
    console.error("Error fetching learning log:", error);
    throw error;
  }
};

export const getLearningStatistics = async ({
  token,
  studentId,
}: {
  token: string;
  studentId: number;
}): Promise<LearningStatistics> => {
  try {
    const params = new URLSearchParams();

    params.append("studentId", studentId.toString());

    const response = await axiosClient.get(
      `${ENDPOINT.VIEW_STATISTICS}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseData = response.data as LearningStatisticsResponse;

    if (responseData.data) return responseData.data;
    throw new Error(
      responseData.message || "No learning statistics data returned",
    );
  } catch (error: any) {
    console.error("Error fetching learning statistics:", error);
    throw error;
  }
};

export const getActivityLog = async ({
  token,
  page = 0,
  size = 20,
}: {
  token: string;
  page?: number;
  size?: number;
}): Promise<ActivityLog[]> => {
  try {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axiosClient.get(
      `${ENDPOINT.VIEW_ACTIVITY_LOG}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseData = response.data as ActivityLogResponse;

    if (responseData.data) return responseData.data;
    throw new Error(responseData.message || "No activity log data returned");
  } catch (error: any) {
    console.error("Error fetching activity log:", error);
    throw error;
  }
};

export const trackLearningLog = async ({
  token,
  studyTime,
}: {
  token: string;
  studyTime: number;
}): Promise<void> => {
  try {
    // Check for existing log to prevent duplicates
    const currentDate = new Date().toISOString().split("T")[0];

    try {
      await getLearningLog({ token, date: currentDate });

      return; // Skip if log exists
    } catch (err) {
      // Continue if no log exists (expected case)
    }

    const response = await axiosClient.post(
      `${ENDPOINT.TRACK_LOG}?studyTime=${studyTime}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const responseData = response.data as {
      success: boolean;
      message: string;
      data: null;
    };

    if (!responseData.success) {
      throw new Error(responseData.message || "Failed to track learning log");
    }
  } catch (error: any) {
    console.error("Error tracking learning log:", error);
    throw error;
  }
};
