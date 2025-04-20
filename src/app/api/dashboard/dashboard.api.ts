// import axiosClient from "@/lib/axiosClient";

// const ENDPOINT = {
//   GET_STUDENT_LEARNING_STATS: "/dashboard/student/learning",
// };

// export const getStudentLearningStats = async (
//   token: string,
// ): Promise<LearningStats> => {
//   try {
//     const response = await axiosClient.get(
//       ENDPOINT.GET_STUDENT_LEARNING_STATS,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     const responseData = response.data as LearningStatsResponse;

//     if (responseData.success) {
//       return responseData.data;
//     }
//     throw new Error(responseData.message || "Không thể lấy thống kê học tập");
//   } catch (error: any) {
//     console.error("Error fetching learning stats:", error);
//     throw error;
//   }
// };

import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  GET_STUDENT_LEARNING_STATS: "/dashboard/student/learning",
  GET_STUDENT_QUIZ_STATS: "/dashboard/student/quiz",
};

interface QuizStat {
  date: string;
  averageScore: number;
}

interface QuizStatsResponse {
  success: boolean;
  message: string;
  data: QuizStat[];
}

interface LearningStats {
  weeklyStats: any[];
  monthlyStats: any[];
  yearlyStats: any[];
}

export const getStudentLearningStats = async (
  token: string,
): Promise<LearningStats> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_STUDENT_LEARNING_STATS,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = response.data as LearningStatsResponse;

    if (responseData.success) {
      return responseData.data;
    }
    throw new Error(responseData.message || "Không thể lấy thống kê học tập");
  } catch (error: any) {
    console.error("Error fetching learning stats:", error);
    throw error;
  }
};

export const getStudentQuizStats = async (
  token: string,
): Promise<QuizStat[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_STUDENT_QUIZ_STATS, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data as QuizStatsResponse;

    if (responseData.success) {
      return responseData.data;
    }
    throw new Error(responseData.message || "Không thể lấy thống kê quiz");
  } catch (error: any) {
    console.error("Error fetching quiz stats:", error);
    throw error;
  }
};
