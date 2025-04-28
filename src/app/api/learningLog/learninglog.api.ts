import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  VIEW_LOG: "/learning-log/view",
  VIEW_STATISTICS: "/statistics/view",
  VIEW_ACTIVITY_LOG: "/activity-log/student",
  TRACK_LOG: "/learning-log/track",
};

// export const getLearningLog = async ({
//   token,
//   date,
// }: {
//   token: string;
//   date?: string;
// }): Promise<LearningLog> => {
//   console.log(
//     `[${new Date().toISOString()}] Calling getLearningLog with date: ${date || "none"}`,
//   );
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

//     if (responseData.data) {
//       console.log(`[${new Date().toISOString()}] getLearningLog succeeded`);

//       return responseData.data;
//     }
//     throw new Error(responseData.message || "No learning log data returned");
//   } catch (error: any) {
//     console.error(
//       `[${new Date().toISOString()}] Error fetching learning log:`,
//       error,
//     );
//     throw error;
//   }
// };

export const getLearningStatistics = async ({
  token,
  studentId,
}: {
  token: string;
  studentId: number;
}): Promise<LearningStatistics> => {
  console.log(
    `[${new Date().toISOString()}] Calling getLearningStatistics for studentId: ${studentId}`,
  );
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

    if (responseData.data) {
      console.log(
        `[${new Date().toISOString()}] getLearningStatistics succeeded`,
      );

      return responseData.data;
    }
    throw new Error(
      responseData.message || "No learning statistics data returned",
    );
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching learning statistics:`,
      error,
    );
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
  console.log(
    `[${new Date().toISOString()}] Calling getActivityLog with page: ${page}, size: ${size}`,
  );
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

    if (responseData.data) {
      console.log(`[${new Date().toISOString()}] getActivityLog succeeded`);

      return responseData.data;
    }
    throw new Error(responseData.message || "No activity log data returned");
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching activity log:`,
      error,
    );
    throw error;
  }
};

// export const trackLearningLog = async ({
//   token,
//   studyTime,
// }: {
//   token: string;
//   studyTime: number;
// }): Promise<void> => {
//   console.log(
//     `[${new Date().toISOString()}] Calling trackLearningLog with studyTime: ${studyTime}`,
//   );
//   try {
//     const currentDate = new Date().toISOString().split("T")[0];

//     try {
//       await getLearningLog({ token, date: currentDate });
//       console.log(
//         `[${new Date().toISOString()}] trackLearningLog skipped: Log exists for ${currentDate}`,
//       );

//       return;
//     } catch (err) {
//       console.log(
//         `[${new Date().toISOString()}] No existing log for ${currentDate}, proceeding with trackLearningLog`,
//       );
//     }

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
//     console.log(`[${new Date().toISOString()}] trackLearningLog succeeded`);
//   } catch (error: any) {
//     console.error(
//       `[${new Date().toISOString()}] Error tracking learning log:`,
//       error,
//     );
//     throw error;
//   }
// };

export const trackLearningLog = async ({
  token,
  studyTime,
  studentId,
}: {
  token: string;
  studyTime: number;
  studentId: number;
}): Promise<void> => {
  console.log(
    `[${new Date().toISOString()}] Calling trackLearningLog with studyTime: ${studyTime}, studentId: ${studentId}`,
  );
  try {
    const params = new URLSearchParams();

    params.append("studyTime", studyTime.toString());
    params.append("studentId", studentId.toString());

    const response = await axiosClient.post(
      `${ENDPOINT.TRACK_LOG}?${params.toString()}`,
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
    console.log(`[${new Date().toISOString()}] trackLearningLog succeeded`);
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error tracking learning log:`,
      error,
    );
    throw error;
  }
};

export const getLearningLog = async ({
  token,
  date,
  studentId,
}: {
  token: string;
  date?: string;
  studentId: number;
}): Promise<LearningLog> => {
  console.log(
    `[${new Date().toISOString()}] Calling getLearningLog with date: ${date || "none"}, studentId: ${studentId}`,
  );
  try {
    const params = new URLSearchParams();

    if (date) params.append("date", date);
    params.append("studentId", studentId.toString());

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

    if (responseData.data) {
      console.log(`[${new Date().toISOString()}] getLearningLog succeeded`);

      return responseData.data;
    }
    throw new Error(responseData.message || "No learning log data returned");
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error fetching learning log:`,
      error,
    );
    throw error;
  }
};
